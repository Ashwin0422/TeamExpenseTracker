import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const TeamCard = React.memo(({ team }) => {
  const [totalSpent, setTotalSpent] = useState(0);
  const Navigate = useNavigate();

  const { teamName, budget, startDate, endDate, teamCode } = team;
  const utilization = Math.round((totalSpent / budget) * 100);
  const isOverBudget = totalSpent > budget;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const isInRange =
    new Date() >= new Date(startDate) && new Date() <= new Date(endDate);

  const initials = team.teamName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await API.get(`/expenses/team/${team._id}`);
        const data = response.data;
        setTotalSpent(data.totalSpent);
      } catch (err) {
        console.log(err);
      }
    };

    fetchExpenses();
  }, []);

  const progressColor =
    utilization >= 100
      ? "bg-red-500"
      : utilization >= 80
        ? "bg-amber-500"
        : "bg-violet-500";

  const navigateToTeamDetails = () => {
    Navigate(`/teams/${team._id}`);
  };

  return (
    <div
      onClick={navigateToTeamDetails}
      className="bg-[#141414] border border-[#242424] rounded-2xl p-5 w-full max-w-sm hover:border-[#363636] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 tracking-wide">
            {initials}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#f0f0f0] leading-tight mb-0.5">
              {teamName}
            </p>
            <p className="team-code text-[11px] tracking-widest font-mono">
              {teamCode}
            </p>
          </div>
        </div>

        {isInRange ? (
          <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-md bg-green-950 text-green-400 border border-green-900">
            Active
          </span>
        ) : (
          <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-md bg-yellow-950 text-yellow-400 border border-yellow-900">
            Inactive
          </span>
        )}
      </div>
      {/* Divider */}
      <div className="h-px bg-[#1e1e1e] mb-4" />
      {/* Budget Row */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-[rgb(85,85,85)] mb-1">
            Total Budget
          </p>
          <p className="text-lg font-semibold text-[#e0e0e0] tracking-tight">
            {formatCurrency(budget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium tracking-widest uppercase text-[#555] mb-1">
            Spent
          </p>
          <p
            className={`text-lg font-semibold tracking-tight ${isOverBudget ? "text-red-400" : "text-amber-400"}`}
          >
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>
      Utilization
      <div className="mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#555]">
            Utilization
          </span>
          <span className="text-[11px] text-[#888]">{utilization || 0}%</span>
        </div>
        <div className="h-1 bg-[#242424] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-end">
        {/* View Details Button */}
        <button className="bg-[#1e1e1e] border border-[#2e2e2e] text-[#d0d0d0] text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#282828] hover:border-[#3e3e3e] hover:text-white transition-all duration-150">
          View Details
        </button>
      </div>
    </div>
  );
});

export default TeamCard;
