import React, { useState } from 'react';
import API from '../../api/axiosConfig'; 
import { X, Mail, Shield, UserPlus, Loader2, CheckCircle2, Copy, AlertTriangle, Key } from 'lucide-react';

const InviteStaffModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'TEACHER', 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteData, setInviteData] = useState(null); // Stores {temp_password, username}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post('api/admin/invite-staff/', formData);
      setInviteData(response.data); // Capture temp_password and username from backend
      onRefresh(); 
    } catch (err) {
      const serverError = err.response?.data;
      setError(serverError?.error || serverError?.detail || "Authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a "Copied!" toast here
  };

  const handleClose = () => {
    setInviteData(null);
    setError(null);
    setFormData({ email: '', full_name: '', role: 'TEACHER' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">System Onboarding</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {inviteData ? "Credentials Generated" : "Grant Institutional Credentials"}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {inviteData ? (
          <div className="p-8 space-y-6 animate-in fade-in zoom-in-90">
            <div className="w-full bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Access Authorized</p>
              <p className="text-slate-500 text-xs mt-1 font-medium">Please share these temporary details with the staff member.</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Username</span>
                  <span className="text-sm font-bold text-slate-900">{formData.email}</span>
                </div>
                <button onClick={() => copyToClipboard(formData.email)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-slate-900">
                  <Copy size={16} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Temporary Password</span>
                  <span className="text-sm font-mono font-bold text-slate-900 tracking-tight">{inviteData.temp_password}</span>
                </div>
                <button onClick={() => copyToClipboard(inviteData.temp_password)} className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-slate-900">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all"
            >
              Close Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-2xl flex items-center gap-2">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Staff Member Name</label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  required
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-slate-900 font-bold text-sm transition-all"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  required
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-slate-900 font-bold text-sm transition-all"
                  placeholder="staff@innovet.tech"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Tier</label>
              <div className="grid grid-cols-2 gap-3">
                {['TEACHER', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({...formData, role: r})}
                    className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.role === r 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200' 
                        : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <Shield size={12} /> {r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-300 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Onboarding"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteStaffModal;