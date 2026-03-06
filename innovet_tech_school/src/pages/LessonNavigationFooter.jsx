import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const LessonNavigationFooter = ({ 
  course, 
  currentLessonId, 
  isCompleted, 
  onMarkAsComplete, 
  isSubmitting 
}) => {
  const navigate = useNavigate();

  const navigation = useMemo(() => {
    const allLessons = course.topics?.flatMap(topic => topic.lessons) || [];
    const currentIndex = allLessons.findIndex(l => l.id.toString() === currentLessonId.toString());
    
    return {
      prev: allLessons[currentIndex - 1] || null,
      next: allLessons[currentIndex + 1] || null,
      isLast: currentIndex === allLessons.length - 1
    };
  }, [course, currentLessonId]);

  return (
    <footer className="fixed bottom-0 right-0 left-80 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40">
      <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
 
        <div className="flex-1">
          {navigation.prev ? (
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/courses/${course.id}/lessons/${navigation.prev.id}`)}
              className="group flex items-center gap-3 hover:bg-slate-50 rounded-xl px-4 py-6 transition-all"
            >
              <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous</p>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">{navigation.prev.title}</p>
              </div>
            </Button>
          ) : <div />}
        </div>

        <div className="flex-1 flex justify-center">
          {isCompleted ? (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
              <CheckCircle2 className="h-5 w-5 fill-emerald-600 text-white" />
              <span className="text-sm font-black uppercase tracking-tight">Lesson Completed</span>
            </div>
          ) : (
            <Button 
              onClick={onMarkAsComplete}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-2xl font-black text-sm bg-slate-900 hover:bg-primary hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Mark Lesson as Complete
            </Button>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {navigation.next ? (
            <Button 
              onClick={() => navigate(`/courses/${course.id}/lessons/${navigation.next.id}`)}
              className="group flex items-center gap-3 hover:bg-primary/5 rounded-xl px-4 py-6 transition-all text-primary border-none"
              variant="outline"
            >
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Next Lesson</p>
                <p className="text-sm font-black text-slate-900 line-clamp-1">{navigation.next.title}</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          ) : (
            navigation.isLast && (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-2xl font-black shadow-lg shadow-emerald-200"
                onClick={() => navigate(`/courses/${course.id}/congratulations`)}
              >
                <Trophy className="h-4 w-4 mr-2" /> Finish Course
              </Button>
            )
          )}
        </div>

      </div>
    </footer>
  );
};

export default LessonNavigationFooter;