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
        if (!course?.topics || !currentLessonId) {
            return { prev: null, next: null, isLast: false };
        }

        const allLessons = course.topics.flatMap(topic => topic.lessons || []);

        const currentIndex = allLessons.findIndex(l => 
            l.id?.toString() === currentLessonId?.toString()
        );

        return {
            prev: allLessons[currentIndex - 1] || null,
            next: allLessons[currentIndex + 1] || null,

            isLast: currentIndex !== -1 && currentIndex === allLessons.length - 1
        };
    }, [course, currentLessonId]);

    if (!course || !currentLessonId) return null;

    return (
        <footer className="fixed bottom-0 right-0 left-0 lg:left-[340px] bg-white/80 backdrop-blur-xl border-t border-slate-100 z-40 transition-all duration-300">
            <div className="max-w-5xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">

                <div className="flex-1">
                    {navigation.prev ? (
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate(`/courses/${course.id}/lessons/${navigation.prev.id}`)}
                            className="group flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2 md:px-4 py-6 transition-all"
                        >
                            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                                <ChevronLeft className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Previous</p>
                                <p className="text-sm font-bold text-slate-900 line-clamp-1 max-w-[150px]">{navigation.prev.title}</p>
                            </div>
                        </Button>
                    ) : <div />}
                </div>
                <div className="flex-1 flex justify-center">
                    {isCompleted ? (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 md:px-6 py-2.5 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
                            <CheckCircle2 className="h-5 w-5 fill-emerald-600 text-white" />
                            <span className="text-xs md:text-sm font-black uppercase tracking-tight">Completed</span>
                        </div>
                    ) : (
                        <Button 
                            onClick={onMarkAsComplete}
                            disabled={isSubmitting}
                            className="h-12 px-6 md:px-8 rounded-2xl font-black text-sm bg-slate-900 hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-slate-200 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            <span className="hidden sm:inline">Mark as Complete</span>
                            <span className="sm:hidden">Complete</span>
                        </Button>
                    )}
                </div>
                <div className="flex-1 flex justify-end">
                    {navigation.next ? (
                        <Button 
                            onClick={() => navigate(`/courses/${course.id}/lessons/${navigation.next.id}`)}
                            className="group flex items-center gap-3 hover:bg-indigo-50 rounded-xl px-2 md:px-4 py-6 transition-all text-indigo-600 border-none"
                            variant="outline"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Next Lesson</p>
                                <p className="text-sm font-black text-slate-900 line-clamp-1 max-w-[150px]">{navigation.next.title}</p>
                            </div>
                            <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </Button>
                    ) : (
                        navigation.isLast && (
                            <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-2xl font-black shadow-lg shadow-emerald-200 text-white"
                                onClick={() => navigate(`/courses/${course.id}/congratulations`)}
                            >
                                <Trophy className="h-4 w-4 mr-2" /> 
                                <span className="hidden sm:inline">Finish Course</span>
                                <span className="sm:hidden">Finish</span>
                            </Button>
                        )
                    )}
                </div>

            </div>
        </footer>
    );
};

export default LessonNavigationFooter;