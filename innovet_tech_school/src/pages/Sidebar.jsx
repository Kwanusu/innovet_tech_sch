import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight, 
  Trophy, 
  Layout, 
  ArrowLeft,
  ShieldCheck 
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const LessonSidebar = ({ course, completedLessons = [] }) => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();

  const { user } = useSelector((state) => state.auth);

  const stats = useMemo(() => {
    const allLessons = course.topics?.flatMap(t => t.lessons) || [];
    const total = allLessons.length;
    const completed = completedLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [course, completedLessons]);

  return (
    <aside className="w-80 border-r bg-white flex flex-col h-[calc(100vh-65px)] sticky top-[65px] z-30 shadow-sm">
 
      <div className="p-6 border-b space-y-4 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <Link 
            to="/my-learning" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={12} /> Back to My Courses
          </Link>

          {user?.is_staff && (
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100"
            >
              <ShieldCheck size={12} /> Admin
            </Link>
          )}
        </div>
        
        <div>
          <h2 className="font-black text-slate-900 leading-tight line-clamp-2 text-lg">
            {course.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[9px] font-black px-2 py-0.5 rounded-md">
              {user?.is_staff ? 'INSTRUCTOR VIEW' : 'STUDENT VIEW'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b bg-white">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
              Your Progress
            </span>
            <span className="text-sm font-black text-slate-900">
              {stats.percentage}%
            </span>
          </div>
          <Progress value={stats.percentage} className="h-2 bg-slate-100" />
          <p className="text-[10px] font-bold text-slate-500 text-right">
            {stats.completed} of {stats.total} lessons finished
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 pb-20 space-y-8">
          {course.topics?.map((topic, tIdx) => (
            <div key={topic.id} className="space-y-2">

              <div className="px-3 flex items-center justify-between group">
                <div>
                  <h3 className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em]">
                    Module {tIdx + 1}
                  </h3>
                  <p className="text-sm font-black text-slate-800 leading-tight">
                    {topic.title}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {topic.lessons?.map((lesson) => {
                  const isCurrent = lesson.id.toString() === lessonId;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                      className={`group w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all relative ${
                        isCurrent 
                          ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <div className={`p-1 rounded-full ${isCurrent ? 'bg-emerald-400' : 'bg-emerald-100'}`}>
                            <CheckCircle2 className={`h-3 w-3 ${isCurrent ? 'text-slate-900' : 'text-emerald-600'}`} />
                          </div>
                        ) : (
                          <PlayCircle className={`h-5 w-5 transition-colors ${
                            isCurrent ? 'text-white' : 'text-slate-300 group-hover:text-primary'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-[13px] block truncate ${isCurrent ? 'font-bold' : 'font-medium'}`}>
                          {lesson.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">
                            Currently Viewing
                          </span>
                        )}
                      </div>

                      {isCurrent ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {stats.percentage === 100 && (
            <div className="mx-2 p-5 bg-gradient-to-br from-indigo-50 to-emerald-50 border border-emerald-100 rounded-[2rem] text-center space-y-3 shadow-sm animate-in zoom-in-95 duration-500">
              <div className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto ring-4 ring-emerald-50">
                <Trophy className="text-emerald-500 h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Course Mastered</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1">
                  You've completed every lesson in this path.
                </p>
              </div>
              <button className="w-full py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md shadow-emerald-200">
                Claim Certificate
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-primary">
                <Layout size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-[10px] font-bold uppercase">Grid View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
          v2.4.0 Stable
        </span>
      </div>
    </aside>
  );
};

export default LessonSidebar;