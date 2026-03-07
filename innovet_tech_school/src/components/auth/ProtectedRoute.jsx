import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Pull token as well (assuming it's in your auth state)
  const { user, status, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. GATE 1: Still fetching or hasn't started yet
  const isInitializing = status === 'loading' || status === 'idle';
  
  // 2. GATE 2: We have a token (localStorage check finished) but the user profile 
  // request hasn't finished filling the 'user' object yet.
  const isFetchingUser = token && !user;

  if (isInitializing || isFetchingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // 3. GATE 3: Auth check finished and there is absolutely no user
  if (!user) {
    console.warn("[Auth] No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. GATE 4: Role Check
  // Ensure we compare cases (e.g., 'STUDENT' vs 'student')
  const userRole = user?.role?.toUpperCase();
  const normalizedRoles = allowedRoles?.map(role => role.toUpperCase());

  if (normalizedRoles && !normalizedRoles.includes(userRole)) {
    console.error(`[Access Denied] User Role: ${userRole} | Required: ${normalizedRoles}`);
    return <Navigate to="/dashboard" replace />; // Send them to their own dashboard instead of login
  }
  
  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

export default ProtectedRoute;