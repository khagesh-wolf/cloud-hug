import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Server, Wifi, WifiOff, RefreshCw, Settings2, QrCode, Copy, Check } from 'lucide-react';
import { getApiBaseUrl, checkBackendHealth } from '@/lib/apiClient';
import { wsSync } from '@/lib/websocketSync';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

export function ServerConfig() {
  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const isConnected = wsSync.isConnected();

  // Get the current app URL for QR code
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}` 
    : '';

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const healthy = await checkBackendHealth();
      if (healthy) {
        toast.success('Backend server is reachable!');
      } else {
        toast.error('Backend server is not responding');
      }
    } catch {
      toast.error('Failed to connect to backend');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveUrl = () => {
    if (serverUrl !== getApiBaseUrl()) {
      localStorage.setItem('api_base_url', serverUrl);
      toast.success('Server URL updated. Reloading...');
      window.location.reload();
    }
  };

  const handleReconnect = () => {
    wsSync.disconnect();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Server className="h-4 w-4" />
          {isConnected ? (
            <Badge variant="default" className="bg-green-500">Connected</Badge>
          ) : (
            <Badge variant="destructive">Disconnected</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Server Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code for connecting other devices */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Connect Other Devices
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </Button>
            </div>
            
            {showQR && (
              <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border">
                <QRCodeSVG 
                  value={currentUrl} 
                  size={180}
                  level="M"
                  includeMargin
                />
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                    {currentUrl}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={handleCopyUrl}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Scan with another device to open this app.<br/>
                  <strong>Tip:</strong> If mDNS doesn't work, use the IP address directly.
                </p>
              </div>
            )}
          </div>

          {/* Server URL */}
          <div className="space-y-2">
            <Label>Backend Server URL</Label>
            <div className="flex gap-2">
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://192.168.1.100:3001"
              />
              <Button
                variant="outline"
                onClick={handleSaveUrl}
                disabled={serverUrl === getApiBaseUrl()}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your backend server's IP address and port
            </p>
          </div>

          {/* Connection Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReconnect}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Important:</strong> All devices must be on the same network.</p>
            <p className="text-xs">
              ⚠️ If <code className="bg-muted px-1 rounded">hostname.local</code> doesn't work, 
              your device's Private DNS may be blocking mDNS. Use the IP address instead or 
              disable Private DNS in your phone's network settings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
