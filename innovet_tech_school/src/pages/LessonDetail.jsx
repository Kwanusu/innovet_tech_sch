import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, markLessonComplete } from '../school/schoolSlice';
import LessonSidebar from '../pages/Sidebar';
import LessonNavigationFooter from '../pages/LessonNavigationFooter';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertCircle, FileText, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LessonDetailPage = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();

  const { currentCourse, completedLessons, status, error } = useSelector((state) => state.school);
  const isSubmitting = status === 'updating-progress';

  // 1. Fetch Course Data if not present or ID mismatch
  useEffect(() => {
    if (!currentCourse || currentCourse.id.toString() !== courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId, currentCourse]);

  // 2. Memoize Lesson Finding to prevent unnecessary recalculations
  const currentLesson = useMemo(() => {
    return currentCourse?.topics
      ?.flatMap((t) => t.lessons)
      .find((l) => l.id.toString() === lessonId);
  }, [currentCourse, lessonId]);

  const isCompleted = completedLessons.includes(parseInt(lessonId));

  const handleMarkComplete = () => {
    dispatch(markLessonComplete({ courseId, lessonId }));
  };

  // --- LOADING STATE ---
  if (status === 'loading' && !currentCourse) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading course materials...</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
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
      {/* Sidebar Navigation */}
      <LessonSidebar 
        course={currentCourse || {}} 
        completedLessons={completedLessons} 
      />

      <main className="flex-1 flex flex-col relative bg-slate-50/30">
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto py-12 px-8 md:px-12 pb-32">
            
            {currentLesson ? (
              <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Lesson Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-primary rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Module Content
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {currentLesson.title}
                  </h1>
                </div>

                {/* Video Player Section */}
                {currentLesson.video_url && (
                  <div className="aspect-video w-full rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-200 overflow-hidden border-[12px] border-white relative group">
                    <iframe 
                      src={currentLesson.video_url} 
                      className="w-full h-full"
                      title="Lesson Video"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Text Content Section */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[300px]">
                  {currentLesson.content ? (
                    <div 
                      className="prose prose-slate prose-lg max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight 
                        prose-p:text-slate-600 prose-p:leading-relaxed
                        prose-strong:text-slate-900"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }} 
                    />
                  ) : (
                    /* DEBUG/FALLBACK: If Content is missing but Lesson was found */
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="bg-slate-50 p-4 rounded-full">
                        <FileText className="h-10 w-10 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-900 font-bold italic">No text content found.</p>
                        <p className="text-slate-400 text-sm max-w-xs">
                          The lesson details were retrieved, but the written content field is currently empty in the database.
                        </p>
                      </div>
                      
                      {/* Technical Debug Info (Remove in Production) */}
                      <div className="mt-8 p-3 bg-slate-900 rounded-xl text-left">
                         <p className="text-[10px] font-mono text-emerald-400">Available Data Keys:</p>
                         <code className="text-[10px] font-mono text-slate-400">
                           {JSON.stringify(Object.keys(currentLesson))}
                         </code>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ) : (
              /* LESSON NOT FOUND STATE */
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <Loader2 className="h-8 w-8 text-slate-200 animate-spin mb-4" />
                <p className="text-slate-400 font-bold">Verifying lesson path...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Navigation Controls */}
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