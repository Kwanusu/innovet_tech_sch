import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, markLessonComplete } from '../../school/schoolSlice';
import { 
    ChevronLeft, PlayCircle, CheckCircle2, 
    ChevronDown, ChevronUp, Loader2,
    Play, BookOpen, Check, ChevronRight,
    FileText
} from "lucide-react";
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LessonNavigationFooter from '../../pages/LessonNavigationFooter';

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
                toast.success("Progress Saved", { description: "Advancing..." });
                setTimeout(() => {
                    setActiveLesson(nextLesson);
                    const parentTopic = currentCourse.topics.find(t => 
                        t.lessons.some(l => l.id === nextLesson.id)
                    );
                    if (parentTopic && !expandedTopics.includes(parentTopic.id)) {
                        setExpandedTopics(prev => [...prev, parentTopic.id]);
                    }
                }, 800);
            }
        } catch (err) {
            toast.error("Error", { description: "Failed to update progress." });
        }
    };

    if (status === 'loading' && !currentCourse) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Classroom...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            <aside className="w-[340px] border-r bg-white flex flex-col shadow-xl z-20">
                <div className="p-6 border-b space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${courseId}`)} className="group -ml-2 text-slate-500 font-bold hover:text-indigo-600">
                        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Exit
                    </Button>
                    <div className="space-y-4">
                        <h2 className="font-black text-slate-900 leading-tight text-lg line-clamp-2">{currentCourse?.title}</h2>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</span>
                                <span className="text-xs font-black text-indigo-600">{stats.percent}%</span>
                            </div>
                            <Progress value={stats.percent} className="h-2 transition-all duration-500 ease-out" />
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-3 py-4">
                    <div className="space-y-3">
                        {currentCourse?.topics.map((topic, idx) => (
                            <div key={topic.id}>
                                <button onClick={() => toggleTopic(topic.id)} className={cn("w-full p-4 flex items-center justify-between rounded-2xl transition-all", expandedTopics.includes(topic.id) ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-100 text-slate-700")}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black", expandedTopics.includes(topic.id) ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-500")}>{idx + 1}</div>
                                        <span className="text-[13px] font-black text-left leading-tight">{topic.title}</span>
                                    </div>
                                    {expandedTopics.includes(topic.id) ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                </button>
                                {expandedTopics.includes(topic.id) && (
                                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-slate-100 pl-4">
                                        {topic.lessons.map(lesson => (
                                            <button key={lesson.id} onClick={() => setActiveLesson(lesson)} className={cn("w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all", activeLesson?.id === lesson.id ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-500")}>
                                                <div className={cn("shrink-0 p-1 rounded-full", completedLessons.includes(lesson.id) ? "bg-emerald-100 text-emerald-600" : "text-slate-300")}>
                                                    {completedLessons.includes(lesson.id) ? <Check size={12} strokeWidth={4} /> : <Play size={12} fill="currentColor" />}
                                                </div>
                                                <span className="text-xs font-medium">{lesson.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            <main className="flex-1 overflow-y-auto bg-white relative">
                {activeLesson ? (
                    <div className="max-w-4xl mx-auto p-8 lg:p-16 space-y-10 pb-40">
                        <div className="relative aspect-video bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white group">
                            {activeLesson.video_url ? (
                                <iframe src={activeLesson.video_url} className="w-full h-full" allowFullScreen title={activeLesson.title} />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <PlayCircle size={64} className="text-slate-800" />
                                    <p className="text-slate-500 text-xs font-bold uppercase">Video lesson not available</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Curriculum Content</p>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{activeLesson.title}</h1>
                                </div>
                                <Button size="lg" onClick={() => handleMarkComplete(activeLesson.id)} className={cn("rounded-2xl h-14 px-10 font-black", completedLessons.includes(activeLesson.id) ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-900 text-white")}>
                                    {completedLessons.includes(activeLesson.id) ? <CheckCircle2 className="mr-2 h-5 w-5" /> : "Complete & Continue"}
                                </Button>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-indigo-300">
                                    {activeLesson.content ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {activeLesson.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="flex flex-col items-center py-10 text-slate-400">
                                            <FileText className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="italic">No written content for this lesson.</p>
                                        </div>
                                    )}
                                </article>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                        <BookOpen size={64} strokeWidth={1.5} className="opacity-20" />
                        <p className="font-black uppercase tracking-widest text-sm text-slate-400">Select a lesson</p>
                    </div>
                )}
            </main>
            <LessonNavigationFooter 
                course={currentCourse}
                currentLessonId={activeLesson?.id}
                isCompleted={completedLessons.includes(activeLesson?.id)}
                onMarkAsComplete={() => handleMarkComplete(activeLesson?.id)}
                isSubmitting={status === 'loading'} 
            />
        </div>
    );
};

export default CourseCurriculum;