import { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, ChevronRight, Filter, GraduationCap, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CourseList = ({ courses = [], onSelectCourse }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://innovet-tech-sch.onrender.com';

  const filteredCourses = useMemo(() => {
    return (courses || [])
      .filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (b.progress || 0) - (a.progress || 0)); 
  }, [courses, searchTerm]);

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-emerald-500";
    if (progress > 50) return "bg-indigo-600";
    return "bg-amber-500";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
            <GraduationCap size={14} />
            Student Dashboard
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic">
            My <span className="text-indigo-600">Learning</span>
          </h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-slate-900 font-bold">{courses.length}</span> active enrollments.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-[450px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Search by title or course code..." 
              className="pl-10 h-12 bg-white border-slate-200 rounded-2xl focus-visible:ring-indigo-600 shadow-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50">
            <Filter className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const thumbnailUrl = course.thumbnail 
            ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${BACKEND_URL}${course.thumbnail}`)
            : null;
          
          const progress = course.progress || 0;

          return (
            <Card key={course.id} className="group flex flex-col border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] bg-white overflow-hidden">

              <div className="relative h-44 w-full overflow-hidden">
                {thumbnailUrl ? (
                  <img 
                    src={thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                    <LayoutGrid size={48} strokeWidth={1} />
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/95 text-slate-900 hover:bg-white backdrop-blur-md border-none px-3 py-1 rounded-xl shadow-sm font-black text-[10px] uppercase tracking-wider">
                    {course.category || "General"}
                  </Badge>
                </div>

                {progress === 100 && (
                   <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
                      <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-1.5 rounded-full">Completed</Badge>
                   </div>
                )}
              </div>

              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black uppercase tracking-widest">
                    {course.code || "CORE-01"}
                  </span>
                  <div className="flex items-center text-[11px] font-bold text-slate-400">
                    <Clock className="mr-1 h-3 w-3" /> {course.duration || "Self-paced"}
                  </div>
                </div>
                <CardTitle className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-6 flex-grow">
                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">
                  {course.description || "Start your journey with this comprehensive guide."}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Progress</span>
                    <span className="text-sm font-black text-slate-900">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000 ease-out rounded-full", getProgressColor(progress))}
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-slate-50/80 border-t border-slate-100 mt-auto">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <BookOpen size={14} className="text-indigo-500" />
                    {course.tasks?.length || 0} Modules
                  </div>
                  <Button 
                    onClick={() => onSelectCourse(course)}
                    className="bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl px-6 h-10 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200"
                  >
                    {progress > 0 ? "Resume" : "Start"} <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200">
          <div className="bg-white p-6 rounded-full shadow-xl mb-6">
            <Search className="h-10 w-10 text-indigo-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No matches found</h3>
          <p className="text-slate-500 font-medium mt-2 max-w-xs text-center leading-relaxed">
            We couldn't find any courses for <span className="text-indigo-600 font-bold italic">"{searchTerm}"</span>. 
          </p>
          <Button 
            variant="link" 
            onClick={() => setSearchTerm("")}
            className="mt-4 text-indigo-600 font-black uppercase tracking-widest text-xs"
          >
            Show All Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseList;