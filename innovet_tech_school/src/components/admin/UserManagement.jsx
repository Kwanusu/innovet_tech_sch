import React, { useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]); 

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Student</th>
                            <th className="p-4 font-semibold text-slate-600">Enrollments</th>
                            <th className="p-4 font-semibold text-slate-600">Avg. Progress</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.username}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{user.enrollment_count} Courses</td>
                                <td className="p-4 w-64">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500" 
                                                style={{ width: `${user.avg_progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium">{user.avg_progress}%</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;