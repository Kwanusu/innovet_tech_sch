import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, fetchSubmissions } from '../../school/schoolSlice';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, GraduationCap, Clock, ChevronRight, 
  Loader2, CheckCircle2, Layout, Sparkles, Trophy 
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { courses = [], submissions = [], status } = useSelector((state) => state.school);
  
  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchSubmissions());
  }, [dispatch]);

  const stats = useMemo(() => {
    const graded = submissions.filter(s => s.grade !== null);
    const avg = graded.length > 0 
      ? Math.round(graded.reduce((acc, curr) => acc + parseFloat(curr.grade), 0) / graded.length) 
      : 0;

    return {
      completed: graded.length,
      pending: submissions.filter(s => s.grade === null).length,
      averageGrade: avg
    };
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <GraduationCap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
        </div>
        <p className="text-slate-500 font-black tracking-widest uppercase text-xs animate-pulse">
          Preparing your desk...
        </p>
      </div>
    );
  }

  if (!isLoading && courses.length === 0) {
    return (
      <div className="container mx-auto p-10 min-h-[70vh] flex items-center justify-center">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[3rem] p-8 text-center space-y-6 bg-white">
          <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ready to start?</h2>
            <p className="text-slate-500 font-medium">
              You aren't enrolled in any courses yet. Explore our catalog to begin your journey.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/browse')} 
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Browse Catalog
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-10 animate-in fade-in duration-700">

      <div className="relative bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl shadow-slate-900/20 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-primary hover:bg-primary border-none text-white font-black px-4 py-1 rounded-full mb-2">
            STUDENT PORTAL
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Keep pushing, <span className="text-primary italic">{user?.username}!</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            {stats.pending > 0 
              ? `Your focus is paying off. You have ${stats.pending} assignments awaiting review from your instructors.` 
              : "You're at the top of your game! All assignments are currently up to date."}
          </p>
          <div className="flex gap-4 pt-4">
            <Button onClick={() => navigate('/browse')} className="rounded-xl font-bold h-12 px-6">
              Explore Courses
            </Button>
            <Button variant="outline" className="rounded-xl font-bold h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10">
              View Schedule
            </Button>
          </div>
        </div>

        <div className="absolute right-[-5%] top-[-10%] opacity-10 rotate-[15deg] pointer-events-none">
          <GraduationCap size={400} />
        </div>
        <Sparkles className="absolute bottom-10 right-10 text-primary opacity-20 h-24 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen />} label="Enrolled" value={courses.length} color="text-primary" />
        <StatCard icon={<Clock />} label="Pending" value={stats.pending} color="text-amber-500" />
        <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.completed} color="text-emerald-500" />
        <StatCard icon={<Trophy />} label="Avg. Score" value={`${stats.averageGrade}%`} color="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Layout className="h-6 w-6 text-primary" /> My Learning Path
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="group border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-[2rem] bg-white overflow-hidden flex flex-col">
                <CardHeader className="p-7 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg border-none uppercase text-[10px] tracking-widest">
                      {course.code || "COURSE"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-7 pb-7 flex-1 flex flex-col">
                  <CardDescription className="text-slate-500 font-medium line-clamp-2 mb-6">
                    {course.description || "Dive back into your curriculum and continue where you left off."}
                  </CardDescription>
                  <Button 
                    className="mt-auto w-full rounded-xl font-black h-12 bg-slate-50 text-slate-900 hover:bg-primary hover:text-white transition-all shadow-none group-hover:shadow-lg group-hover:shadow-primary/20" 
                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                  >
                    Continue Learning <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Feedback</h2>
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.slice(0, 4).map(sub => (
                <div 
                  key={sub.id} 
                  className="group p-5 bg-white border-none shadow-lg shadow-slate-200/40 rounded-2xl flex items-center justify-between hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer" 
                  onClick={() => navigate(`/submissions/${sub.id}`)}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{sub.task_title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <BookOpen size={10} /> {sub.course_title}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    {sub.grade ? (
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm border border-emerald-100">
                        {sub.grade}%
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border border-amber-100 animate-pulse">
                        Pending
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-white border-2 border-dashed border-slate-100 rounded-3xl">
                <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-sm">Feedback will appear here once you submit tasks.</p>
              </div>
            )}
            <Button variant="ghost" className="w-full rounded-xl font-bold text-slate-400 hover:text-primary">
              View All Submissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
    <CardContent className="p-6 flex items-center gap-5">
      <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors shadow-inner ${color}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default StudentDashboard;