import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../auth/authSlice';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { 
  LogOut, 
  User, 
  Settings,
  ChevronDown,
  GraduationCap,
  FileText,
  Menu,
  LayoutDashboard,
  BookOpen,
  Bell,
  Plus,
  ShieldAlert,
  Activity
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const { user, token } = useSelector((state) => state.auth);
  const { submissions = [] } = useSelector((state) => state.school || {});

  const notificationCount = useMemo(() => {
    return submissions.filter(s => s.grade !== null).length;
  }, [submissions]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
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
            Innovet<span className="text-primary">Tech</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/courses" active={isActive('/courses')}>Browse Courses</NavLink>

          {token && (
            <>

              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" active={isActive('/admin')}>
                   <span className="flex items-center gap-1.5 text-indigo-600">
                    <ShieldAlert size={14} /> Command Center
                  </span>
                </NavLink>
              )}

              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                {user?.role === 'STUDENT' ? 'My Learning' : 'Instructor Dashboard'}
              </NavLink>

              {user?.role === 'STUDENT' && (
                <NavLink to="/dashboard/grades" active={isActive('/dashboard/grades')}>
                  Grades
                  {notificationCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-indigo-600 text-white rounded-full animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {token ? (
            <div className="flex items-center gap-3">

              {user?.role === 'ADMIN' && (
                <Button 
                  onClick={() => navigate('/admin')}
                  className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-md px-4 transition-all active:scale-95 text-white"
                >
                  <Activity size={16} />
                  <span className="font-bold text-xs uppercase tracking-wider">System State</span>
                </Button>
              )}

              {user?.role === 'TEACHER' && (
                <Button 
                  onClick={() => navigate('/dashboard/create-course')}
                  className="hidden lg:flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 px-4 transition-all active:scale-95"
                >
                  <div className="bg-white/20 p-1 rounded-md">
                    <Plus size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider">Create Course</span>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="hidden md:flex relative rounded-xl hover:bg-slate-50">
                <Bell size={20} className="text-slate-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </Button>

              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-12 flex items-center gap-3 px-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-[1.5rem] shadow-2xl border-slate-100">
                    <DropdownMenuLabel className="p-3 text-[10px] uppercase tracking-widest text-slate-400 font-black">Management</DropdownMenuLabel>
                    
                    {user?.role === 'ADMIN' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-indigo-50 text-indigo-600">
                          <ShieldAlert className="mr-3 h-4 w-4" /> Admin Panel
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-slate-50">
                        <User className="mr-3 h-4 w-4 text-primary" /> Profile Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold rounded-xl p-3 cursor-pointer hover:bg-red-50">
                        <LogOut className="mr-3 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-xl relative">
                    <Menu className="h-6 w-6 text-slate-900" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] p-0 border-l-0 shadow-2xl">
                  <div className="flex flex-col h-full bg-white">
                    <SheetHeader className="p-6 border-b text-left">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-white font-black">{user?.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <SheetTitle className="text-lg font-black">{user?.username}</SheetTitle>
                          <Badge className="w-fit bg-slate-100 text-slate-500 uppercase text-[9px]">{user?.role}</Badge>
                        </div>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 p-4 space-y-2">
                      {user?.role === 'ADMIN' && (
                        <MobileNavLink to="/admin" icon={ShieldAlert} isActive={isActive('/admin')} setIsOpen={setIsOpen}>Admin Panel</MobileNavLink>
                      )}
                      <MobileNavLink to="/courses" icon={BookOpen} isActive={isActive('/courses')} setIsOpen={setIsOpen}>Browse Courses</MobileNavLink>
                      <MobileNavLink to="/dashboard" icon={LayoutDashboard} isActive={isActive('/dashboard')} setIsOpen={setIsOpen}>Dashboard</MobileNavLink>
                    </div>

                    <div className="p-6 bg-slate-50">
                      <Button variant="destructive" className="w-full rounded-2xl h-12 font-black gap-3" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:inline-flex font-bold rounded-xl px-6">
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
  <Link to={to} className={cn(
    "text-sm font-black transition-all hover:text-primary relative py-2 flex items-center",
    active ? 'text-primary' : 'text-slate-500'
  )}>
    {children}
    {active && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />}
  </Link>
);

const MobileNavLink = ({ to, children, icon: Icon, isActive, setIsOpen }) => (
  <Link 
    to={to} 
    onClick={() => setIsOpen(false)}
    className={cn(
      "flex items-center gap-4 p-4 rounded-2xl font-black transition-all",
      isActive ? "bg-primary text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"
    )}
  >
    <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
    <span className="text-[13px] uppercase tracking-wider">{children}</span>
  </Link>
);

export default Navbar;