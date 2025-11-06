import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../features/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  const [hoveredPoint, setHoveredPoint] = React.useState(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 flex items-center justify-center h-screen">
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
    <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 lg:px-0 mt-4">
      <header className="px-3 lg:px-[12px] mx-0 lg:mx-[6px] py-[6px]">
        <div className="flex flex-wrap justify-center lg:justify-between p-2 lg:p-[8px] gap-3 lg:gap-6 font-Inter rounded-[20px]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 min-w-[calc(50%-12px)] sm:min-w-[140px] max-w-xs rounded-xl shadow p-3 lg:p-4 ${index === 1 || index === 3 ? "bg-[#2D4CCA2B]" : "bg-[#FFF1CF]"
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
      <main className="mx-0 lg:mx-6 p-3 lg:p-6 border-[0.5px] border-[#F5EFFC] rounded-2xl mt-5">
        <div className="mb-6">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-800">User Activity Statistics</h2>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">Weekly comparison of user engagement</p>
          <div className="flex gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#2D4CCA]"></div>
              <span className="text-sm text-gray-600">This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F8C140]"></div>
              <span className="text-sm text-gray-600">Last Week</span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Statistics Chart */}
          <div className="flex-1">
            <div className="relative h-64 lg:h-80 w-full mt-4 lg:mt-8 overflow-x-auto">
              <svg viewBox="0 0 500 240" className="w-full h-full min-w-[400px]">
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
                      onMouseEnter={() => setHoveredPoint({ value, x, y, type: 'this' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: 'pointer' }}
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
                      onMouseEnter={() => setHoveredPoint({ value, x, y, type: 'last' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                })}

                {/* Tooltip */}
                {hoveredPoint && (
                  <g>
                    <rect
                      x={hoveredPoint.x - 25}
                      y={hoveredPoint.y - 35}
                      width="50"
                      height="25"
                      fill="white"
                      stroke={hoveredPoint.type === 'this' ? '#2D4CCA' : '#F8C140'}
                      strokeWidth="2"
                      rx="4"
                    />
                    <text
                      x={hoveredPoint.x}
                      y={hoveredPoint.y - 18}
                      textAnchor="middle"
                      className="text-sm font-semibold"
                      fill={hoveredPoint.type === 'this' ? '#2D4CCA' : '#F8C140'}
                    >
                      {hoveredPoint.value}
                    </text>
                  </g>
                )}

                {/* X-axis labels (Days) */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const x = 50 + (index * 430) / 6;
                  return (
                    <text
                      key={`day-${index}`}
                      x={x}
                      y="240"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {day}
                    </text>
                  );
                })}

                {/* X-axis line */}
                <line
                  x1="50"
                  y1="220"
                  x2="480"
                  y2="220"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />

                {/* Y-axis line */}
                <line
                  x1="50"
                  y1="20"
                  x2="50"
                  y2="220"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />

                {/* Y-axis label */}
                <text
                  x="10"
                  y="120"
                  transform="rotate(-90 10 120)"
                  className="text-xs fill-gray-600 font-medium"
                >
                  Values
                </text>

                {/* X-axis label */}
                <text
                  x="265"
                  y="260"
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-medium"
                >
                  Days of Week
                </text>
              </svg>
            </div>
          </div>

          <section className="grid gap-5 w-full lg:w-auto mt-6 lg:mt-0">
            <div className="pl-0 lg:pl-[60px] text-center lg:text-left">
              <h1 className="font-medium text-sm lg:text-base">Weekly</h1>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-7 font-cario text-base lg:text-lg font-normal text-[#A098AE] justify-center lg:justify-start">
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
            <div className="pl-0 lg:pl-[60px]">
              {/* Impression Chart */}
              <div className="h-[150px] flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="text-2xl lg:text-4xl font-bold text-[#2D4CCA]">
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;