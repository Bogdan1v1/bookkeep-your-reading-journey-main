import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 1. Додаємо імпорт
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const { login, isAuthenticated } = useAuth(); // Додаємо isAuthenticated
  const navigate = useNavigate(); // 2. Ініціалізуємо навігацію

  // 3. Якщо користувач вже залогінений — одразу на Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Для Windows краще використовувати 127.0.0.1
    const API_BASE = 'https://bookkeep-your-reading-journey-main.onrender.com'; 
    
    const body = isLogin 
      ? { email, password } 
      : { email, password, username };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        login(data.token, data.user);
        toast({ title: "Welcome back!", description: "You successfully logged in." });
        navigate('/dashboard'); // 4. ПРИМУСОВЕ ПЕРЕНАПРАВЛЕННЯ!
      } else {
        setIsLogin(true);
        toast({ title: "Account created!", description: "Now please login." });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Login to BookKeep' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Input 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            )}
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <Button className="w-full gradient-primary" type="submit">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}