import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../../features/school/schoolSlice';
import { 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Trophy, 
  ChevronRight, 
  User,
  ArrowLeft,
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const LessonLandingPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCourse, completedLessons, status } = useSelector((state) => state.school);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  const allLessons = currentCourse?.topics?.flatMap(t => t.lessons) || [];
  const progressPercent = allLessons.length > 0 
    ? Math.round((completedLessons.length / allLessons.length) * 100) 
    : 0;

  const firstIncompleteLesson = allLessons.find(l => !completedLessons.includes(l.id)) || allLessons[0];

  if (status === 'loading') return <div className="p-20 text-center font-black animate-pulse">LOADING SYLLABUS...</div>;
  if (!currentCourse) return <div className="p-20 text-center">Course not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      <div className="bg-slate-900 pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/browse" className="text-slate-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft size={12} /> Back to Catalog
          </Link>

          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-6">
              <Badge className="bg-primary/20 text-primary border-none rounded-md px-3 py-1 font-black text-[10px] uppercase tracking-tighter">
                {currentCourse.code}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                {currentCourse.title}
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
                {currentCourse.description}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">{allLessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Instructor: {currentCourse.teacher_name || 'Expert'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
              <h3 className="text-slate-900 font-black text-xl mb-4">Your Journey</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-black">
                    <span>{progressPercent}% Complete</span>
                    <span className="text-slate-400">{completedLessons.length}/{allLessons.length}</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-slate-100" />
                </div>
                
                <Button 
                  onClick={() => navigate(`/courses/${courseId}/lessons/${firstIncompleteLesson?.id}`)}
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black text-md shadow-xl transition-all group"
                >
                  {progressPercent > 0 ? 'Resume Learning' : 'Start Course'}
                  <Play className="ml-2 h-4 w-4 fill-current group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b bg-slate-50/50">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum Architecture</h2>
          </div>

          <div className="p-2">
            {currentCourse.topics?.map((topic, tIdx) => (
              <div key={topic.id} className="mb-2">

                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Module 0{tIdx + 1}</span>
                    <h3 className="text-lg font-black text-slate-800">{topic.title}</h3>
                  </div>
                </div>

                <div className="space-y-1 px-4 pb-4">
                  {topic.lessons?.map((lesson) => {
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                      <Link 
                        key={lesson.id}
                        to={`/courses/${courseId}/lessons/${lesson.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                      >
                        <div className={`p-2 rounded-xl transition-colors ${isDone ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-white'}`}>
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Play className="h-5 w-5 text-slate-400 group-hover:text-primary fill-transparent group-hover:fill-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-300 uppercase">Lesson</span>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {tIdx !== currentCourse.topics.length - 1 && <Separator className="mx-8 w-auto bg-slate-100" />}
              </div>
            ))}
          </div>

          <div className="p-8 bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-2xl">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xl font-black">Course Certification</h4>
                <p className="text-indigo-100 text-sm font-medium">Complete all modules to earn your diploma.</p>
              </div>
            </div>
            <Badge variant="outline" className="border-white/30 text-white font-black px-6 py-2 rounded-xl">
               LOCKED
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonLandingPage;