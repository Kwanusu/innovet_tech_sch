import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Auth Actions
import { loadUser } from './components/auth/authSlice';

// Components & Pages
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layouts/Navbar';
import LessonDetailPage from './pages/LessonDetail';
import Register from './pages/Register';
import CourseCurriculum from './components/student/CourseCurriculum';
import StudentGrades from './components/student/StudentGrade';
import BrowseCoursesPage from './components/courses/BrowseCourses';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/PasswordResetConfirm';

function App() {
  const dispatch = useDispatch();
  const { status, user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user]);

  if (status === 'loading' && token && !user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-slate-900 font-black tracking-tight text-lg">Verifying Access</p>
            <p className="text-slate-500 text-sm font-medium">Securing your learning environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />

        <div className="flex-1">
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
            <Route path="/courses" element={<BrowseCoursesPage />} />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard/grades" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentGrades />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/:courseId/learn" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <CourseCurriculum />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/courses/:courseId/lessons/:lessonId" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                  <LessonDetailPage />
                </ProtectedRoute>
              } 
            />

            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="*" element={<Navigate to="/courses" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;