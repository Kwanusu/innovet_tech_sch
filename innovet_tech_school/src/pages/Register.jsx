import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Loader2, 
  ArrowLeft, Eye, EyeOff, AlertCircle, School 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { register, clearAuthError } from '../components/auth/authSlice'; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'STUDENT' 
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/login?registered=true');
    }
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
              Manage your academic life in one place.
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Join the portal to access courses, track your tasks, and stay updated with school events.
            </p>
          </div>
          
          <p className="text-sm opacity-70">&copy; 2026 Innovet Tech School</p>
        </div>

        <CardContent className="p-8 md:p-12 lg:p-16 bg-white">
          <div className="mb-8">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary">
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground mt-2">Enter your details to get started</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              {['STUDENT', 'TEACHER'].map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={formData.role === r ? "default" : "ghost"}
                  size="sm"
                  className="rounded-md font-semibold"
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username" name="username" placeholder="johndoe" 
                  className="pl-10 h-11 rounded-xl" required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" name="email" type="email" placeholder="m@example.com" 
                  className="pl-10 h-11 rounded-xl" required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" name="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pl-10 pr-10 h-11 rounded-xl" required
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : "Sign Up"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;