import { useState, useEffect, useMemo } from "react";
import { useSidebar } from "../context/SidebarContext";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const categoryColor = {
  // Marketing
  Marketing: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Advertising: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  SEO: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
  SocialMedia: "bg-pink-500/20 text-pink-300 border border-pink-500/30",

  // Software & Tech
  Software: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  SaaS: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  Development: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  Infrastructure:
    "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  Security: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  Analytics: "bg-blue-400/20 text-blue-200 border border-blue-400/30",

  // Media & Creative
  Media: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Design: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
  Photography: "bg-green-500/20 text-green-300 border border-green-500/30",
  Video: "bg-lime-500/20 text-lime-300 border border-lime-500/30",
  Audio: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",

  // Communication
  Communication: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Email: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Messaging: "bg-orange-400/20 text-orange-300 border border-orange-400/30",
  Phone: "bg-yellow-400/20 text-yellow-200 border border-yellow-400/30",

  // Finance
  Finance: "bg-green-600/20 text-green-300 border border-green-600/30",
  Payroll: "bg-emerald-600/20 text-emerald-300 border border-emerald-600/30",
  Tax: "bg-red-400/20 text-red-300 border border-red-400/30",
  Insurance: "bg-teal-600/20 text-teal-300 border border-teal-600/30",
  Subscription: "bg-cyan-600/20 text-cyan-300 border border-cyan-600/30",
  Invoice: "bg-lime-600/20 text-lime-300 border border-lime-600/30",
  Budget: "bg-green-400/20 text-green-200 border border-green-400/30",
  Savings: "bg-teal-400/20 text-teal-200 border border-teal-400/30",
  Investment: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",

  // Operations
  Operations: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30",
  Logistics: "bg-stone-500/20 text-stone-300 border border-stone-500/30",
  Travel: "bg-blue-300/20 text-blue-200 border border-blue-300/30",
  Office: "bg-slate-400/20 text-slate-300 border border-slate-400/30",
  Equipment: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  Shipping: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  Fuel: "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30",
  Maintenance: "bg-zinc-400/20 text-zinc-200 border border-zinc-400/30",

  // HR & People
  HR: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  Training: "bg-pink-400/20 text-pink-300 border border-pink-400/30",
  Recruitment:
    "bg-fuchsia-400/20 text-fuchsia-300 border border-fuchsia-400/30",
  Benefits: "bg-purple-400/20 text-purple-200 border border-purple-400/30",
  Salary: "bg-rose-400/20 text-rose-200 border border-rose-400/30",
  Bonus: "bg-pink-600/20 text-pink-300 border border-pink-600/30",

  // Food & Dining
  Food: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  Dining: "bg-amber-600/20 text-amber-300 border border-amber-600/30",
  Restaurant: "bg-red-500/20 text-red-300 border border-red-500/30",
  Coffee: "bg-yellow-700/20 text-yellow-400 border border-yellow-700/30",
  Groceries: "bg-green-500/20 text-green-300 border border-green-500/30",
  Snacks: "bg-orange-400/20 text-orange-200 border border-orange-400/30",
  Drinks: "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30",
  Catering: "bg-amber-400/20 text-amber-200 border border-amber-400/30",
  Lunch: "bg-lime-500/20 text-lime-300 border border-lime-500/30",
  Breakfast: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Dinner: "bg-red-600/20 text-red-300 border border-red-600/30",

  // Clothing & Fashion
  Dress: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
  Clothing: "bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-600/30",
  Fashion: "bg-rose-600/20 text-rose-300 border border-rose-600/30",
  Accessories: "bg-purple-600/20 text-purple-300 border border-purple-600/30",
  Shoes: "bg-violet-400/20 text-violet-200 border border-violet-400/30",
  Uniform: "bg-indigo-400/20 text-indigo-200 border border-indigo-400/30",
  Apparel: "bg-pink-300/20 text-pink-200 border border-pink-300/30",
  Jewelry: "bg-yellow-300/20 text-yellow-200 border border-yellow-300/30",

  // Daily & Lifestyle
  DailyExpense: "bg-sky-400/20 text-sky-300 border border-sky-400/30",
  Daily: "bg-sky-400/20 text-sky-300 border border-sky-400/30",
  Personal: "bg-violet-300/20 text-violet-200 border border-violet-300/30",
  Hygiene: "bg-teal-300/20 text-teal-200 border border-teal-300/30",
  Laundry: "bg-blue-200/20 text-blue-200 border border-blue-200/30",
  Household: "bg-stone-400/20 text-stone-300 border border-stone-400/30",
  Cleaning: "bg-cyan-300/20 text-cyan-200 border border-cyan-300/30",
  Utilities: "bg-amber-300/20 text-amber-200 border border-amber-300/30",
  Electricity: "bg-yellow-400/20 text-yellow-200 border border-yellow-400/30",
  Water: "bg-blue-400/20 text-blue-200 border border-blue-400/30",
  Internet: "bg-indigo-300/20 text-indigo-200 border border-indigo-300/30",
  Rent: "bg-orange-600/20 text-orange-300 border border-orange-600/30",
  Mortgage: "bg-red-700/20 text-red-300 border border-red-700/30",

  // Health & Wellness
  Health: "bg-green-400/20 text-green-200 border border-green-400/30",
  Medical: "bg-red-400/20 text-red-200 border border-red-400/30",
  Pharmacy: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
  Fitness: "bg-lime-400/20 text-lime-200 border border-lime-400/30",
  Gym: "bg-orange-300/20 text-orange-200 border border-orange-300/30",
  Wellness: "bg-teal-300/20 text-teal-200 border border-teal-300/30",
  Dental: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
  Vision: "bg-blue-300/20 text-blue-200 border border-blue-300/30",
  MentalHealth: "bg-purple-300/20 text-purple-200 border border-purple-300/30",

  // Education
  Education: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  Books: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Courses: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Tuition: "bg-blue-600/20 text-blue-300 border border-blue-600/30",
  Stationery: "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30",
  Library: "bg-indigo-600/20 text-indigo-300 border border-indigo-600/30",

  // Transport
  Transport: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  Taxi: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Rideshare: "bg-lime-500/20 text-lime-300 border border-lime-500/30",
  Parking: "bg-gray-400/20 text-gray-300 border border-gray-400/30",
  Flight: "bg-sky-600/20 text-sky-300 border border-sky-600/30",
  Hotel: "bg-orange-600/20 text-orange-300 border border-orange-600/30",
  Accommodation: "bg-amber-700/20 text-amber-300 border border-amber-700/30",

  // Entertainment
  Entertainment:
    "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
  Gaming: "bg-violet-600/20 text-violet-300 border border-violet-600/30",
  Sports: "bg-green-600/20 text-green-300 border border-green-600/30",
  Events: "bg-pink-600/20 text-pink-300 border border-pink-600/30",
  Movies: "bg-red-600/20 text-red-300 border border-red-600/30",
  Music: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  Streaming: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  Hobbies: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
  Vacation: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",

  // Shopping
  Shopping: "bg-rose-400/20 text-rose-300 border border-rose-400/30",
  Electronics: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Furniture: "bg-stone-600/20 text-stone-300 border border-stone-600/30",
  Appliances: "bg-zinc-600/20 text-zinc-300 border border-zinc-600/30",
  Gifts: "bg-pink-400/20 text-pink-200 border border-pink-400/30",
  Toys: "bg-yellow-400/20 text-yellow-200 border border-yellow-400/30",
  Pets: "bg-orange-400/20 text-orange-200 border border-orange-400/30",

  // Legal & Professional
  Legal: "bg-slate-600/20 text-slate-300 border border-slate-600/30",
  Research: "bg-indigo-400/20 text-indigo-200 border border-indigo-400/30",
  Consulting: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30",
  Accounting: "bg-green-700/20 text-green-300 border border-green-700/30",
  Audit: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  Compliance: "bg-teal-700/20 text-teal-300 border border-teal-700/30",
  Notary: "bg-gray-600/20 text-gray-300 border border-gray-600/30",

  // Fallback
  Other: "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30",
  Miscellaneous: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
};

