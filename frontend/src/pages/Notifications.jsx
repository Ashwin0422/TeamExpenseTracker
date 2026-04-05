import { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import API from "../api/axios";
import Loader from "../components/Loader";

const tagColors = [
  "bg-purple-500/20 text-purple-400",
  "bg-orange-500/20 text-orange-400",
  "bg-green-500/20 text-green-400",
  "bg-blue-500/20 text-blue-400",
  "bg-pink-500/20 text-pink-400",
  "bg-yellow-500/20 text-yellow-400",
  "bg-indigo-500/20 text-indigo-400",
  "bg-violet-500/20 text-violet-400",
];

function Avatar({ name = "User" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#2d2040] to-[#1a1a2e] border border-white/10 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
      {initials}
    </div>
  );
}

export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const { collapsed } = useSidebar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const getRandomTagColor = () => {
    const index = Math.floor(Math.random() * tagColors.length);
    return tagColors[index];
  };

  const fetchRequests = async () => {
    try {
      const response = await API.get("/teams/my-requests");
      const data = response.data;
      setRequests(data.joinRequests);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/teams/request/${id}`, { status: action });
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#111113] text-white font-sans px-4 sm:px-8 lg:px-12 py-8 sm:py-10 ${
        collapsed ? "lg:pl-[0px]" : "lg:pl-[30px]"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
            Requests
          </h1>
          <p className="text-white/40 text-sm sm:text-base">
            Manage requests team join requests and invitations.
          </p>
        </div>

        {/* Request Cards */}
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            {requests.length === 0 ? (
              <div className="bg-[#1c1b2e] border border-white/10 rounded-2xl px-6 py-10 text-center text-white/30 text-sm">
                All requests have been handled.
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-[#181820] border border-white/8 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 transition-all duration-200 hover:border-white/15"
                >
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar name={req?.userId?.name} />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#181820]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-base sm:text-lg truncate">
                        {req?.userId?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-white/35 text-xs tracking-widest uppercase">
                          Wants to join
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getRandomTagColor()}`}
                        >
                          {req?.teamId?.teamName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => handleAction(req._id, "rejected")}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all duration-150 border border-white/8 hover:border-white/15"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(req._id, "approved")}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#9166f8] text-[#1c1b2e] text-sm font-bold transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] shadow-lg"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Handled requests (faded) */}
            {/* {handled.map((req) => (
            <div
              key={req.id}
              className="bg-[#181820] border border-white/5 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 opacity-40"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <Avatar name={req.name} />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-base sm:text-lg truncate line-through">
                    {req.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-white/35 text-xs tracking-widest uppercase">
                      {req.status === "approved" ? "Approved" : "Declined"}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${req.tagColor}`}
                    >
                      {req.team}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`self-end sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
                  req.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {req.status === "approved" ? "Approved" : "Declined"}
              </span>
            </div>
          ))} */}
          </div>
        )}
      </div>
    </div>
  );
}
