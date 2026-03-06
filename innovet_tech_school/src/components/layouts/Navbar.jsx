import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  Settings,
  ChevronDown,
  GraduationCap
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
 
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            School<span className="text-primary">Portal</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/courses" active={isActive('/courses')}>
            Browse Courses
          </NavLink>

          {token && (
            <>
              {user?.role === 'STUDENT' && (
                <NavLink to="/my-learning" active={isActive('/my-learning')}>
                  My Learning
                </NavLink>
              )}

              {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                <NavLink to="/dashboard" active={isActive('/dashboard')}>
                  Dashboard
                </NavLink>
              )}

              {user?.role === 'ADMIN' && (
                <NavLink to="/analytics" active={isActive('/analytics')}>
                  Logs
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 flex items-center gap-3 px-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start text-left">
                    <span className="text-sm font-black text-slate-900 leading-none">
                      {user?.username}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest h-4 px-1 border-none bg-slate-100 text-slate-500 font-bold">
                      {user?.role}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-[1.5rem] shadow-2xl border-slate-100">
                <DropdownMenuLabel className="font-bold text-slate-500 text-xs uppercase tracking-widest p-3">
                  Account Settings
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer font-bold">
                  <User className="mr-3 h-4 w-4 text-primary" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl p-3 cursor-pointer font-bold">
                  <Settings className="mr-3 h-4 w-4 text-slate-400" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-xl p-3 cursor-pointer font-bold text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="font-bold rounded-xl px-6">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="font-black rounded-xl px-6 shadow-lg shadow-primary/20">
                <Link to="/register">Join Free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link 
    to={to} 
    className={`text-sm font-black transition-all hover:text-primary relative py-2 ${
      active ? 'text-primary' : 'text-slate-500'
    }`}
  >
    {children}
    {active && (
      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
    )}
  </Link>
);

export default Navbar;