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
  Bell
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const { user, token } = useSelector((state) => state.auth);
  const { submissions = [] } = useSelector((state) => state.school);

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
            School<span className="text-primary">Portal</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/courses" active={isActive('/courses')}>Browse Courses</NavLink>

          {token && (
            <>
              {user?.role === 'STUDENT' && (
                <>
                  <NavLink to="/my-learning" active={isActive('/my-learning')}>My Learning</NavLink>
                  <NavLink to="/dashboard/grades" active={isActive('/dashboard/grades')}>
                    Grades
                    {notificationCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-indigo-600 text-white rounded-full animate-pulse">
                        {notificationCount}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {token ? (
            <div className="flex items-center gap-3">

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
                    <DropdownMenuLabel className="p-3 text-[10px] uppercase tracking-widest text-slate-400 font-black">Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl p-3 font-bold cursor-pointer">
                       <User className="mr-3 h-4 w-4 text-primary" /> Profile
                    </DropdownMenuItem>
                    {user?.role === 'STUDENT' && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard/grades')} className="rounded-xl p-3 font-bold cursor-pointer flex justify-between">
                         <div className="flex items-center"><FileText className="mr-3 h-4 w-4 text-indigo-500" /> My Grades</div>
                         {notificationCount > 0 && <Badge className="bg-indigo-600 text-[10px]">{notificationCount}</Badge>}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold rounded-xl p-3 cursor-pointer">
                       <LogOut className="mr-3 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-xl relative">
                    <Menu className="h-6 w-6 text-slate-900" />
                    {notificationCount > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] p-0 border-l-0 shadow-2xl">
                  <div className="flex flex-col h-full bg-white">
                    <SheetHeader className="p-6 border-b text-left">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black">{user?.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <SheetTitle className="text-lg font-black text-slate-900">{user?.username}</SheetTitle>
                          <Badge className="w-fit bg-slate-100 text-slate-500 border-none font-bold text-[9px] tracking-widest">{user?.role}</Badge>
                        </div>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 p-4 space-y-2">
                      <MobileNavLink to="/courses" icon={BookOpen} isActive={isActive('/courses')} setIsOpen={setIsOpen}>Browse Courses</MobileNavLink>
                      
                      {user?.role === 'STUDENT' && (
                        <>
                          <MobileNavLink to="/my-learning" icon={LayoutDashboard} isActive={isActive('/my-learning')} setIsOpen={setIsOpen}>My Learning</MobileNavLink>
                          <MobileNavLink to="/dashboard/grades" icon={FileText} isActive={isActive('/dashboard/grades')} setIsOpen={setIsOpen} badge={notificationCount}>
                            My Grades
                          </MobileNavLink>
                        </>
                      )}

                      {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                        <MobileNavLink to="/dashboard" icon={LayoutDashboard} isActive={isActive('/dashboard')} setIsOpen={setIsOpen}>Admin Dashboard</MobileNavLink>
                      )}

                      <div className="pt-4 mt-4 border-t border-slate-50 space-y-2">
                        <MobileNavLink to="/profile" icon={User} isActive={isActive('/profile')} setIsOpen={setIsOpen}>My Profile</MobileNavLink>
                        <MobileNavLink to="/settings" icon={Settings} isActive={isActive('/settings')} setIsOpen={setIsOpen}>Settings</MobileNavLink>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50">
                      <Button variant="destructive" className="w-full rounded-2xl h-12 font-black gap-3 shadow-lg shadow-red-100" onClick={handleLogout}>
                        <LogOut size={18} /> Sign Out
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

const MobileNavLink = ({ to, children, icon: Icon, isActive, setIsOpen, badge }) => (
  <Link 
    to={to} 
    onClick={() => setIsOpen(false)}
    className={cn(
      "flex items-center justify-between p-4 rounded-2xl font-black transition-all",
      isActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-600 hover:bg-slate-50"
    )}
  >
    <div className="flex items-center gap-4">
      <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
      <span className="text-[13px] uppercase tracking-wider">{children}</span>
    </div>
    {badge > 0 && (
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-black",
        isActive ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
      )}>
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;