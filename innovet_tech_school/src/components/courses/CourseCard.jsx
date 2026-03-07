import { 
    BookOpen, 
    MoreVertical, 
    Trash2, 
    Edit3, 
    Users, 
    Layers, 
    Eye, 
    EyeOff 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CourseCard = ({ course, onDelete, onEdit, onTogglePublish, onManageCurriculum }) => {

    const baseUrl = "http://127.0.0.1:8000"; 
    const imageUrl = course.thumbnail 
        ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${baseUrl}${course.thumbnail}`)
        : null;

    const formattedPrice = parseFloat(course.price) === 0 
        ? "Free" 
        : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'Ksh' }).format(course.price);

    return (
        <Card className="overflow-hidden border-slate-200 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-[2rem]">

            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 bg-slate-50">
                        <BookOpen size={48} strokeWidth={1} />
                    </div>
                )}

                <div className="absolute top-4 right-4">
                    <Badge className={cn(
                        "px-3 py-1 font-black uppercase text-[10px] tracking-widest border-none shadow-lg",
                        course.is_published ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                        {course.is_published ? "Live" : "Draft"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                            {course.code || "No Code"}
                        </p>
                        <CardTitle className="text-xl font-black text-slate-900 line-clamp-1 leading-tight">
                            {course.title}
                        </CardTitle>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors">
                                <MoreVertical className="h-5 w-5 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400 p-3">Course Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => onEdit(course)} className="rounded-xl p-3 cursor-pointer font-bold">
                                <Edit3 className="mr-3 h-4 w-4 text-indigo-500" /> Edit Basic Info
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => onTogglePublish(course)} className="rounded-xl p-3 cursor-pointer font-bold">
                                {course.is_published ? (
                                    <><EyeOff className="mr-3 h-4 w-4 text-amber-500" /> Unpublish</>
                                ) : (
                                    <><Eye className="mr-3 h-4 w-4 text-emerald-500" /> Publish Course</>
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2" />
                            
                            <DropdownMenuItem 
                                onClick={() => onDelete(course.id)} 
                                className="rounded-xl p-3 cursor-pointer font-bold text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <Trash2 className="mr-3 h-4 w-4" /> Delete Permanently
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-bold">{course.student_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-bold">{course.topic_count || 0} Topics</span>
                        </div>
                    </div>
                    <div className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                        {formattedPrice}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Button 
                        variant="default" 
                        onClick={() => onManageCurriculum(course.id)}
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl h-11 transition-all"
                    >
                        Manage Curriculum
                    </Button>
                    
                    {!course.is_published && (
                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Not visible to students
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseCard;