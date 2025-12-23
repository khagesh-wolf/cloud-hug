import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, User, Coffee } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser, settings } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/counter');
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const success = login(username, password);
    
    if (success) {
      toast.success('Login successful!');
      const user = useStore.getState().currentUser;
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/counter');
      }
    } else {
      toast.error('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-card p-10 rounded-3xl shadow-xl w-full max-w-md border border-border">
        {/* Logo */}
        <div className="w-16 h-16 gradient-primary rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-warm">
          <Coffee className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8">
          Sign in to {settings.restaurantName}
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-12 h-14 bg-muted/50 border-border rounded-xl text-base"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 h-14 bg-muted/50 border-border rounded-xl text-base"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 gradient-primary text-primary-foreground font-bold rounded-xl shadow-warm hover:opacity-90 transition-opacity text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 p-5 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground text-center mb-3 font-medium">Demo Credentials</p>
          <div className="text-sm text-center space-y-2">
            <p><span className="font-semibold text-foreground">Admin:</span> <span className="text-muted-foreground">admin / admin123</span></p>
            <p><span className="font-semibold text-foreground">Counter:</span> <span className="text-muted-foreground">counter / counter123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
