import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const { axios, getToken } = useAppContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Suspension modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setUsers(data.users || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { data } = await axios.post('/api/admin/users/update-role', {
                userId,
                role: newRole
            }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                fetchUsers(); // refresh
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleToggleSuspension = async (user) => {
        if (!user.isSuspended) {
            // Open suspension reason input modal
            setSelectedUser(user);
            setSuspensionReason("");
            setShowModal(true);
        } else {
            // Unsuspend directly
            try {
                const { data } = await axios.post('/api/admin/users/toggle-suspension', {
                    userId: user._id,
                    isSuspended: false
                }, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });

                if (data.success) {
                    toast.success(data.message);
                    fetchUsers();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const submitSuspension = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/admin/users/toggle-suspension', {
                userId: selectedUser._id,
                isSuspended: true,
                suspensionReason
            }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm font-outfit relative">
            <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">User & Host Accounts Management</h2>
            
            <div className="overflow-x-auto mt-6 rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-slate-55">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Account</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">User Role</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 bg-white">
                        {users.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={item.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} 
                                            alt="avatar" 
                                            className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-100" 
                                        />
                                        <span className="font-semibold text-gray-800">{item.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-light">
                                    {item.email}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={item.role}
                                        onChange={(e) => handleRoleChange(item._id, e.target.value)}
                                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 outline-indigo-500 cursor-pointer bg-slate-50 focus:bg-white"
                                    >
                                        <option value="user">User</option>
                                        <option value="hotelOwner">Hotel Owner</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {item.isSuspended ? (
                                        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-red-50 text-red-700 border border-red-100" title={item.suspensionReason}>
                                            Suspended
                                        </span>
                                    ) : (
                                        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleToggleSuspension(item)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors border ${
                                            item.isSuspended 
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' 
                                                : 'bg-white hover:bg-red-50 text-red-600 border-red-200'
                                        }`}
                                    >
                                        {item.isSuspended ? 'Activate' : 'Suspend'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Suspend Reason Modal popup */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl font-outfit border border-gray-200">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <h4 className="font-semibold text-lg text-gray-800">Suspend Account</h4>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={submitSuspension} className="mt-4 space-y-4">
                            <div>
                                <p className="text-xs text-gray-400">Suspending account for:</p>
                                <p className="text-sm font-semibold text-gray-700 mt-1">{selectedUser.username} ({selectedUser.email})</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Reason for Suspension</label>
                                <textarea
                                    rows="3"
                                    value={suspensionReason}
                                    onChange={(e) => setSuspensionReason(e.target.value)}
                                    placeholder="e.g. Repeated violation of hotel booking policies."
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light resize-none bg-slate-50 focus:bg-white"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow cursor-pointer"
                                >
                                    Suspend Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
