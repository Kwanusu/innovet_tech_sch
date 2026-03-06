import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { enrollStudent } from '../../school/schoolSlice';
import { 
  UserPlus, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  BookOpen, 
} from "lucide-react";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const EnrollmentModal = ({ isOpen, onClose, courseId, courseTitle }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await dispatch(enrollStudent({ courseId, email })).unwrap();
      
      toast.success("Enrollment Successful", {
        description: `${email} has been added to ${courseTitle}.`,
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
      
      setEmail('');
      onClose();
    } catch (err) {
      toast.error("Enrollment Failed", {
        description: err.message || "Ensure the student email is registered and not already enrolled."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <div className="bg-slate-900 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                <UserPlus className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                Quick Enroll
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 font-medium">
              Manually grant a student access to this curriculum.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Course</p>
              <p className="text-sm font-bold text-slate-900 truncate">{courseTitle}</p>
            </div>
          </div>

          <form onSubmit={handleEnroll} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Student Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="name@student.com" 
                  className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-slate-900" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-row gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-12 rounded-xl font-bold text-slate-500"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !email} 
                className="flex-1 h-12 rounded-xl font-black bg-slate-900 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200/50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Confirm Enrollment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;