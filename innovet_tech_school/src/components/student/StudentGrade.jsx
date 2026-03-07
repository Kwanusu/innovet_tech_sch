import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmissions } from '../../school/schoolSlice';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    MessageSquare, 
    FileCheck,  
    Trophy, 
    Clock, 
    CheckCircle2,
    SearchX,
    ExternalLink
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const StudentGrades = () => {
    const dispatch = useDispatch();
    const { submissions = [], status } = useSelector((state) => state.school);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        dispatch(fetchSubmissions());
    }, [dispatch]);

    const stats = useMemo(() => {
        const graded = submissions.filter(s => s.grade !== null);
        const average = graded.length > 0 
            ? Math.round(graded.reduce((acc, curr) => acc + curr.grade, 0) / graded.length) 
            : 0;
        
        return {
            average,
            total: submissions.length,
            pending: submissions.length - graded.length,
            completed: graded.length
        };
    }, [submissions]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto p-12 space-y-4 animate-pulse">
                <div className="h-8 w-64 bg-slate-200 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8 min-h-screen pb-20">

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Record</h1>
                    <p className="text-slate-500 font-medium">Performance tracking and instructor evaluations.</p>
                </div>
                <Badge variant="outline" className="w-fit px-4 py-1 border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Academic Year {currentYear}
                </Badge>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-600 text-white">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-indigo-100 text-xs font-black uppercase tracking-widest">Global Average</p>
                                <h3 className="text-4xl font-black">{stats.average}%</h3>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <Trophy className="h-6 w-6 text-amber-300" />
                            </div>
                        </div>
                        <Progress value={stats.average} className="h-2 mt-4 bg-white/20" />
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Submissions</p>
                                <h3 className="text-4xl font-black text-slate-900">{stats.total}</h3>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 font-bold">{stats.completed} Graded • {stats.pending} In Review</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Pending Feedback</p>
                                <h3 className="text-4xl font-black text-slate-900">{stats.pending}</h3>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <Clock className="h-6 w-6 text-indigo-500" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 font-bold">Expect feedback within 48 hours</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-2">Detailed Results</h3>
                
                {submissions.length > 0 ? (
                    submissions.map((sub) => {
                        const isGraded = sub.grade !== null;
                        
                        return (
                            <Card key={sub.id} className="group overflow-hidden rounded-[1.5rem] border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">

                                        <div className={cn(
                                            "w-full md:w-2 bg-slate-100 transition-colors",
                                            isGraded ? "bg-emerald-500" : "bg-amber-400"
                                        )} />

                                        <div className="flex-1 p-6 space-y-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <Badge variant="outline" className="mb-1 text-[9px] font-black tracking-tighter uppercase rounded-md">
                                                        {sub.course_title}
                                                    </Badge>
                                                    <CardTitle className="text-xl font-black text-slate-900">{sub.task_title}</CardTitle>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                        <Clock className="h-3 w-3" />
                                                        Submitted {new Date(sub.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {isGraded ? (
                                                        <div className="text-right">
                                                            <span className="block text-3xl font-black text-indigo-600 leading-none">{sub.grade}%</span>
                                                            <span className="text-[10px] font-black uppercase text-emerald-600">Verified Grade</span>
                                                        </div>
                                                    ) : (
                                                        <Badge className="bg-amber-50 text-amber-700 border-amber-100 px-3 py-1 font-bold">
                                                            Awaiting Grade
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "p-5 rounded-2xl border transition-colors",
                                                isGraded ? "bg-slate-50 border-slate-100" : "bg-slate-50/50 border-dashed border-slate-200"
                                            )}>
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "p-2 rounded-xl",
                                                        isGraded ? "bg-white text-indigo-500 shadow-sm" : "bg-transparent text-slate-300"
                                                    )}>
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instructor Evaluation</h4>
                                                        <p className={cn(
                                                            "text-sm leading-relaxed",
                                                            isGraded ? "text-slate-700 font-medium italic" : "text-slate-400 italic"
                                                        )}>
                                                            {sub.feedback || "Your submission is being reviewed. Check back soon for detailed feedback."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-4">
                                                    {sub.file && (
                                                        <a 
                                                            href={sub.file} 
                                                            target="_blank" 
                                                            rel="noreferrer" 
                                                            className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                                                        >
                                                            <FileCheck className="h-4 w-4" />
                                                            Review Submission File
                                                        </a>
                                                    )}
                                                </div>
                                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                            <SearchX className="h-10 w-10 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900">No records found</h4>
                        <p className="text-slate-500 text-sm max-w-xs text-center">Your graded tasks and submissions will appear here once you begin your course work.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentGrades;