import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../features/dashboardSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.dashboard);
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = React.useState("week");

    useEffect(() => {
        dispatch(fetchDashboardData(selectedType));
    }, [dispatch, selectedType]);

    const handleCardClick = (cardTitle) => {
        if (cardTitle === "Active Users") {
            navigate('/manage-users');
        }
        else if (cardTitle === "Conversations Today") {
            navigate('/analytics')
        }
        else if (cardTitle === "Avg Conversation Time") {
            navigate('/analytics')
        }
        // Add more conditions if needed for other cards
    };


    if (loading) {
        return (
            <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 flex items-center justify-center h-screen">
                {/* <div className="text-xl font-semibold">Loading...</div> */}
                                             <div className="spinner "></div>

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
            title: "Active Users",
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

    // Transform data for Recharts
    const getChartLabels = () => {
        const isSmallScreen = window.innerWidth < 600;

        if (selectedType === 'week')
            return isSmallScreen
                ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        if (selectedType === 'month')
            return isSmallScreen
                ? ['W1', 'W2', 'W3', 'W4']
                : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

        // YEARLY
        return isSmallScreen
            ? ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    };


    const chartData = getChartLabels().map((label, index) => ({
        name: label,
        thisWeek: data.statistics?.thisWeekData[index] || 0,
        lastWeek: data.statistics?.lastWeekData[index] || 0,
    }));

    const getPeriodLabel = (current = true) => {
        if (selectedType === 'week') return current ? 'This Week' : 'Last Week';
        if (selectedType === 'month') return current ? 'This Month' : 'Last Month';
        return current ? 'This Year' : 'Last Year';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {index === 0 ? getPeriodLabel(true) : getPeriodLabel(false)}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 lg:px-0 mt-4">
            {/* Stats Cards */}
            <header className="px-3 lg:px-[12px] mx-0 lg:mx-[6px] py-[6px]">
                <div className="flex flex-wrap justify-center lg:justify-between p-2 lg:p-[8px] gap-3 lg:gap-6 font-Inter rounded-[20px]">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(stat.title)}
                            className={`flex-1 min-w-[calc(50%-12px)] sm:min-w-[140px] max-w-xs rounded-xl shadow-md p-4 lg:p-5 transition-transform hover:scale-105 cursor-pointer ${index === 1 || index === 3 ? "bg-[#2D4CCA2B]" : "bg-[#FFF1CF]"
                                }`}
                        >
                            <p className="font-medium text-[14px] leading-[20px] text-gray-700">
                                {stat.title}
                            </p>
                            <div className="flex justify-between items-center mt-3">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {stat.value}
                                </h2>
                                <p className="text-[12px] leading-[16px] font-semibold text-green-600">
                                    {stat.change} {stat.arrow}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            {/* Main Chart Area */}
            <main className="mx-0 lg:mx-6 p-4 lg:p-6 border border-gray-200 rounded-2xl mt-5 bg-white shadow-sm">

                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">
                        {["week", "month", "year"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`
                flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedType === type
                                        ? "bg-white shadow text-blue-600"
                                        : "text-gray-600 hover:bg-white"}
            `}
                            >
                                {/* Small SVG icon */}
                                {type === "week" && (
                                    <svg width="16" height="16" fill="currentColor" className="opacity-80">
                                        <rect x="2" y="2" width="12" height="12" rx="3" />
                                    </svg>
                                )}
                                {type === "month" && (
                                    <svg width="16" height="16" fill="currentColor" className="opacity-80">
                                        <path d="M2 4h12v2H2zM2 9h12v2H2zM2 14h12v2H2z" />
                                    </svg>
                                )}
                                {type === "year" && (
                                    <svg width="16" height="16" fill="currentColor" className="opacity-80">
                                        <circle cx="8" cy="8" r="6" />
                                    </svg>
                                )}

                                {type === "week" ? "Weekly" : type === "month" ? "Monthly" : "Yearly"}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500">
                        {selectedType === 'week' ? 'Weekly' : selectedType === 'month' ? 'Monthly' : 'Yearly'} comparison of user engagement
                    </p>


                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#2D4CCA]"></div>
                            <span className="text-sm font-medium text-gray-600">
                                {selectedType === 'week' ? 'This Week' : selectedType === 'month' ? 'This Month' : 'This Year'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#F8C140]"></div>
                            <span className="text-sm font-medium text-gray-600">
                                {selectedType === 'week' ? 'Last Week' : selectedType === 'month' ? 'Last Month' : 'Last Year'}
                            </span>
                        </div>
                    </div>
                </div>



                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Chart */}
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6B7280"
                                    style={{ fontSize: '14px', fontWeight: '500' }}
                                    label={{
                                        value:
                                            selectedType === "week"
                                                ? "Days of Week"
                                                : selectedType === "month"
                                                    ? "Weeks of Month"
                                                    : "Months of Year",
                                        position: "insideBottom",
                                        offset: -25,
                                        style: { fontSize: "12px", fill: "#6B7280" }
                                    }} />
                                <YAxis
                                    stroke="#6B7280"
                                    style={{ fontSize: '14px' }}
                                    label={{ value: 'Values', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B7280' } }} dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="thisWeek"
                                    stroke="#2D4CCA"
                                    strokeWidth={3}
                                    dot={{ fill: '#2D4CCA', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="This Week"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lastWeek"
                                    stroke="#F8C140"
                                    strokeWidth={3}
                                    dot={{ fill: '#F8C140', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="Last Week"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Side Stats */}
                    <section className="flex flex-col gap-8 w-full lg:w-auto">
                        {/* Weekly Stats */}
                        <div className="lg:pl-8">
                            <h3 className="font-semibold text-lg mb-4 text-gray-800">
                                {selectedType === 'week' ? 'Weekly' : selectedType === 'month' ? 'Monthly' : 'Yearly'} Summary
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="text-sm text-gray-600 mb-1">
                                        {selectedType === 'week' ? 'This Week' : selectedType === 'month' ? 'This Month' : 'This Year'}
                                    </p>
                                    <p className="font-bold text-3xl text-[#2D4CCA]">
                                        +{data.stats?.thisPeriod || 0}%
                                    </p>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                    <p className="text-sm text-gray-600 mb-1">
                                        {selectedType === 'week' ? 'Last Week' : selectedType === 'month' ? 'Last Month' : 'Last Year'}
                                    </p>
                                    <p className="font-bold text-3xl text-[#F8C140]">
                                        +{data.stats?.lastPeriod || 0}%
                                    </p>
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