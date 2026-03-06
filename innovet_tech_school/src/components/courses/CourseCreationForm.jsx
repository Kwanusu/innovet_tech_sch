import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../school/schoolSlice';
import { 
    Plus, Trash2, Book, X, 
    Loader2, UploadCloud, ImageIcon, 
    FileText, Zap, GripVertical
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const CourseCreateForm = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("Image must be under 2MB");
            setCourseData(prev => ({ ...prev, thumbnail: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const updateTopic = (tIdx, field, value) => {
        const newTopics = [...courseData.topics];
        newTopics[tIdx] = { ...newTopics[tIdx], [field]: value };
        setCourseData({ ...courseData, topics: newTopics });
    };

    const updateLesson = (tIdx, lIdx, field, value) => {
        const newTopics = [...courseData.topics];
        const newLessons = [...newTopics[tIdx].lessons];
        newLessons[lIdx] = { ...newLessons[lIdx], [field]: value };
        newTopics[tIdx] = { ...newTopics[tIdx], lessons: newLessons };
        setCourseData({ ...courseData, topics: newTopics });
    };

    const addTopic = () => {
        setCourseData({
            ...courseData,
            topics: [...courseData.topics, { 
                id: crypto.randomUUID(),
                title: '', 
                order: courseData.topics.length + 1, 
                lessons: [{ id: crypto.randomUUID(), title: '', content: '', lesson_type: 'LESSON', order: 1 }] 
            }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
                if (courseData.is_published && parseFloat(courseData.price) > 0) {
            return toast.error("Paid courses cannot be auto-published.");
        }

        setLoading(true);
        const formData = new FormData();

        ['title', 'code', 'description', 'price', 'is_published'].forEach(key => {
            formData.append(key, courseData[key]);
        });

        if (courseData.thumbnail) formData.append('thumbnail', courseData.thumbnail);

        const cleanCurriculum = courseData.topics.map(({ id, ...t }) => ({
            ...t,
            lessons: t.lessons.map(({ id, ...l }) => l)
        }));
        
        formData.append('topics', JSON.stringify(cleanCurriculum));

        try {
            await dispatch(createCourse(formData)).unwrap();
            toast.success("Curriculum Published Successfully");
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Draft Error", { description: JSON.stringify(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-32 space-y-10">

            <div className="flex justify-between items-end border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Course</h1>
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
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border shadow-sm space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <ImageIcon size={14} /> Course Cover
                        </label>
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="group aspect-video border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-primary cursor-pointer transition-all relative overflow-hidden"
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <UploadCloud className="mx-auto text-slate-300 mb-2" size={32} />
                                    <p className="text-xs font-bold text-slate-500">Click to upload thumbnail</p>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <LabelMini>Course Title</LabelMini>
                                <Input required className="rounded-xl border-slate-100 font-bold" value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <LabelMini>Code</LabelMini>
                                    <Input required placeholder="CS-101" className="rounded-xl border-slate-100 font-bold" value={courseData.code} onChange={(e) => setCourseData({...courseData, code: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <LabelMini>Price (USD)</LabelMini>
                                    <Input type="number" className="rounded-xl border-slate-100 font-bold" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <LabelMini>Description</LabelMini>
                                <Textarea className="rounded-xl border-slate-100 min-h-[100px]" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-slate-900 flex items-center gap-2">
                            <Book size={20} className="text-primary" /> Curriculum Architecture
                        </h3>
                        <Button type="button" variant="outline" className="rounded-xl font-bold border-slate-200" onClick={addTopic}>
                            <Plus size={18} className="mr-1" /> Add Module
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {courseData.topics.map((topic, tIdx) => (
                            <div key={topic.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">

                                <div className="p-5 bg-slate-50/50 flex items-center gap-4 border-b">
                                    <div className="cursor-grab text-slate-300"><GripVertical size={20} /></div>
                                    <div className="flex-1">
                                        <Input 
                                            className="bg-transparent border-none text-lg font-black p-0 focus-visible:ring-0 placeholder:text-slate-300" 
                                            placeholder="Module Title (e.g. Introduction to React)" 
                                            value={topic.title} 
                                            onChange={(e) => updateTopic(tIdx, 'title', e.target.value)} 
                                        />
                                    </div>
                                    <button type="button" onClick={() => removeTopic(tIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-3">
                                    {topic.lessons.map((lesson, lIdx) => (
                                        <div key={lesson.id} className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                                                {lesson.lesson_type === 'CHALLENGE' ? <Zap className="text-amber-500 h-4 w-4" /> : <FileText className="text-primary h-4 w-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    className="w-full font-bold text-sm text-slate-700 outline-none placeholder:text-slate-200" 
                                                    placeholder="Lesson Title..."
                                                    value={lesson.title} 
                                                    onChange={(e) => updateLesson(tIdx, lIdx, 'title', e.target.value)} 
                                                />
                                            </div>
                                            <select 
                                                className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-md border-none outline-none appearance-none cursor-pointer"
                                                value={lesson.lesson_type}
                                                onChange={(e) => updateLesson(tIdx, lIdx, 'lesson_type', e.target.value)}
                                            >
                                                <option value="LESSON">VIDEO</option>
                                                <option value="CHALLENGE">QUIZ</option>
                                            </select>
                                            <button type="button" onClick={() => removeLesson(tIdx, lIdx)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => addLesson(tIdx)} 
                                        className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all uppercase tracking-widest"
                                    >
                                        + Append Lesson
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-[60]">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex gap-4 items-center">
                    <div className="flex-1">
                        <p className="text-white text-sm font-black ml-2 leading-none">{courseData.title || 'Untitled Course'}</p>
                        <p className="text-slate-400 text-[10px] font-bold ml-2 mt-1 uppercase tracking-tight">Ready to publish</p>
                    </div>
                    <Button variant="ghost" type="button" onClick={onSuccess} className="text-white hover:bg-white/10 font-bold rounded-xl">Discard</Button>
                    <Button type="submit" className="bg-primary text-white px-8 rounded-xl font-black shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Deploy Curriculum"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

const LabelMini = ({ children }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{children}</label>
);

export default CourseCreateForm;