const getCategoryColor = (category) => {
  const key =
    category
      ?.toLowerCase()
      .replace(/\s+/g, "")
      .replace(/^(.)/, (c) => c.toUpperCase()) ?? // capitalize first letter to match keys
    "Other";

  return (
    categoryColor[key] ??
    "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30"
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    // Marketing
    marketing: "🎯",
    advertising: "📢",
    seo: "🔍",
    socialmedia: "📱",

    // Software & Tech
    software: "☁️",
    saas: "🖥️",
    development: "💻",
    infrastructure: "🛠️",
    security: "🔒",
    analytics: "📊",

    // Media & Creative
    media: "🎬",
    design: "🎨",
    photography: "📷",
    video: "🎥",
    audio: "🎧",

    // Communication
    communication: "📧",
    email: "📨",
    messaging: "💬",
    phone: "📞",

    // Finance
    finance: "💰",
    payroll: "💵",
    tax: "🧾",
    insurance: "🛡️",
    subscription: "🔄",
    invoice: "🗂️",
    budget: "📉",
    savings: "🏦",
    investment: "📈",

    // Operations
    operations: "⚙️",
    logistics: "📦",
    travel: "✈️",
    office: "🏢",
    equipment: "🖨️",
    shipping: "🚚",
    fuel: "⛽",
    maintenance: "🔧",

    // HR & People
    hr: "👥",
    training: "📚",
    recruitment: "🤝",
    benefits: "🎁",
    salary: "💳",
    bonus: "🏅",

    // Food & Dining
    food: "🍔",
    dining: "🍽️",
    restaurant: "🍜",
    coffee: "☕",
    groceries: "🛒",
    snacks: "🍿",
    drinks: "🥤",
    catering: "🍱",
    lunch: "🥗",
    breakfast: "🥐",
    dinner: "🍷",

    // Clothing & Fashion
    dress: "👗",
    clothing: "👕",
    fashion: "👠",
    accessories: "👜",
    shoes: "👟",
    uniform: "🥋",
    apparel: "🧥",
    jewelry: "💍",

    // Daily & Lifestyle
    dailyexpense: "🗓️",
    daily: "🗓️",
    personal: "🪪",
    hygiene: "🧴",
    laundry: "🧺",
    household: "🏠",
    cleaning: "🧹",
    utilities: "💡",
    electricity: "⚡",
    water: "💧",
    internet: "🌐",
    rent: "🏘️",
    mortgage: "🏗️",

    // Health & Wellness
    health: "🏥",
    medical: "💊",
    pharmacy: "🩺",
    fitness: "🏋️",
    gym: "💪",
    wellness: "🧘",
    dental: "🦷",
    vision: "👓",
    mentalhealth: "🧠",

    // Education
    education: "🎓",
    books: "📖",
    courses: "🏫",
    tuition: "✏️",
    stationery: "🖊️",
    library: "📚",

    // Transport
    transport: "🚌",
    taxi: "🚕",
    rideshare: "🚗",
    parking: "🅿️",
    flight: "🛫",
    hotel: "🏨",
    accommodation: "🛏️",

    // Entertainment & Leisure
    entertainment: "🎭",
    gaming: "🎮",
    sports: "⚽",
    events: "🎟️",
    movies: "🍿",
    music: "🎵",
    streaming: "📺",
    hobbies: "🎲",
    vacation: "🏖️",

    // Shopping & Retail
    shopping: "🛍️",
    electronics: "📱",
    furniture: "🛋️",
    appliances: "🫙",
    gifts: "🎀",
    toys: "🧸",
    pets: "🐾",

    // Legal & Professional
    legal: "⚖️",
    research: "🔬",
    consulting: "💼",
    accounting: "🧮",
    audit: "📋",
    compliance: "✅",
    notary: "📜",

    // Other
    other: "📌",
    miscellaneous: "🗃️",
    unknown: "❓",
  };

  const key = category?.toLowerCase().replace(/\s+/g, "") ?? "";
  return icons[key] ?? "📌";
};

const getTeamStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "inactive";
};

const StatusBadge = ({ startDate, endDate }) => {
  const status = getTeamStatus(startDate, endDate);

  const styles = {
    active: {
      class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      label: "● ACTIVE",
    },
    inactive: {
      class: "bg-red-500/15 text-red-400 border-red-500/25",
      label: "● INACTIVE",
    },
    upcoming: {
      class: "bg-amber-500/15 text-amber-400 border-amber-500/25",
      label: "● UPCOMING",
    },
  };

  const { class: cls, label } = styles[status];

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
};

const getDaysLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { days: 0, label: "Expired", status: "expired" };
  if (diffDays === 0) return { days: 0, label: "Ends Today", status: "today" };
  if (diffDays <= 7)
    return {
      days: diffDays,
      label: `${diffDays} Days Left`,
      status: "critical",
    };
  if (diffDays <= 14)
    return {
      days: diffDays,
      label: `${diffDays} Days Left`,
      status: "warning",
    };
  return { days: diffDays, label: `${diffDays} Days Left`, status: "safe" };
};

const DaysLeftBadge = ({ endDate }) => {
  const { label, status } = getDaysLeft(endDate);

  const styles = {
    safe: "text-zinc-400",
    warning: "text-amber-400",
    critical: "text-orange-400",
    today: "text-red-400",
    expired: "text-red-500",
  };

  const iconColors = {
    safe: "currentColor",
    warning: "currentColor",
    critical: "currentColor",
    today: "currentColor",
    expired: "currentColor",
  };

  if (status === "expired") {
    return (
      <span className={`flex items-center gap-1.5 text-xs ${styles.expired}`}>
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path fill="white" d="M15 9l-6 6M9 9l6 6" />
        </svg>
        Expired
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-1.5 text-xs ${styles[status]}`}>
      <svg
        className="w-3.5 h-3.5"
        fill={iconColors[status]}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path fill="white" d="M12 6v6l4 2" />
      </svg>
      {label}
    </span>
  );
};

const getTodayExpensesCount = (expenses) => {
  if (!Array.isArray(expenses)) return 0;

  const today = new Date();

  return expenses.filter((e) => {
    const expenseDate = new Date(e?.createdAt);
    return (
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getDate() === today.getDate()
    );
  }).length;
};

const categories = [
  "Marketing",
  "Advertising",
  "SEO",
  "Software",
  "SaaS",
  "Development",
  "Infrastructure",
  "Security",
  "Analytics",
  "Media",
  "Design",
  "Photography",
  "Video",
  "Audio",
  "Communication",
  "Email",
  "Finance",
  "Payroll",
  "Tax",
  "Insurance",
  "Subscription",
  "Operations",
  "Logistics",
  "Travel",
  "Office",
  "Equipment",
  "HR",
  "Training",
  "Recruitment",
  "Food",
  "Dining",
  "Groceries",
  "Clothing",
  "Fashion",
  "Daily",
  "Health",
  "Medical",
  "Fitness",
  "Education",
  "Transport",
  "Entertainment",
  "Gaming",
  "Shopping",
  "Electronics",
  "Legal",
  "Consulting",
  "Other",
];

const isTeamActive = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
};

export default function Team() {
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [team, setTeam] = useState({});
  const [budget, setBudget] = useState({});
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    invoice: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const { collapsed } = useSidebar();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showTeammates, setShowTeammates] = useState(false);

  const [showEditTeam, setShowEditTeam] = useState(false);
  const [editForm, setEditForm] = useState({
    teamName: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  const isExpired = !isTeamActive(team?.startDate, team?.endDate);

  const handleEditTeam = async () => {
    if (new Date(editForm.endDate) <= new Date(editForm.startDate)) {
      setEditError("End date must be after start date.");
      return;
    }
    if (
      !editForm.teamName ||
      !editForm.budget ||
      !editForm.startDate ||
      !editForm.endDate
    ) {
      setEditError("All fields are required.");
      return;
    }

    if (new Date(editForm.endDate) <= new Date(editForm.startDate)) {
      setEditError("End date must be after start date.");
      return;
    }

    setEditing(true);
    setEditError("");
    try {
      const res = await API.put(`/teams/${team.id}`, {
        teamName: editForm.teamName,
        budget: parseFloat(editForm.budget),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });

      const updated = res.data?.team ?? res.data;
      setTeam((prev) => ({ ...prev, ...updated }));
      setBudget((prev) => ({ ...prev, total: parseFloat(editForm.budget) }));
      setShowEditTeam(false);
    } catch (err) {
      setEditError("Failed to update team. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      teamName: team?.teamName ?? "",
      budget: team?.budget ?? "",
      startDate: team?.startDate?.split("T")[0] ?? "",
      endDate: team?.endDate?.split("T")[0] ?? "",
    });
    setEditError("");
    setShowEditTeam(true);
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [location.pathname]);

  const fetchTeamDetails = async () => {
    try {
      const response = await API.get(`${location.pathname}/overview`);
      const data = response.data.data;
      setTeam(data.team);
      setExpenses(data.expenses?.items);
      setBudget(data.budget);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return expenses?.filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, expenses]);

  const handleDelete = async (id) => {
    try {
      const expenseToDelete = expenses.find((e) => e._id === id);

      const res = await API.delete(`/expenses/${id}`);

      if (res.status === 200) {
        setExpenses((prev) => prev.filter((e) => e._id !== id));

        if (expenseToDelete) {
          setBudget((prev) => {
            const newSpent =
              (prev?.spent ?? 0) - parseFloat(expenseToDelete.amount);
            const newRemaining = (prev?.total ?? 0) - newSpent;
            const newUsedPercentage =
              prev?.total > 0
                ? parseFloat(((newSpent / prev.total) * 100).toFixed(2))
                : 0;

            return {
              ...prev,
              spent: newSpent,
              remaining: newRemaining,
              usedPercentage: newUsedPercentage,
            };
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddExpense = async () => {
    if (!form.title || !form.amount || !form.category) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("teamId", team.id);
      formData.append("title", form.title);
      formData.append("amount", form.amount);
      formData.append("category", form.category);
      if (form.invoice) {
        formData.append("invoice", form.invoice); // File object
      }

      const res = await API.post("/expenses/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newExpense = res.data;
      if (newExpense) {
        setExpenses((prev) => [
          newExpense,
          ...(Array.isArray(prev) ? prev : []),
        ]);
        setBudget((prev) => {
          const newSpent = (prev?.spent ?? 0) + parseFloat(form.amount);
          const newRemaining = (prev?.total ?? 0) - newSpent;
          const newUsedPercentage =
            prev?.total > 0
              ? parseFloat(((newSpent / prev.total) * 100).toFixed(2))
              : 0;
          return {
            ...prev,
            spent: newSpent,
            remaining: newRemaining,
            usedPercentage: newUsedPercentage,
          };
        });
      }

      setForm({ title: "", amount: "", category: "", invoice: null });
      setShowAddExpense(false);
    } catch (err) {
      console.error("Failed to add expense:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Preview — opens the invoice URL in a new tab
  const handlePreviewInvoice = (t) => {
    if (t.invoice?.url) {
      window.open(t.invoice.url, "_blank", "noopener,noreferrer");
    }
  };

  // Download — fetches the file and triggers a download
  const handleDownloadInvoice = async (t) => {
    if (!t.invoice?.url) return;
    try {
      const response = await fetch(t.invoice.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = t.invoice?.name ?? `invoice-${t._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
    }
  };

  const downloadExpenses = () => {
    if (!expenses?.length) return;

    const formatted = expenses.map((e) => ({
      Date: new Date(e.createdAt),
      Description: e.title,
      Category: e.category,
      Amount: e.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    worksheet["!cols"] = [
      { wch: 18 }, // Date
      { wch: 32 }, // Description
      { wch: 16 }, // Category
      { wch: 12 }, // Amount
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, `${team?.teamName ?? "team"}-expenses.xlsx`);
  };

  return (
    <>
      {loading ? (
        <div className="h-screen bg-[#0d0d0f] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div
          className={`flex h-screen bg-[#0d0d0f] text-white font-sans overflow-hidden ${
            collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
          }`}
        >
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge
                      startDate={team?.startDate}
                      endDate={team?.endDate}
                    />
                    <DaysLeftBadge endDate={team?.endDate} />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                    {team?.teamName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="text-zinc-400 text-sm">
                      Track, manage, and review your team's spending in one
                      place.
                    </p>
                    <span className="w-px h-3.5 bg-zinc-700 hidden sm:block" />
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      {new Date(team?.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span className="text-zinc-600">→</span>
                      {new Date(team?.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {/* Team Code */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-violet-500/10 hover:border-violet-500/20 transition-all duration-200 group">
                    <svg
                      className="w-3.5 h-3.5 text-zinc-500 group-hover:text-violet-400 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span className="text-zinc-500 text-xs font-mono font-medium tracking-widest group-hover:text-violet-400 transition-colors duration-200">
                      {team?.teamCode}
                    </span>
                  </div>

                  {/* Teammates Button */}
                  <button
                    onClick={() => setShowTeammates(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="7" r="3" />
                      <circle cx="16" cy="9" r="2.5" />
                      <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                      <path d="M16 14c2.21 0 4 1.79 4 4" />
                    </svg>
                    Team
                    <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-zinc-400 text-[11px] font-semibold">
                      {team?.members?.length ?? 0}
                    </span>
                  </button>

                  {/* Edit Team */}
                  <button
                    onClick={openEditModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-600/25"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Team
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Budget */}
                <div className="bg-[#16161a] border border-white/5 rounded-2xl p-5">
                  <p className="text-[11px] tracking-widest text-zinc-500 uppercase font-medium mb-3">
                    Total Budget
                  </p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {budget?.total}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-zinc-400 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    Allocated by {team?.leader?.name}
                  </p>
                </div>
                {/* Total Spent */}
                <div className="bg-[#16161a] border border-white/5 rounded-2xl p-5">
                  <p className="text-[11px] tracking-widest text-zinc-500 uppercase font-medium mb-3">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {budget?.spent}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-red-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    {getTodayExpensesCount(expenses)} new expenses
                  </p>
                </div>
                {/* Remaining */}
                <div className="bg-[#16161a] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] tracking-widest text-zinc-500 uppercase font-medium">
                      Remaining
                    </p>
                    <span className="text-xs font-semibold text-violet-400">
                      {budget?.usedPercentage}% Used
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-3">
                    {budget?.remaining}
                  </p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
                      style={{ width: `${budget?.usedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Team Expenses Table */}
              <div className="bg-[#16161a] border border-white/5 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-white/5">
                  <h2 className="text-lg font-bold text-white shrink-0">
                    Team Expenses
                  </h2>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search transactions..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Filter */}
                      <button className="flex items-center gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-sm transition-all">
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                        </svg>
                        <span className="hidden sm:inline">Filter</span>
                      </button>

                      {/* Export */}
                      <button
                        disabled={expenses?.length === 0}
                        onClick={downloadExpenses}
                        className="flex items-center gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-sm transition-all"
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        <span className="hidden sm:inline">Export</span>
                      </button>

                      {/* Add Expense */}
                      <button
                        disabled={isExpired}
                        onClick={() => setShowAddExpense(true)}
                        className={`flex items-center gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
      ${
        isExpired
          ? "bg-white/5 text-zinc-600 border border-white/10 cursor-not-allowed shadow-none"
          : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25"
      }`}
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="hidden sm:inline">
                          {isExpired ? "Team Expired" : "Add Expense"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table head */}
                <div className="hidden sm:grid grid-cols-12 px-5 py-3 text-[11px] tracking-widest text-zinc-600 uppercase font-medium border-b border-white/5">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/[0.04]">
                  {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <svg
                          className="w-7 h-7 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <path d="M2 10h20" />
                          <path d="M6 15h4M14 15h4" strokeLinecap="round" />
                        </svg>
                      </div>

                      <h3 className="text-sm font-semibold text-white mb-1">
                        {search ? "No results found" : "No expenses yet"}
                      </h3>

                      <p className="text-xs text-zinc-500 text-center max-w-xs mb-5">
                        {search
                          ? `No expenses match "${search}". Try a different keyword.`
                          : "This team hasn't recorded any expenses yet. Add your first one to get started."}
                      </p>

                      {search ? (
                        <button
                          onClick={() => setSearch("")}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-medium transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          Clear Search
                        </button>
                      ) : (
                        !isExpired && (
                          <button
                            onClick={() => setShowAddExpense(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-600/25"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add First Expense
                          </button>
                        )
                      )}
                    </div>
                  )}
                  {filtered.map((t) => (
                    <div
                      key={t._id}
                      className="grid grid-cols-2 sm:grid-cols-12 items-center gap-y-2 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Description */}
                      <div className="col-span-2 sm:col-span-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                          {getCategoryIcon(t.category)}
                        </div>
                        <div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {t.title}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                              </svg>
                              {t.userId?.name ?? "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Category */}
                      <div className="col-span-1 sm:col-span-2">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium ${getCategoryColor(
                            t.category,
                          )}`}
                        >
                          {t.category}
                        </span>
                      </div>
                      {/* Date */}
                      <div className="col-span-1 sm:col-span-3 text-sm text-zinc-400">
                        {t.createdAt?.split("T")[0]}
                      </div>
                      {/* Amount */}
                      <div className="col-span-1 sm:col-span-1 text-right">
                        <span className="text-sm font-semibold text-red-400">
                          ${Math.abs(t.amount).toFixed(2)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 sm:col-span-2 flex justify-center items-center gap-1">
                        {/* Preview Invoice */}
                        {t.invoice?.url && (
                          <button
                            onClick={() => handlePreviewInvoice(t)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                            title="Preview invoice"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        )}

                        {/* Download Invoice */}
                        {t.invoice?.url && (
                          <button
                            onClick={() => handleDownloadInvoice(t)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                            title="Download invoice"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                          title="Delete expense"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          {showAddExpense && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowAddExpense(false)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-md bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl p-6 z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Add Expense
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Record a new team expense
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google Ads Platform"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                        className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#16161a]">
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#16161a]">
                          {getCategoryIcon(cat)} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  {form.category && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                      <span className="text-lg">
                        {getCategoryIcon(form.category)}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg text-[11px] font-medium ${getCategoryColor(form.category)}`}
                      >
                        {form.category}
                      </span>
                      {form.amount && (
                        <span className="ml-auto text-sm font-semibold text-red-400">
                          -${parseFloat(form.amount || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Invoice Upload */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Invoice{" "}
                      <span className="text-zinc-600 font-normal">
                        (optional)
                      </span>
                    </label>

                    {!form.invoice ? (
                      <label className="flex flex-col items-center justify-center gap-2 w-full py-5 border border-dashed border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-violet-500/10 transition-all">
                          <svg
                            className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            Click to upload invoice
                          </p>
                          <p className="text-[11px] text-zinc-600 mt-0.5">
                            JPG, PNG, WEBP or PDF · Max 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              invoice: e.target.files[0] || null,
                            }))
                          }
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.03] border border-white/8 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                          {form.invoice.type === "application/pdf" ? (
                            <svg
                              className="w-4 h-4 text-violet-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-violet-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {form.invoice.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {(form.invoice.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setForm((prev) => ({ ...prev, invoice: null }))
                          }
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExpense}
                    disabled={
                      !form.title ||
                      !form.amount ||
                      !form.category ||
                      submitting
                    }
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                  >
                    {submitting ? "Adding..." : "Add Expense"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTeammates && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowTeammates(false)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-md bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Team Members
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {team?.members?.length ?? 0} member
                      {team?.members?.length !== 1 ? "s" : ""} in{" "}
                      {team?.teamName}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTeammates(false)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Leader */}
                <div className="px-6 py-4 border-b border-white/5">
                  <p className="text-[11px] tracking-widest text-zinc-600 uppercase font-medium mb-3">
                    Team Leader
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg shadow-violet-600/20">
                      {team?.leader?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {team?.leader?.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {team?.leader?.email}
                      </p>
                    </div>
                    <span className="ml-auto px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25 text-[11px] font-semibold">
                      Leader
                    </span>
                  </div>
                </div>

                {/* Members */}
                <div className="px-6 py-4">
                  <p className="text-[11px] tracking-widest text-zinc-600 uppercase font-medium mb-3">
                    Members
                  </p>

                  {team?.members?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <circle cx="9" cy="7" r="3" />
                          <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                        </svg>
                      </div>
                      <p className="text-sm text-zinc-500">No members yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {team?.members?.map((member, index) => {
                        const isLeader = member._id === team?.leader?._id;
                        const colors = [
                          "from-blue-500 to-cyan-500",
                          "from-emerald-500 to-teal-500",
                          "from-orange-500 to-amber-500",
                          "from-rose-500 to-pink-500",
                          "from-indigo-500 to-violet-500",
                          "from-lime-500 to-green-500",
                        ];
                        const color = colors[index % colors.length];

                        return (
                          <div
                            key={member._id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
                          >
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                            >
                              {member?.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {member?.name}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                {member?.email}
                              </p>
                            </div>
                            {isLeader && (
                              <span className="px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25 text-[11px] font-semibold shrink-0">
                                Leader
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5">
                  <button
                    onClick={() => setShowTeammates(false)}
                    className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white text-sm font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowEditTeam(false)}
              />

              {/* Modal */}
              <div className="relative w-full max-w-md bg-[#16161a] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Edit Team</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Update your team details
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditTeam(false)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Fields */}
                <div className="px-6 py-5 space-y-4">
                  {/* Team Name */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Team Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Global Marketing Core"
                      value={editForm.teamName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, teamName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={editForm.budget}
                        onChange={(e) =>
                          setEditForm({ ...editForm, budget: e.target.value })
                        }
                        className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) =>
                          setEditForm({ ...editForm, endDate: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {editError && (
                    <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <svg
                        className="w-4 h-4 text-red-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                      <span className="text-red-400 text-xs font-medium">
                        {editError}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-5 border-t border-white/5">
                  <button
                    onClick={() => setShowEditTeam(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditTeam}
                    disabled={editing}
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
                  >
                    {editing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth={4}
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
