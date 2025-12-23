import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useWaiterCallNotification() {
  const waiterCalls = useStore((state) => state.waiterCalls);
  const previousCallIdsRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const isInitializedRef = useRef(false);

  const playWaiterCallSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Create a distinctive bell/chime sound for waiter calls
      // First chime - lower tone
      const playChime = (startTime: number, freq1: number, freq2: number, duration: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.frequency.setValueAtTime(freq1, startTime);
        osc2.frequency.setValueAtTime(freq2, startTime);
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.35, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
      };

      // Play a distinctive 3-tone bell pattern
      const now = ctx.currentTime;
      playChime(now, 659, 830, 0.3);        // E5 + G#5
      playChime(now + 0.35, 784, 988, 0.3); // G5 + B5  
      playChime(now + 0.7, 988, 1319, 0.5); // B5 + E6
      
      console.log('Waiter call notification sound played');
    } catch (error) {
      console.log('Waiter call audio notification failed:', error);
    }
  };

  useEffect(() => {
    const pendingCalls = waiterCalls.filter(c => c.status === 'pending');
    const currentPendingIds = new Set(pendingCalls.map(c => c.id));
    
    // Skip initial load
    if (!isInitializedRef.current) {
      previousCallIdsRef.current = currentPendingIds;
      isInitializedRef.current = true;
      console.log('Waiter call notification initialized with', currentPendingIds.size, 'pending calls');
      return;
    }
    
    // Check for NEW waiter calls
    let hasNewCalls = false;
    currentPendingIds.forEach(id => {
      if (!previousCallIdsRef.current.has(id)) {
        hasNewCalls = true;
        console.log('New waiter call detected:', id);
      }
    });
    
    if (hasNewCalls) {
      playWaiterCallSound();
    }
    
    previousCallIdsRef.current = currentPendingIds;
  }, [waiterCalls]);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      console.log('Waiter call audio context enabled');
    };
    
    document.addEventListener('click', enableAudio, { once: true });
    return () => document.removeEventListener('click', enableAudio);
  }, []);

  return { playWaiterCallSound };
}