import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminGuard = ({ children }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) return <div>Checking permissions...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user?.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminGuard;