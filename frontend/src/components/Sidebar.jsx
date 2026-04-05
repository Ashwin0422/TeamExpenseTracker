import { createContext, use, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    path: "/"
  },
  {
    id: "create",
    label: "Create Team",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    path: "/create-team"
  },
  {
    id: "join",
    label: "Join Team",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12h6M13 10l2 2-2 2" />
      </svg>
    ),
    path: "/join-team"
  
  },
];

const BOTTOM_ITEMS = [
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    badge: 3,
    path: "/notifications"
  },
];

function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
      <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-900/40">
        <span className="text-white font-bold text-sm">$</span>
      </div>
      <span
        className={`text-white font-semibold text-base tracking-tight transition-all duration-300 overflow-hidden whitespace-nowrap ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        TeamSpend
      </span>
    </div>
  );
}

function NavItem({ item, collapsed, onClick , totalRequest, location}) {
  return (
    <button
      onClick={() => onClick(item.id)}
      title={collapsed ? item.label : undefined}
      className={`
        relative group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200 cursor-pointer
        ${
          location === item.path
            ? "bg-violet-600/20 text-violet-300"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      {/* Active indicator */}
      {location === item.path && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-full" />
      )}

      <span className={`flex-shrink-0 ${location === item.path ? "text-violet-400" : ""}`}>
        {item.icon}
      </span>

      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        {item.label}
      </span>

      {/* Badge */}
      {item.id === "notifications" && !collapsed && (
        <span className="ml-auto bg-violet-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
          {totalRequest}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap shadow-xl border border-white/10 z-50">
          {item.label}
          {item.id === "notifications" && (
            <span className="ml-1.5 bg-violet-500 text-white text-xs font-semibold px-1 py-0.5 rounded-full">
              {totalRequest}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

function UserCard({ collapsed, user }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer group ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ring-2 ring-violet-500/30">
        {user.name?.[0] || "A"}
      </div>
      <div
        className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        <p className="text-white text-sm font-medium truncate leading-tight">
          {user.name}
        </p>
        <p className="text-zinc-500 text-xs truncate">{user.email}</p>
      </div>
      {!collapsed && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0"
        >
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

function SignOutButton({ collapsed , Navigate, auth }) {
  const signOutBtnClicked = () => {
    auth.logout();
    Navigate("/login-signup");
  }

  return (
    <button
      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${
        collapsed ? "justify-center" : ""
      }`}
      title={collapsed ? "Sign out" : undefined}
      onClick={signOutBtnClicked}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-5 h-5 flex-shrink-0"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        Sign out
      </span>
    </button>
  );
}

function CollapseToggle({ collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-3 top-6 w-6 h-6 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-200 z-50 shadow-lg"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={`w-3 h-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

// Mobile overlay
function MobileOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
      onClick={onClose}
    />
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [totalRequest, setTotalRequest] = useState(0);
  const Navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const { collapsed, toggleSidebar } = useSidebar();
  const { user } = useAuth();

  const fetchPendingRequest = async () => {
    if (!user) return;
    try {
      const response = await API.get("/teams/my-requests");
      const data = response.data;
      setTotalRequest(data.totalRequests)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPendingRequest();
  }, [user]);

  const ChangePage = (id) => {
    switch (id) {
      case "dashboard":
        Navigate("/");
        break;
      case "create":
        Navigate("/create-team");
        break;
      case "join":
        Navigate("/join-team");
        break;
      case "notifications":
        Navigate("/notifications");
        break;
      default:
        break;
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-white shadow-xl"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile overlay */}
      <MobileOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          flex flex-col
          bg-[#0f0f10] border-r border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0 shadow-2xl shadow-black/60" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:block relative">
          <CollapseToggle collapsed={collapsed} onClick={toggleSidebar} />
        </div>

        {/* Logo */}
        <Logo collapsed={collapsed} />

        {/* Main nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1 px-1 transition-all duration-300 ${
              collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              location={location.pathname}
              onClick={(id) => {
                setMobileOpen(false);
                ChangePage(id)
              }}
            />
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-white/5" />

          <p
            className={`text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-1 px-1 transition-all duration-300 ${
              collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            General
          </p>
          {BOTTOM_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              totalRequest = {totalRequest} 
              collapsed={collapsed}
              onClick={(id) => {
                setMobileOpen(false);
                ChangePage(id)
              }}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 flex flex-col gap-1 border-t border-white/5 pt-3">
          {user && <UserCard collapsed={collapsed} user={user} />}
          <SignOutButton collapsed={collapsed} Navigate={Navigate} auth={auth} />
        </div>
      </aside>
    </>
  );
}
