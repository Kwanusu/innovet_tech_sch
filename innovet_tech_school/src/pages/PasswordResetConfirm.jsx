import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, School, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import API from '../api/axiosConfig';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('verifying'); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await API.get(`api/auth/validate-token/${uid}/${token}/`);
        setStatus('idle');
      } catch (err) {
        setError("This password reset link is invalid or has expired.");
        setStatus('error');
      }
    };
    validateToken();
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setStatus('loading');
    try {
      await API.post(`api/auth/reset-password-confirm/${uid}/${token}/`, {
        password: formData.password
      });
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
      setStatus('idle');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verifying Security Token...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-lg overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
        <CardContent className="p-8 md:p-12">
          
          {status === 'success' ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Password Updated</h1>
                <p className="text-slate-500 font-medium text-sm">Your security credentials have been refreshed. Redirecting you to login...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Password</h1>
                <p className="text-muted-foreground mt-2 font-medium">Create a strong password for your account</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl border-none bg-rose-50 text-rose-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold text-xs uppercase tracking-tight">{error}</AlertDescription>
                </Alert>
              )}

              {status !== 'error' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700 ml-1">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-12 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700 ml-1">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        type="password"
                        required
                        className="pl-12 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-md font-bold shadow-lg mt-4" 
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : "Update Credentials"}
                  </Button>
                </form>
              )}

              {status === 'error' && (
                <Button asChild variant="outline" className="w-full h-12 rounded-xl mt-4">
                  <Link to="/forgot-password">Request New Link</Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordConfirm;