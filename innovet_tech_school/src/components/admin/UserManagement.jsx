import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Trash2, UserCog, UserCheck, Users, Archive, Loader2, AlertCircle } from 'lucide-react';
import API from '../api/axiosConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [view, setView] = useState('active'); 
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {

      const res = await API.get('/api/users/');
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSoftDelete = async (userId) => {
    try {
      await API.delete(`/api/users/${userId}/`);

      setUsers(users.map(u => u.id === userId ? { ...u, is_active: false } : u));
      setActiveMenu(null);
    } catch (err) {
      alert("Action failed. Admin privileges required.");
    }
  };

  const handleRestore = async (userId) => {
      try {
          await API.patch(`/api/users/${userId}/`, { is_active: true });
          setUsers(users.map(u => u.id === userId ? { ...u, is_active: true } : u));
          setActiveMenu(null);
      } catch (err) {
          alert("Restore failed.");
      }
  };

  const filteredUsers = users.filter(u => view === 'active' ? u.is_active : !u.is_active);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 font-medium">Manage access and track student progress</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setView('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'active' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={16} /> Active
          </button>
          <button 
            onClick={() => setView('archived')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'archived' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Archive size={16} /> Archived
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, email or ID..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border-none shadow-sm rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-700 font-medium"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold uppercase tracking-widest text-xs">Syncing Database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
              <AlertCircle size={32} />
            </div>
            <p className="text-slate-500 font-medium">No {view} students found in the directory.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Engagement</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Overall Progress</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.username}</p>
                        <p className="text-xs font-medium text-slate-400 tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg">{user.enrollment_count || 0} Courses</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3 w-48">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${user.avg_progress > 70 ? 'bg-emerald-500' : 'bg-primary'}`} 
                          style={{ width: `${user.avg_progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-500">{user.avg_progress}%</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {user.is_active ? 'Active Access' : 'Archived'}
                    </span>
                  </td>
                  <td className="p-6 text-right relative" ref={activeMenu === user.id ? menuRef : null}>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400"
                    >
                      <MoreVertical size={20}/>
                    </button>

                    {activeMenu === user.id && (
                      <div className="absolute right-12 top-10 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200">
                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                          <UserCog size={18} className="text-slate-400" /> Modify Profile
                        </button>
                        
                        <div className="my-2 border-t border-slate-50" />
                        
                        {user.is_active ? (
                          <button 
                            onClick={() => handleSoftDelete(user.id)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={18} /> Archive Student
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRestore(user.id)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <UserCheck size={18} /> Restore Access
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;