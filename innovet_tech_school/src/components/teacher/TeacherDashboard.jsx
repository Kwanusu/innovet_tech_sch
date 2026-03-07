import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSubmissions, 
  fetchCourses, 
  deleteCourse, 
  updateCourse 
} from '../../school/schoolSlice';

// --- Components ---
import GradingModal from './GradingModal';
import EnrollmentModal from '../teacher/EnrolmentModal'; 
import CourseCreateForm from '../../components/courses/CourseCreationForm'; 
import API from '../../api/axiosConfig'

// --- Shadcn UI ---
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// --- Icons ---
import { 
  BookOpen, Users, Plus, ArrowLeft, MoreVertical, 
  Trash2, Edit3, UserPlus, Send, Archive, 
  LayoutDashboard, ClipboardCheck, GraduationCap, 
  Search, Dot, Settings2
} from "lucide-react";
import { toast } from 'sonner';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const { submissions = [], instructorCourses = [], status } = useSelector((state) => state.school);
  const { user } = useSelector((state) => state.auth);

  // Local UI State
  const [selectedSub, setSelectedSub] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'create', 'edit'
  const [editingCourse, setEditingCourse] = useState(null);
  const [enrollModal, setEnrollModal] = useState({ open: false, courseId: null, title: '' });
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchSubmissions());
    dispatch(fetchCourses());
  }, [dispatch]);

  // --- Logic & Filtering ---
  const pendingSubmissions = useMemo(() => 
    submissions.filter(s => !s.grade), [submissions]
  );

  const filteredCourses = useMemo(() => {
    return instructorCourses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'published' ? course.is_published : !course.is_published);
      return matchesSearch && matchesStatus;
    });
  }, [instructorCourses, searchQuery, statusFilter]);

  // --- Handlers ---
  const handleTogglePublish = async (course) => {
    const newStatus = !course.is_published;
    try {
      await dispatch(updateCourse({ 
        id: course.id, 
        data: { is_published: newStatus } 
      })).unwrap();
      toast.success(newStatus ? "Course is now LIVE!" : "Course moved to Drafts.");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setView('edit');
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure? This will remove all student progress.")) {
      try {
        await dispatch(deleteCourse(id)).unwrap();
        toast.success("Course deleted successfully.");
      } catch (err) {
        toast.error("Could not delete. Check for active students.");
      }
    }
  };

  // --- Sub-View: Create/Edit ---
  if (view === 'create' || view === 'edit') {
    return (
      <div className="container mx-auto p-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-10">
            <Button 
                variant="outline" 
                onClick={() => { setView('dashboard'); setEditingCourse(null); }} 
                className="rounded-xl font-bold border-2"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Exit Editor
            </Button>
            <div className="text-right">
                <Badge variant="secondary" className="mb-1 uppercase tracking-widest text-[10px] font-black">
                    {view === 'edit' ? "Editor Mode" : "Creator Mode"}
                </Badge>
                <h2 className="text-2xl font-black text-slate-900 italic">
                    {view === 'edit' ? editingCourse?.title : "New Curriculum"}
                </h2>
            </div>
        </div>

        <CourseCreateForm 
          initialData={editingCourse} 
          isEditMode={view === 'edit'}
          onSuccess={() => { 
            setView('dashboard'); 
            setEditingCourse(null); 
            dispatch(fetchCourses()); 
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-10 selection:bg-primary/10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Instructor Hub <GraduationCap className="text-primary h-9 w-9" />
          </h1>
          <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold">
            <span>Logged in as {user?.username}</span>
            <Dot className="h-4 w-4 text-slate-300" />
            <span className="text-primary">{instructorCourses.length} Courses</span>
          </div>
        </div>
        <Button 
          onClick={() => setView('create')} 
          className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 text-md"
        >
          <Plus className="mr-2 h-6 w-6" /> Create Course
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-10">
        <TabsList className="bg-white/70 backdrop-blur-sm border p-1.5 rounded-2xl shadow-sm h-16 w-fit inline-flex">
          <TabsTrigger value="overview" className="rounded-xl px-8 h-full data-[state=active]:shadow-md font-bold">
            <LayoutDashboard className="h-4 w-4 mr-2" /> My Courses
          </TabsTrigger>
          <TabsTrigger value="grading" className="rounded-xl px-8 h-full data-[state=active]:shadow-md font-bold">
            <ClipboardCheck className="h-4 w-4 mr-2" /> 
            Grading Queue 
            {pendingSubmissions.length > 0 && (
              <Badge className="ml-2 bg-primary animate-pulse">{pendingSubmissions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-3xl shadow-sm">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Find a course..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-slate-50/50 border-none rounded-2xl focus-visible:ring-4 focus-visible:ring-primary/10 transition-all font-medium text-lg"
              />
            </div>
            <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
              {['all', 'published', 'draft'].map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "ghost"}
                  onClick={() => setStatusFilter(s)}
                  className={`h-12 px-6 rounded-xl font-bold capitalize ${statusFilter === s ? "shadow-md" : "text-slate-500"}`}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={() => handleDeleteCourse(course.id)} 
                  onEdit={handleEditClick}
                  onTogglePublish={() => handleTogglePublish(course)}
                  onEnroll={() => setEnrollModal({ open: true, courseId: course.id, title: course.title })}
                />
              ))
            ) : (
              <EmptyState 
                icon={<BookOpen />} 
                title={searchQuery ? "No matches found" : "Your classroom is empty"} 
                description={searchQuery ? "Try a different search term or filter." : "Create your first course to start teaching."}
                action={searchQuery ? () => setSearchQuery('') : () => setView('create')}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="grading" className="animate-in fade-in zoom-in-95 duration-300">
          <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-0">
              <SubmissionTable 
                data={submissions} 
                onGrade={(sub) => { setSelectedSub(sub); setIsGrading(true); }} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {selectedSub && (
        <GradingModal 
          isOpen={isGrading} 
          onClose={() => { setIsGrading(false); setSelectedSub(null); }} 
          submission={selectedSub} 
        />
      )}

      <EnrollmentModal 
        isOpen={enrollModal.open}
        courseId={enrollModal.courseId}
        courseTitle={enrollModal.title}
        onClose={() => setEnrollModal({ ...enrollModal, open: false })}
      />
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const CourseCard = ({ course, onDelete, onEnroll, onEdit, onTogglePublish }) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://innovet-tech-sch.onrender.com';
  const thumbnailUrl = course.thumbnail 
    ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${BACKEND_URL}${course.thumbnail}`)
    : null;

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none shadow-xl shadow-slate-200/50 flex flex-col h-full bg-white rounded-[2.5rem]">
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <BookOpen size={64} />
          </div>
        )}
        <div className="absolute top-5 left-5">
           <Badge className={`rounded-full px-4 py-1.5 font-black text-[9px] shadow-lg border-none ${course.is_published ? "bg-emerald-500 text-white" : "bg-white text-slate-900"}`}>
            {course.is_published ? "● LIVE" : "○ DRAFT"}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-8 pb-4 flex-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase opacity-60">
            {course.code || "LMS-UNIT"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full h-10 w-10">
                <MoreVertical className="h-5 w-5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2 shadow-xl">
              <DropdownMenuItem onClick={onEnroll} className="rounded-xl p-3 font-bold cursor-pointer">
                <UserPlus size={18} className="mr-3 text-primary" /> Enroll Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(course)} className="rounded-xl p-3 font-bold cursor-pointer">
                <Settings2 size={18} className="mr-3 text-slate-500" /> Course Settings
              </DropdownMenuItem>
              <div className="h-px bg-slate-100 my-2" />
              <DropdownMenuItem className="text-red-600 rounded-xl p-3 font-bold cursor-pointer" onClick={onDelete}>
                <Trash2 size={18} className="mr-3" /> Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-2xl font-black text-slate-900 line-clamp-2 mt-3 tracking-tight">
          {course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-0 mt-auto">
        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" /> {course.student_count || 0} Students
          </div>
          <Dot className="h-4 w-4" />
          <div className="text-slate-900">
            {parseFloat(course.price) === 0 ? "Free Access" : `$${course.price}`}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => onEdit(course)}
            className="flex-1 rounded-2xl font-black h-12 bg-slate-900 hover:bg-primary transition-all shadow-lg"
          >
            Manage Content
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onTogglePublish}
            className={`rounded-2xl h-12 w-12 border-2 transition-colors ${course.is_published ? "text-slate-300 border-slate-100" : "text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"}`}
          >
            {course.is_published ? <Archive size={20} /> : <Send size={20} />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SubmissionTable = ({ data, onGrade }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader className="bg-slate-50/50 border-b">
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-black text-slate-900 py-6 pl-10 uppercase tracking-widest text-[10px]">Student</TableHead>
          <TableHead className="font-black text-slate-900 py-6 uppercase tracking-widest text-[10px]">Assignment</TableHead>
          <TableHead className="font-black text-slate-900 py-6 uppercase tracking-widest text-[10px]">Status</TableHead>
          <TableHead className="text-right font-black text-slate-900 py-6 pr-10 uppercase tracking-widest text-[10px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? data.map((sub) => (
          <TableRow key={sub.id} className="group hover:bg-slate-50/30 transition-colors border-b-slate-100">
            <TableCell className="py-6 pl-10 font-bold text-slate-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                  {sub.student_name.charAt(0)}
                </div>
                {sub.student_name}
              </div>
            </TableCell>
            <TableCell className="py-6">
              <div className="text-sm font-bold text-slate-800">{sub.task_title}</div>
              <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                {sub.course_title}
              </div>
            </TableCell>
            <TableCell className="py-6">
              <Badge 
                variant="outline" 
                className={`rounded-lg px-3 py-1 font-bold ${
                  sub.grade 
                    ? "border-emerald-100 text-emerald-700 bg-emerald-50" 
                    : "border-amber-100 bg-amber-50 text-amber-700"
                }`}
              >
                {sub.grade ? `Grade: ${sub.grade}%` : "Awaiting Review"}
              </Badge>
            </TableCell>
            <TableCell className="py-6 text-right pr-10">
              <Button 
                onClick={() => onGrade(sub)} 
                className="rounded-xl font-black bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                Open Review
              </Button>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-32 opacity-30 italic font-medium">
              No submissions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const EmptyState = ({ icon, title, description, action }) => (
  <div className="col-span-full py-32 text-center border-4 border-dashed rounded-[3.5rem] bg-white border-slate-200/60 shadow-inner flex flex-col items-center">
    <div className="mb-6 text-primary p-6 bg-primary/5 rounded-full ring-8 ring-primary/5">
      {React.cloneElement(icon, { size: 56 })}
    </div>
    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 mt-2 mb-10 font-medium max-w-sm">{description}</p>
    <Button 
      onClick={action} 
      className="rounded-2xl h-16 px-10 text-lg font-black shadow-2xl shadow-primary/30 transition-all active:scale-95"
    >
      <Plus className="mr-2 h-6 w-6" /> Create Course
    </Button>
  </div>
);

export default TeacherDashboard;