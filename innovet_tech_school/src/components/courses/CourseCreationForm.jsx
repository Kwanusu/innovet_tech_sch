import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createCourse, updateCourse } from '../../school/schoolSlice'; 
import { 
    Plus, Trash2, Book, X, 
    Loader2, UploadCloud, ImageIcon, 
    FileText, Zap, GripVertical, Edit3, Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const CourseCreateForm = ({ onSuccess, initialData, isEditMode }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [activeLessonEdit, setActiveLessonEdit] = useState(null);

    const [courseData, setCourseData] = useState({
        title: '',
        code: '',
        description: '',
        price: '0.00',
        is_published: false,
        thumbnail: null,
        topics: [
            { 
                id: crypto.randomUUID(), 
                title: '', 
                order: 1, 
                lessons: [{ id: crypto.randomUUID(), title: '', content: '', lesson_type: 'LESSON', order: 1 }] 
            }
        ]
    });

    useEffect(() => {
        if (isEditMode && initialData) {
            setCourseData({
                ...initialData,
                thumbnail: null, 
                topics: initialData.topics?.length > 0 ? initialData.topics : courseData.topics
            });
           if (initialData.thumbnail) {
                const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://innovet-tech-sch.onrender.com';
                
                setPreview(
                    initialData.thumbnail.startsWith('http') 
                    ? initialData.thumbnail 
                    : `${BACKEND_URL}${initialData.thumbnail}`
                );
            }
        }
    }, [initialData, isEditMode]);

    // --- State Helpers ---
    const addTopic = () => {
        setCourseData(prev => ({
            ...prev,
            topics: [...prev.topics, { 
                id: crypto.randomUUID(),
                title: '', 
                order: prev.topics.length + 1, 
                lessons: [{ id: crypto.randomUUID(), title: '', content: '', lesson_type: 'LESSON', order: 1 }] 
            }]
        }));
    };

    const removeTopic = (tIdx) => {
        const newTopics = courseData.topics.filter((_, i) => i !== tIdx);
        setCourseData({ ...courseData, topics: newTopics });
    };

   // --- Updated State Helpers (Inside CourseCreationForm.jsx) ---

const addLesson = (tIdx) => {
    setCourseData(prev => ({
        ...prev,
        topics: prev.topics.map((topic, index) => {
            if (index !== tIdx) return topic;
            return {
                ...topic,
                lessons: [
                    ...topic.lessons,
                    { id: crypto.randomUUID(), title: '', content: '', lesson_type: 'LESSON', order: topic.lessons.length + 1 }
                ]
            };
        })
    }));
};

const updateLesson = (tIdx, lIdx, field, value) => {
    setCourseData(prev => ({
        ...prev,
        topics: prev.topics.map((topic, topicIndex) => {
            if (topicIndex !== tIdx) return topic;
            return {
                ...topic,
                lessons: topic.lessons.map((lesson, lessonIndex) => 
                    lessonIndex === lIdx ? { ...lesson, [field]: value } : lesson
                )
            };
        })
    }));
};
    const removeLesson = (tIdx, lIdx) => {
        const newTopics = [...courseData.topics];
        newTopics[tIdx].lessons = newTopics[tIdx].lessons.filter((_, i) => i !== lIdx);
        setCourseData({ ...courseData, topics: newTopics });
    };

    const updateTopic = (tIdx, field, value) => {
        const newTopics = [...courseData.topics];
        newTopics[tIdx] = { ...newTopics[tIdx], [field]: value };
        setCourseData({ ...courseData, topics: newTopics });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
            setCourseData(prev => ({ ...prev, thumbnail: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        const formData = new FormData();

        formData.append('title', courseData.title);
        formData.append('code', courseData.code);
        formData.append('description', courseData.description);
        formData.append('price', courseData.price);
        formData.append('is_published', courseData.is_published);

        // Only append file if a new one was selected
        if (courseData.thumbnail instanceof File) {
            formData.append('thumbnail', courseData.thumbnail);
        }

        // Clean curriculum: Remove frontend UUIDs for new items but keep PKs for existing ones
        const cleanCurriculum = courseData.topics.map((topic, tIdx) => ({
            id: typeof topic.id === 'number' ? topic.id : null, // Keep DB ID if it exists
            title: topic.title || `Module ${tIdx + 1}`,
            order: tIdx + 1,
            lessons: topic.lessons.map((lesson, lIdx) => ({
                id: typeof lesson.id === 'number' ? lesson.id : null,
                title: lesson.title || `Lesson ${lIdx + 1}`,
                content: lesson.content || "",
                lesson_type: lesson.lesson_type,
                order: lIdx + 1
            }))
        }));
        
        formData.append('topics', JSON.stringify(cleanCurriculum));

        try {
            if (isEditMode) {
                await dispatch(updateCourse({ id: initialData.id, data: formData })).unwrap();
                toast.success("Course Updated Successfully");
            } else {
                await dispatch(createCourse(formData)).unwrap();
                toast.success("Course Created Successfully");
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Server Error:", err);
            toast.error("Submission Failed", { description: "Check server logs for details." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-32 space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isEditMode ? "Edit Course" : "Create New Course"}
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Design your curriculum and learning path.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
                    <Badge variant={courseData.is_published ? "default" : "secondary"} className="rounded-lg uppercase px-3 py-1">
                        {courseData.is_published ? 'Public' : 'Draft Mode'}
                    </Badge>
                    <input 
                        type="checkbox"
                        className="w-5 h-5 accent-slate-900 cursor-pointer"
                        checked={courseData.is_published}
                        onChange={(e) => setCourseData({...courseData, is_published: e.target.checked})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Side: Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border shadow-sm space-y-6">
                        <LabelMini><ImageIcon size={14} className="inline mr-1"/> Course Cover</LabelMini>
                        <div onClick={() => fileInputRef.current.click()} className="group aspect-video border-2 border-dashed border-slate-200 rounded-[1.5rem] flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden relative">
                            {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" /> : <UploadCloud className="text-slate-300" size={32} />}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="space-y-4">
                            <Input placeholder="Title" value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Code" value={courseData.code} onChange={(e) => setCourseData({...courseData, code: e.target.value})} />
                                <Input placeholder="Price" type="number" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: e.target.value})} />
                            </div>
                            <Textarea placeholder="Description" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Right Side: Curriculum */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-slate-900 flex items-center gap-2"><Book size={20} className="text-primary" /> Curriculum Architecture</h3>
                        <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={addTopic}><Plus size={18} /> Add Module</Button>
                    </div>

                    <div className="space-y-6">
                        {courseData.topics.map((topic, tIdx) => (
                            <div key={topic.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <div className="p-5 bg-slate-50/50 flex items-center gap-4 border-b">
                                    <GripVertical className="text-slate-300" />
                                    <Input 
                                        className="bg-transparent border-none text-lg font-black p-0 focus-visible:ring-0" 
                                        placeholder="Module Title..." 
                                        value={topic.title} 
                                        onChange={(e) => updateTopic(tIdx, 'title', e.target.value)} 
                                    />
                                    <button type="button" onClick={() => removeTopic(tIdx)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                                </div>

                                <div className="p-6 space-y-3">
                                    {topic.lessons.map((lesson, lIdx) => (
                                        <div key={lesson.id} className="space-y-2">
                                            <div className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                                                <div className="flex-1 flex items-center gap-3">
                                                    {lesson.lesson_type === 'CHALLENGE' ? <Zap className="text-amber-500 h-4 w-4" /> : <FileText className="text-primary h-4 w-4" />}
                                                    <input 
                                                        className="w-full font-bold text-sm outline-none" 
                                                        placeholder="Lesson Title..."
                                                        value={lesson.title} 
                                                        onChange={(e) => updateLesson(tIdx, lIdx, 'title', e.target.value)} 
                                                    />
                                                </div>
                                                
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveLessonEdit(activeLessonEdit === lesson.id ? null : lesson.id)}
                                                    className={`p-1.5 rounded-lg transition-colors ${activeLessonEdit === lesson.id ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:text-primary'}`}
                                                >
                                                    {activeLessonEdit === lesson.id ? <Save size={16}/> : <Edit3 size={16} />}
                                                </button>

                                                <button type="button" onClick={() => removeLesson(tIdx, lIdx)} className="text-slate-300 hover:text-red-500"><X size={16} /></button>
                                            </div>

                                            {activeLessonEdit === lesson.id && (
                                                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                                    <LabelMini>Lesson Content (Markdown Supported)</LabelMini>
                                                    <Textarea 
                                                        className="mt-2 rounded-xl bg-slate-50 border-none min-h-[120px] font-mono text-xs"
                                                        placeholder="Enter lesson description or markdown content..."
                                                        value={lesson.content}
                                                        onChange={(e) => updateLesson(tIdx, lIdx, 'content', e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addLesson(tIdx)} className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:text-primary transition-all uppercase">+ Append Lesson</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-[60]">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex gap-4 items-center">
                    <div className="flex-1 text-white text-sm font-black ml-2 leading-none line-clamp-1">{courseData.title || 'Untitled'}</div>
                    <Button type="submit" className="bg-primary text-white px-8 rounded-xl font-black" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (isEditMode ? "Save Changes" : "Deploy Curriculum")}
                    </Button>
                </div>
            </div>
        </form>
    );
};

const LabelMini = ({ children }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">{children}</label>
);

export default CourseCreateForm;