import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../api/axios";
import TeamCard from "../components/TeamCard";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const getActiveTeamsCount = (teams) => {
  if (!Array.isArray(teams)) return 0;

  const now = new Date();

  return teams.filter((team) => {
    const start = new Date(team?.startDate);
    const end = new Date(team?.endDate);
    return now >= start && now <= end;
  }).length;
};


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const Navigate = useNavigate();

  const activeCount = getActiveTeamsCount(teams);

  const totalBudget = teams.reduce((sum, team) => {
    return sum + (team.budget || 0);
  }, 0);

  const totalSpent = expenses.reduce((sum, expense) => {
    return sum + (expense.amount || 0);
  }, 0);

  const remaining = totalBudget - totalSpent;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          API.get("/teams/my-teams"),
          API.get("/expenses/my-expenses"),
        ]);

        if (results[0].status === "fulfilled") {
          setTeams(results[0].value.data.teams);
        }

        if (results[1].status === "fulfilled") {
          setExpenses(results[1].value.data.expenses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Demo page content */}
      <div
        className={`min-h-screen bg-[#111113] text-white transition-all duration-300 ${
          collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
        } pl-0`}
      >
        <div className="p-8 lg:p-10">
          <div>
            <div className="flex items-center justify-between mb-2 mt-8 lg:mt-0">
              <h1 className="text-3xl font-bold">
                Good to see you, {user?.name} 👋
              </h1>
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={() => Navigate("/join-team")} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                  Join team
                </button>
                <button onClick={() => Navigate("/create-team")} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors">
                  + New team
                </button>
              </div>
            </div>
            <p className="text-zinc-500 mb-8">
              Here's an overview of your team budgets
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {[
                {
                  label: "TOTAL TEAMS",
                  value: teams.length,
                  sub: `${activeCount} Active  •  ${teams.length - activeCount} Inactive`,
                  valueColor: "text-violet-400",
                },
                {
                  label: "COMBINED BUDGET",
                  value: totalBudget,
                  badge: "12 DAYS LEFT",
                  sub: `Used ${Math.round((totalSpent / totalBudget) * 100)}%`,
                  valueColor: "text-emerald-400",
                },
                {
                  label: "TOTAL SPENT",
                  value: totalSpent,
                  sub: `Balance ${Math.round(remaining / totalBudget * 100)}%`,
                  valueColor: "text-yellow-400",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] tracking-widest text-zinc-500 font-semibold uppercase">
                      {card.label}
                    </p>
                    {card.badge && (
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-white/5">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-4xl font-bold ${card.valueColor}`}>
                    {card.value}
                  </p>
                  <p className="text-zinc-500 text-sm mt-3">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Your teams</h2>
            <span className="text-xs bg-violet-900/40 text-violet-300 border border-violet-500/20 px-3 py-1 rounded-full">
              {teams.length} total
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : teams?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 border-2 border-zinc-700 rounded-xl rotate-45 mb-6 opacity-40" />
              <p className="text-lg font-semibold text-white mb-1">
                No teams yet
              </p>
              <p className="text-zinc-500 text-sm mb-7">
                Create a new team or join one with a team code
              </p>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/5 transition-colors">
                  Join team
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-colors">
                  Create team
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
