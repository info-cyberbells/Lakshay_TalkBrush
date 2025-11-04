import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../features/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="ml-[240px] mt-[50px] mr-[250px] w-[calc(100%-240px)] pt-3 flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ml-[240px] mt-[50px] mr-[250px] w-[calc(100%-240px)] pt-3 flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">No data available</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Admins",
      value: data.totalAdmins || 0,
      change: "+0%",
      arrow: "↑"
    },
    {
      title: "Total Active Users",
      value: data.totalActiveUsers || 0,
      change: "+0%",
      arrow: "↑"
    },
    {
      title: "Conversations Today",
      value: data.conversationsToday || 0,
      change: "+0%",
      arrow: "↑"
    },
    {
      title: "Avg Conversation Time",
      value: `${data.avgConversationTime || 0} min`,
      change: "+0%",
      arrow: "↑"
    }
  ];

  return (
    <div className="ml-[240px] mt-[50px] mr-[250px] w-[calc(100%-240px)] pt-3">
      <header className="px-[12px] mx-[6px] py-[6px]">
        <div className="flex flex-wrap justify-between p-[8px] gap-6 font-Inter rounded-[20px]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 max-w-xs rounded-xl shadow p-4 ${index === 1 || index === 3 ? "bg-[#2D4CCA2B]" : "bg-[#FFF1CF]"
                }`}
            >
              <p className="font-normal not-italic text-[14px] leading-[20px] tracking-[0px]">
                {stat.title}
              </p>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-2xl font-medium text-gray-800">
                  {stat.value}
                </h2>
                <p className="text-[12px] leading-[16px] font-normal">
                  {stat.change} {stat.arrow}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Stats and graph Area */}
      <main className="flex mx-6 p-4 border-[0.5px] border-[#F5EFFC] rounded-2xl mt-5">
        {/* Statistics Chart */}
        <div className="flex-1">
          <div className="relative h-80 w-full">
            <svg viewBox="0 0 500 240" className="w-full h-full">
              {/* Y-axis labels */}
              {data.statistics?.labels.map((label, index) => (
                <text
                  key={`label-${index}`}
                  x="20"
                  y={220 - (index * 200) / 6}
                  className="text-xs fill-gray-400"
                >
                  {label}
                </text>
              ))}

              {/* Grid lines */}
              {data.statistics?.labels.map((_, index) => (
                <line
                  key={`grid-${index}`}
                  x1="50"
                  y1={220 - (index * 200) / 6}
                  x2="480"
                  y2={220 - (index * 200) / 6}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              ))}

              {/* Last Week Data (Yellow Line) */}
              {data.statistics?.lastWeekData.map((value, index) => {
                if (index === data.statistics.lastWeekData.length - 1) return null;
                const x1 = 50 + (index * 430) / 6;
                const y1 = 220 - (value * 200) / 10;
                const x2 = 50 + ((index + 1) * 430) / 6;
                const y2 = 220 - (data.statistics.lastWeekData[index + 1] * 200) / 10;
                return (
                  <line
                    key={`lastweek-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#F8C140"
                    strokeWidth="3"
                  />
                );
              })}

              {/* This Week Data (Blue Line) */}
              {data.statistics?.thisWeekData.map((value, index) => {
                if (index === data.statistics.thisWeekData.length - 1) return null;
                const x1 = 50 + (index * 430) / 6;
                const y1 = 220 - (value * 200) / 10;
                const x2 = 50 + ((index + 1) * 430) / 6;
                const y2 = 220 - (data.statistics.thisWeekData[index + 1] * 200) / 10;
                return (
                  <line
                    key={`thisweek-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#2D4CCA"
                    strokeWidth="3"
                  />
                );
              })}

              {/* Data points */}
              {data.statistics?.thisWeekData.map((value, index) => {
                const x = 50 + (index * 430) / 6;
                const y = 220 - (value * 200) / 10;
                return (
                  <circle
                    key={`point-this-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#2D4CCA"
                  />
                );
              })}

              {data.statistics?.lastWeekData.map((value, index) => {
                const x = 50 + (index * 430) / 6;
                const y = 220 - (value * 200) / 10;
                return (
                  <circle
                    key={`point-last-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#F8C140"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <section className="grid gap-5">
          <div className="pl-[60px]">
            <h1 className="font-medium text-base">Weekly</h1>
            <div className="flex gap-7 font-cario text-lg font-normal text-[#A098AE]">
              <header>
                <h2>This Week</h2>
                <span className="font-bold text-2xl text-[#2D4CCA]">
                  + {data.weekly?.thisWeek || 0}%
                </span>
              </header>
              <header>
                <h2>Last Week</h2>
                <span className="font-bold text-2xl text-[#F8C140]">
                  + {data.weekly?.lastWeek || 0}%
                </span>
              </header>
            </div>
          </div>
          <div className="pl-[60px]">
            {/* Impression Chart */}
            <div className="h-[150px] flex flex-col justify-center">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-[#2D4CCA]">
                  {data.impression?.count.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total Impressions</div>
                <div
                  className={`text-lg font-semibold mt-2 ${(data.impression?.change || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                    }`}
                >
                  {(data.impression?.change || 0) >= 0 ? "+" : ""}
                  {data.impression?.change || 0}%
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;