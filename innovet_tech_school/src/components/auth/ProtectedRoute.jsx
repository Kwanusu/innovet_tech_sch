import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.error(`[Access Denied] User Role: ${user?.role} | Required: ${allowedRoles}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

export default ProtectedRoute;