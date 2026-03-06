import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, clearAuthError } from '../components/auth/authSlice';
import { Lock, User, Loader2, AlertCircle, School, CheckCircle2, Dot } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const justRegistered = new URLSearchParams(location.search).get('registered');
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    return () => dispatch(clearAuthError());
  }, [isAuthenticated, navigate, from, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden border-none shadow-2xl rounded-3xl">
        
        <div className="hidden md:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
          <div className="flex items-center gap-2">
            <School className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Innovet Tech</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome back to your digital campus.
            </h2>
            <p className="text-primary-foreground/80 text-lg font-medium">
              Log in to access your personalized dashboard, track your learning progress, and connect with your instructors.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm opacity-70">
            <span>Privacy Policy</span>
            <Dot className="h-4 w-4 fill-current" />
            <span>Support</span>
          </div>
        </div>

        <CardContent className="p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h1>
            <p className="text-muted-foreground mt-2 font-medium">Enter your credentials to access your account</p>
          </div>

          {justRegistered && !error && (
            <Alert className="mb-6 bg-emerald-50 border-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="font-medium">
                Registration successful! You can now log in.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {typeof error === 'string' ? error : 'Invalid username or password'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-semibold text-slate-700">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="username" 
                  name="username" 
                  placeholder="Enter your username" 
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all" 
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" name="password" className="font-semibold text-slate-700">Password</Label>
                <Link to="/forgot-password" name="password" className="text-xs font-bold text-primary hover:underline">
                    Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all" 
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : "Sign In"}
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-slate-100 pt-8">
            <p className="text-sm font-semibold text-slate-500">
              New to our school?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 hover:underline underline-offset-4 decoration-2 transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;