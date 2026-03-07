import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../school/schoolSlice';
import CourseList from './CourseList';
import { Skeleton } from "@/components/ui/skeleton";

const BrowseCoursesPage = () => {
  const dispatch = useDispatch();
  
  const { courses, isLoading, error } = useSelector((state) => state.school);

  useEffect(() => {

    dispatch(fetchCourses());
  }, [dispatch]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-red-50 p-4 rounded-full text-red-500">
          <span className="text-2xl font-black">!</span>
        </div>
        <h2 className="text-xl font-black text-slate-900">Failed to load courses</h2>
        <p className="text-slate-500 max-w-xs text-center">{error}</p>
        <button 
          onClick={() => dispatch(fetchCourses())}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-6 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4 border border-slate-100 p-6 rounded-[2.5rem]">
              <Skeleton className="h-44 w-full rounded-[2rem]" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <CourseList 
      courses={courses} 
      onSelectCourse={(course) => {
        console.log("Navigating to course:", course.id);
      }} 
    />
  );
};

export default BrowseCoursesPage;