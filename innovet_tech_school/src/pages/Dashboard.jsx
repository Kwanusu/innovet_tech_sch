import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from '../components/student/StudentDashboard';
import TeacherDashboard from '../components/teacher/TeacherDashboard'
import { Spinner } from '../components/ui/spinner' 

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (user?.role === 'TEACHER') {
        return <TeacherDashboard />;
    }

    if (user?.role === 'STUDENT') {
        return <StudentDashboard />;
    }

    return <Spinner />;
};

export default Dashboard;
