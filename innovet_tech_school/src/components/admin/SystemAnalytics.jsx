import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Server, Database, Zap, ShieldAlert } from 'lucide-react';

const SystemAnalytics = () => {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">System Health & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <HealthCard icon={Server} label="API Status" value="Healthy" color="text-emerald-500" />
                <HealthCard icon={Database} label="DB Latency" value="24ms" color="text-blue-500" />
                <HealthCard icon={Zap} label="Daily Requests" value="12.4k" color="text-amber-500" />
                <HealthCard icon={ShieldAlert} label="Security Logs" value="0 Critical" color="text-emerald-500" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold mb-6">User Activity (24h)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const HealthCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}><Icon size={20}/></div>
        <div>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-lg font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default SystemAnalytics;