import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosConfig';
import InviteStaffModal from './InviteStaffModal';
import { 
  Users, BookOpen, CheckCircle, AlertTriangle, Activity, 
  Settings, Shield, Database, Server, Search, UserPlus, MoreVertical 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSystemState = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('api/admin/dashboard-stats/'),
        API.get('api/admin/users/')
      ]);
      setData(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Critical System Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemState();
    const poll = setInterval(fetchSystemState, 60000); 
    return () => clearInterval(poll);
  }, [fetchSystemState]);

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 text-center">
          Synchronizing Core...<br/><span className="text-[8px] tracking-normal">Innovet Tech v2.4.0</span>
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <InviteStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchSystemState} 
      />

      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Command Center</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Environment: Production • v2.4.0 Stable
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <UserPlus size={16} /> Onboard Staff
          </button>
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-slate-200/50 p-1.5 rounded-[1.5rem] border border-slate-200/60 inline-flex">
          <TabsTrigger value="overview" className="rounded-xl px-8 py-2 font-black text-[10px] uppercase tracking-widest">Overview</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 py-2 font-black text-[10px] uppercase tracking-widest">User Directory</TabsTrigger>
          <TabsTrigger value="system" className="rounded-xl px-8 py-2 font-black text-[10px] uppercase tracking-widest">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Students" value={data.metrics.total_students} icon={Users} color="bg-slate-900" />
            <StatCard title="Enrollments" value={data.metrics.active_enrollments} icon={BookOpen} color="bg-indigo-600" />
            <StatCard title="Avg. Progress" value={`${data.metrics.completion_rate}%`} icon={CheckCircle} color="bg-emerald-600" />
            <StatCard title="Live Alerts" value={data.metrics.system_alerts} icon={AlertTriangle} color="bg-rose-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" /> Enrollment Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.course_distribution}>
                    <XAxis dataKey="title" hide />
                    <YAxis hide />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', fontWeight: '900', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="student_count" fill="#0f172a" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black mb-6 uppercase tracking-[0.2em]">Activity Feed</h3>
              <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {data.recent_activity?.map((log) => (
                  <div key={log.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      log.severity === 'error' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-black text-slate-800 truncate">{log.action}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {log.user_name} • {log.formatted_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Identity Registry</h3>
                <div className="relative group">
                    <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Filter accounts..." 
                      className="pl-12 pr-6 py-3 text-xs bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 w-80 transition-all font-bold"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <tr>
                  <th className="p-6">Profile</th>
                  <th className="p-6">Role</th>
                  <th className="p-6">Engagement</th>
                  <th className="p-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers?.map(u => (
                  <UserRow key={u.id} user={u} />
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="system" className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HealthIndicator icon={Server} label="API Node" status={data.system_health?.api_status || 'Offline'} latency={data.system_health?.db_latency} />
            <HealthIndicator icon={Database} label="Postgres Cluster" status="Healthy" latency="8ms" />
            <HealthIndicator icon={Shield} label="Security Engine" status="Active" latency={`${data.metrics?.system_alerts} flags`} />
          </div>
          <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em] animate-pulse">Monitoring Real-time Network Traffic</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black mt-3 text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-3.5 rounded-2xl ${color} shadow-lg shadow-current/10`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

const UserRow = ({ user }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group">
    <td className="p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-slate-900/10">
          {user.username?.[0].toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-black text-slate-900">{user.username}</p>
          <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="p-6">
      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${
        user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
      }`}>
        {user.role || 'STUDENT'}
      </span>
    </td>
    <td className="p-6">
      <div className="flex items-center gap-3">
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.avg_progress || user.avProgress || 0 }%` }} />
        </div>
        <span className="text-[11px] font-black text-slate-900">{user.avg_progress || user.avProgress || 0}%</span>
      </div>
    </td>
    <td className="p-6 text-right">
      <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
        <MoreVertical size={16} />
      </button>
    </td>
  </tr>
);

const HealthIndicator = ({ icon: Icon, label, status, latency }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-900"><Icon size={24} /></div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2.5 mt-1.5">
        <span className="text-xl font-black text-slate-900 tracking-tight">{status}</span>
        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{latency}</span>
      </div>
    </div>
  </div>
);

export default AdminDashboard;