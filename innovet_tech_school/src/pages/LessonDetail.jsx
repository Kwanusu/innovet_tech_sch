import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, markLessonComplete } from '../../features/school/schoolSlice';
import LessonSidebar from '../../components/learning/LessonSidebar';
import LessonNavigationFooter from '../../components/learning/LessonNavigationFooter';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LessonDetailPage = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();

  const { currentCourse, completedLessons, status, error } = useSelector((state) => state.school);
  const isSubmitting = status === 'updating-progress'; 

  useEffect(() => {
    
    if (!currentCourse || currentCourse.id.toString() !== courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId, currentCourse]);

  
  const currentLesson = currentCourse?.topics
    ?.flatMap((t) => t.lessons)
    .find((l) => l.id.toString() === lessonId);

  const isCompleted = completedLessons.includes(parseInt(lessonId));

  const handleMarkComplete = () => {
    dispatch(markLessonComplete({ courseId, lessonId }));
  };

  if (status === 'loading' && !currentCourse) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-10">
        <Alert variant="destructive" className="rounded-2xl border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Lesson</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white">

      <LessonSidebar 
        course={currentCourse || {}} 
        completedLessons={completedLessons} 
      />

      <main className="flex-1 flex flex-col relative bg-slate-50/30">
        
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto py-12 px-8 md:px-12 pb-32">
            {currentLesson ? (
              <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-primary rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Active Lesson
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {currentLesson.title}
                  </h1>
                </div>

                {currentLesson.video_url && (
                   <div className="aspect-video w-full rounded-[2rem] bg-slate-900 shadow-2xl overflow-hidden border-8 border-white">
                     <iframe 
                       src={currentLesson.video_url} 
                       className="w-full h-full"
                       title="Lesson Video"
                       allowFullScreen
                     />
                   </div>
                )}

                <div 
                  className="prose prose-slate prose-lg max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight 
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }} 
                />
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                 <Loader2 className="h-8 w-8 text-slate-200 animate-spin mb-4" />
                 <p className="text-slate-400 font-bold">Locating lesson materials...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {currentCourse && (
          <LessonNavigationFooter 
            course={currentCourse}
            currentLessonId={lessonId}
            isCompleted={isCompleted}
            onMarkAsComplete={handleMarkComplete}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
};

export default LessonDetailPage;