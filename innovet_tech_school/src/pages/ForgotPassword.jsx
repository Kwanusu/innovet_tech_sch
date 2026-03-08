import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, School, CheckCircle2, Dot, Send } from 'lucide-react';
import API from '../api/axiosConfig';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      await API.post('api/auth/forgot-password/', { email });
      setStatus('success');
    } catch (err) {
      setStatus('success');
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
              Security and access, simplified.
            </h2>
            <p className="text-primary-foreground/80 text-lg font-medium">
              Don't worry, it happens to the best of us. Enter your email and we'll help you get back into your campus dashboard.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm opacity-70">
            <span>Privacy Policy</span>
            <Dot className="h-4 w-4 fill-current" />
            <span>Support</span>
          </div>
        </div>

        <CardContent className="p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center">
          {status === 'success' ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Check your email</h1>
                <p className="text-muted-foreground mt-2 font-medium leading-relaxed">
                  If an account is associated with <span className="text-slate-900 font-bold">{email}</span>, 
                  you'll receive a password reset link shortly.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl border-slate-200">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h1>
                <p className="text-muted-foreground mt-2 font-medium">We'll send a recovery link to your inbox</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      className="flex w-full pl-10 h-12 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Recovery Link
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center border-t border-slate-100 pt-8">
                <Link to="/login" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-all">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Return to Login
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;