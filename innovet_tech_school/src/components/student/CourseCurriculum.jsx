import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, markLessonComplete } from '../../school/schoolSlice';
import { 
    ChevronLeft, PlayCircle, CheckCircle2, 
    ChevronDown, ChevronUp, Loader2,
    Play, BookOpen, Check, ChevronRight
} from "lucide-react";
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CourseCurriculum = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse, status, completedLessons = [] } = useSelector((state) => state.school);

    const [activeLesson, setActiveLesson] = useState(null);
    const [expandedTopics, setExpandedTopics] = useState([]);

    useEffect(() => {
        dispatch(fetchCourseById(courseId));
    }, [dispatch, courseId]);

    useEffect(() => {
        if (currentCourse?.topics?.length > 0 && !activeLesson) {
            const firstTopic = currentCourse.topics[0];
            setActiveLesson(firstTopic.lessons[0]);
            setExpandedTopics([firstTopic.id]);
        }
    }, [currentCourse, activeLesson]);

    const allLessonsFlat = useMemo(() => {
        return currentCourse?.topics?.flatMap(t => t.lessons) || [];
    }, [currentCourse]);

    const stats = useMemo(() => {
        const total = allLessonsFlat.length;
        const completedCount = completedLessons.length;
        return {
            total,
            completedCount,
            percent: total > 0 ? Math.round((completedCount / total) * 100) : 0
        };
    }, [allLessonsFlat, completedLessons]);

    const findNextLesson = () => {
        if (!activeLesson) return null;
        const currentIndex = allLessonsFlat.findIndex(l => l.id === activeLesson.id);
        if (currentIndex !== -1 && currentIndex < allLessonsFlat.length - 1) {
            return allLessonsFlat[currentIndex + 1];
        }
        return null;
    };

    const toggleTopic = (id) => {
        setExpandedTopics(prev => 
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        );
    };

    const handleMarkComplete = async (lessonId) => {
        try {
            await dispatch(markLessonComplete({ courseId, lessonId })).unwrap();
            
            const nextLesson = findNextLesson();
            if (nextLesson) {
                toast.success("Progress Saved", {
                    description: "Advancing to the next lesson...",
                    duration: 2000
                });

                setTimeout(() => {
                    setActiveLesson(nextLesson);
                    
                    const parentTopic = currentCourse.topics.find(t => 
                        t.lessons.some(l => l.id === nextLesson.id)
                    );
                    if (parentTopic && !expandedTopics.includes(parentTopic.id)) {
                        setExpandedTopics(prev => [...prev, parentTopic.id]);
                    }
                }, 800);
            } else {
                toast.success("Course Completed!", {
                    description: "Congratulations! You've reached the end of the curriculum."
                });
            }
        } catch (err) {
            toast.error("Error", { description: "Failed to update progress." });
        }
    };

    if (status === 'loading' && !currentCourse) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading your classroom...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">

            <aside className="w-[340px] border-r bg-white flex flex-col shadow-xl z-20">
                <div className="p-6 border-b space-y-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/courses/${courseId}`)} 
                        className="group -ml-2 text-slate-500 font-bold hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
                        Exit Classroom
                    </Button>
                    
                    <div className="space-y-4">
                        <h2 className="font-black text-slate-900 leading-tight text-lg line-clamp-2">
                            {currentCourse?.title}
                        </h2>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Progress</span>
                                <span className="text-xs font-black text-indigo-600">{stats.percent}%</span>
                            </div>
                            <Progress value={stats.percent} className="h-2 bg-slate-200" />
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-3 py-4">
                    <div className="space-y-3">
                        {currentCourse?.topics.map((topic, idx) => {
                            const isExpanded = expandedTopics.includes(topic.id);
                            return (
                                <div key={topic.id}>
                                    <button 
                                        onClick={() => toggleTopic(topic.id)}
                                        className={cn(
                                            "w-full p-4 flex items-center justify-between rounded-2xl transition-all",
                                            isExpanded ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "hover:bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                                                isExpanded ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-500"
                                            )}>
                                                {idx + 1}
                                            </div>
                                            <span className="text-[13px] font-black text-left leading-tight">{topic.title}</span>
                                        </div>
                                        {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-100 pl-4 animate-in slide-in-from-top-2">
                                            {topic.lessons.map(lesson => {
                                                const isActive = activeLesson?.id === lesson.id;
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={cn(
                                                            "w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all",
                                                            isActive ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100" : "hover:bg-slate-50 text-slate-500"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "shrink-0 p-1 rounded-full",
                                                            isCompleted ? "bg-emerald-100 text-emerald-600" : "text-slate-300"
                                                        )}>
                                                            {isCompleted ? <Check size={12} strokeWidth={4} /> : <Play size={12} fill="currentColor" />}
                                                        </div>
                                                        <span className={cn("text-xs font-medium", isActive && "font-bold text-indigo-700")}>
                                                            {lesson.title}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </aside>

            <main className="flex-1 overflow-y-auto bg-white relative">
                {activeLesson ? (
                    <div className="max-w-4xl mx-auto p-8 lg:p-16 space-y-10 pb-40">
                        {/* Video Area */}
                        <div className="relative aspect-video bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-6 bg-white/10 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform cursor-pointer">
                                    <PlayCircle size={64} className="text-white fill-white/10" />
                                </div>
                            </div>
                            <div className="absolute bottom-8 left-8">
                                <Badge className="bg-indigo-600 font-black px-4 py-1.5 rounded-lg shadow-lg">STUDENT MODE</Badge>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Curriculum Content</p>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                                        {activeLesson.title}
                                    </h1>
                                </div>
                                <Button 
                                    size="lg"
                                    onClick={() => handleMarkComplete(activeLesson.id)}
                                    className={cn(
                                        "rounded-2xl h-14 px-10 font-black transition-all",
                                        completedLessons.includes(activeLesson.id) 
                                            ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100" 
                                            : "bg-slate-900 hover:bg-indigo-600 text-white shadow-2xl shadow-indigo-100"
                                    )}
                                >
                                    {completedLessons.includes(activeLesson.id) ? (
                                        <><CheckCircle2 className="mr-2 h-5 w-5" /> Completed</>
                                    ) : "Complete & Continue"}
                                </Button>
                            </div>

                            <article className="prose prose-slate max-w-none">
                                <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 text-slate-700 leading-relaxed text-lg shadow-inner">
                                    {activeLesson.content || "No written materials available for this specific lesson."}
                                </div>
                            </article>
                            {findNextLesson() && (
                                <div className="mt-16 p-8 rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                            <Play size={24} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Up Next</p>
                                            <h4 className="text-lg font-black text-slate-900">{findNextLesson().title}</h4>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setActiveLesson(findNextLesson())}
                                        variant="ghost" 
                                        className="rounded-xl font-black gap-2 group-hover:text-indigo-600"
                                    >
                                        Jump to Next <ChevronRight size={16} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                        <BookOpen size={64} strokeWidth={1.5} className="opacity-20" />
                        <p className="font-black uppercase tracking-widest text-sm text-slate-400">Select a lesson to begin</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CourseCurriculum;