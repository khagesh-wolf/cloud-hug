import { useState, useEffect, useCallback } from 'react';
import { checkSubscription, SubscriptionStatus } from '@/lib/centralSupabase';

// Cache key and duration
const CACHE_KEY = 'chiyadani:subscription';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache
const CHECK_INTERVAL = 60 * 60 * 1000; // Re-check every hour

interface CachedSubscription {
  status: SubscriptionStatus;
  timestamp: number;
}

// Get cached subscription from localStorage
function getCachedSubscription(): SubscriptionStatus | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedSubscription = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    
    // Return cached if still valid (within cache duration)
    if (age < CACHE_DURATION) {
      return parsed.status;
    }
    return null;
  } catch {
    return null;
  }
}

// Save subscription to localStorage cache
function setCachedSubscription(status: SubscriptionStatus): void {
  try {
    const cache: CachedSubscription = {
      status,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage errors
  }
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(() => {
    // Initialize from cache immediately
    return getCachedSubscription();
  });
  const [isLoading, setIsLoading] = useState(() => {
    // If we have cached data, don't show loading
    return getCachedSubscription() === null;
  });
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const refresh = useCallback(async (force = false) => {
    // Skip if we have valid cache and not forcing
    if (!force) {
      const cached = getCachedSubscription();
      if (cached) {
        setStatus(cached);
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(true);
    try {
      const subscriptionStatus = await checkSubscription();
      setStatus(subscriptionStatus);
      setLastChecked(new Date());
      // Cache the result
      setCachedSubscription(subscriptionStatus);
    } catch (error) {
      // On error, assume valid and do NOT block access
      const fallbackStatus: SubscriptionStatus = {
        isValid: true,
        isTrial: false,
        daysRemaining: null,
        expiresAt: null,
        plan: null,
        message: 'Could not verify subscription - temporary access granted',
      };
      setStatus(fallbackStatus);
      // Don't cache error states
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if no cache exists
    const cached = getCachedSubscription();
    if (!cached) {
      refresh(true);
    }

    // Set up periodic refresh (background, non-blocking)
    const interval = setInterval(() => refresh(true), CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  // Block only when we positively know it is expired/invalid
  const daysRemainingKnown = typeof status?.daysRemaining === 'number';
  const isExpired = daysRemainingKnown && (status!.daysRemaining as number) <= 0;
  const isValid = (status?.isValid ?? true) && !isExpired;

  return {
    status,
    isLoading,
    lastChecked,
    refresh: () => refresh(true), // Force refresh when manually called
    isValid,
    showWarning:
      isValid &&
      daysRemainingKnown &&
      (status!.daysRemaining as number) <= 7 &&
      (status!.daysRemaining as number) > 0,
  };
}
