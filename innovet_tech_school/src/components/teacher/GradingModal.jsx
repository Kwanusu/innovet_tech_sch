import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gradeSubmission } from '../../school/schoolSlice';
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Send, MessageSquareQuote, GraduationCap } from "lucide-react";

const GradingModal = ({ isOpen, onClose, submission }) => {
  const dispatch = useDispatch();
  
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submission) {
      setGrade(submission.grade?.toString() || "");
      setFeedback(submission.feedback || "");
    }
  }, [submission, isOpen]);

  const getScoreColor = (val) => {
    const num = parseInt(val);
    if (isNaN(num)) return "text-slate-400";
    if (num >= 80) return "text-emerald-500";
    if (num >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(grade) > 100 || parseInt(grade) < 0) {
      return toast.error("Invalid Score", { description: "Grade must be between 0 and 100." });
    }

    setLoading(true);
    const result = await dispatch(gradeSubmission({ 
      id: submission.id, 
      grade: parseInt(grade), 
      feedback 
    }));
    
    if (!result.error) {
      toast.success("Grade Published", {
        icon: <CheckCircle2 className="text-emerald-500" />,
        description: `${submission.student_name} has been notified of their result.`
      });
      onClose();
    } else {
      toast.error("Submission Failed", {
        description: "Could not save grade. Please try again."
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 p-2 rounded-xl">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">Assessment Portal</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 font-medium">
              Reviewing work for <span className="text-white font-bold">{submission?.student_name}</span>
            </DialogDescription>
          </DialogHeader>
          <MessageSquareQuote className="absolute right-8 top-8 h-12 w-12 text-white/5" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Final Score (%)
              </Label>
              <div className="relative">
                <Input 
                  id="grade"
                  type="number" 
                  min="0"
                  max="100"
                  placeholder="0-100" 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required 
                  className={`h-14 rounded-2xl text-2xl font-black transition-all border-slate-100 focus:ring-primary/20 ${getScoreColor(grade)}`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-black opacity-20 ${getScoreColor(grade)}`}>
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Quick Template
              </Label>
              <Select onValueChange={(val) => setFeedback(val)}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-100 font-bold text-slate-600">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="Excellent work! Your logic is sound and the documentation is thorough." className="font-medium">Excellent (A)</SelectItem>
                  <SelectItem value="Good effort. Minor improvements needed in code optimization." className="font-medium">Good (B)</SelectItem>
                  <SelectItem value="Solid foundation, but some core requirements were missed." className="font-medium">Average (C)</SelectItem>
                  <SelectItem value="Please review the lesson materials and resubmit for a higher grade." className="font-medium">Needs Work (F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Personalized Feedback
            </Label>
            <Textarea 
              id="feedback"
              placeholder="Provide constructive criticism or praise..." 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] rounded-2xl border-slate-100 p-4 font-medium leading-relaxed focus:ring-primary/20"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={onClose} type="button" className="rounded-xl font-bold text-slate-400 hover:text-slate-600">
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="h-12 px-8 rounded-xl font-black bg-slate-900 hover:bg-primary transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
              Publish Grade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradingModal;