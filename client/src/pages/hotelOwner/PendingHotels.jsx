import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const PendingHotels = () => {
  const { axios, getToken } = useAppContext();
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingHotels = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/pending-hotels", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setPendingHotels(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch pending hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (hotelId) => {
    setActionLoading(hotelId);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/approve-hotel",
        { hotelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        // Refresh list
        fetchPendingHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to approve hotel");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  return (
    <div className="font-outfit p-1 md:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-playfair text-3xl font-semibold text-slate-800">
          Pending Hotel Registrations
        </h1>
        <p className="text-slate-500 text-sm mt-1.5">
          Review and approve new hotel registrations to activate their dashboard access.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : pendingHotels.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-12 text-center max-w-2xl mx-auto mt-10">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          <h3 className="font-semibold text-lg text-slate-800">No Pending Approvals</h3>
          <p className="text-slate-500 text-sm mt-1">
            All registered hotels have been processed. Great job!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-medium text-slate-700 text-sm">
                  <th className="py-4 px-6">Hotel Info</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Contact info</th>
                  <th className="py-4 px-6">Submitted By</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingHotels.map((hotel) => (
                  <tr key={hotel._id} className="text-slate-700 text-sm hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 text-base">
                      {hotel.name}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{hotel.city}</div>
                      <div className="text-slate-400 text-xs mt-0.5 truncate max-w-xs">{hotel.address}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {hotel.contact}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={hotel.owner?.image || "https://api.dicebear.com/9.x/initials/svg?seed=owner"}
                          alt="owner"
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <div className="font-medium text-slate-800">{hotel.owner?.username}</div>
                          <div className="text-slate-400 text-xs">{hotel.owner?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleApprove(hotel._id)}
                        disabled={actionLoading !== null}
                        className="bg-primary hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-xs shadow hover:shadow-md transition-all duration-300 cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed min-w-[90px] inline-flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === hotel._id ? (
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          "Approve"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingHotels;
