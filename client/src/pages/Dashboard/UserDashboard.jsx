import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDashboardData } from "../../features/dashboardSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.dashboard);
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('week');

    useEffect(() => {
        dispatch(fetchUserDashboardData());
    }, [dispatch]);

    const handleCardClick = (cardTitle) => {
        if (cardTitle === "Total Rooms") {
            navigate('/rooms');
        } else if (cardTitle === "Rooms Today") {
            navigate('/rooms');
        } else if (cardTitle === "Last 7 Days") {
            navigate('/analytics');
        } else if (cardTitle === "Account Age") {
            navigate('/profile');
        }
    };

    if (loading) {
        return (
            <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 flex items-center justify-center h-screen">
                <div className="spinner"></div>
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
            title: "Total Rooms",
            value: data.stats?.totalRooms || 0
        },
        {
            title: "Rooms Today",
            value: data.stats?.roomsToday || 0
        },
        {
            title: "Last 7 Days",
            value: data.stats?.roomsLast7Days || 0
        },
        {
            title: "Account Age",
            value: `${data.stats?.accountAgeDays || 0} days`
        }
    ];

    // Get chart labels based on screen size and selected type
    const getChartLabels = () => {
        const isSmallScreen = window.innerWidth < 600;

        if (selectedType === 'week') {
            return isSmallScreen
                ? ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }

        if (selectedType === 'month') {
            return isSmallScreen
                ? ['W1', 'W2', 'W3', 'W4']
                : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        }

        // YEARLY
        return isSmallScreen
            ? ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    };

    // Transform data for Recharts with proper labels
    const chartLabels = getChartLabels();

    // Get current day index (0 = Monday, 6 = Sunday)
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday from 0 to 6

    // Create chart data with zeros for all days and actual data for today
    const chartData = chartLabels.map((label, index) => {
        // If it's the current day and we have data, show it
        const isToday = selectedType === 'week' && index === currentDayIndex;
        const roomCount = isToday && data.chartData && data.chartData.length > 0 ? data.chartData[0] : 0;

        return {
            name: label,
            rooms: roomCount,
            lastWeek: 0 // API doesn't provide previous period data yet
        };
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border rounded p-2 shadow">
                    <p className="font-semibold">{payload[0].payload.name}</p>
                    <p className="text-blue-600">Rooms: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    // Calculate period stats
    const calculatePeriodStats = () => {
        const currentTotal = (data.chartData || []).reduce((sum, val) => sum + val, 0);
        return {
            current: currentTotal,
            previous: 0 // API doesn't provide previous period data yet
        };
    };

    const periodStats = calculatePeriodStats();

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
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            {/* Main Chart Area */}
            <main className="mx-0 lg:mx-6 p-4 lg:p-6 border border-gray-200 rounded-2xl mt-5 bg-white shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Room Activity</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {selectedType === 'week' ? 'Weekly' : selectedType === 'month' ? 'Monthly' : 'Yearly'} comparison of room engagement
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
                                    }}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    style={{ fontSize: '14px' }}
                                    label={{
                                        value: 'Rooms Joined',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { fontSize: '12px', fill: '#6B7280' }
                                    }}
                                    dx={-10}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="rooms"
                                    stroke="#2D4CCA"
                                    strokeWidth={3}
                                    dot={{ fill: '#2D4CCA', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="This Period"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lastWeek"
                                    stroke="#F8C140"
                                    strokeWidth={3}
                                    dot={{ fill: '#F8C140', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="Last Period"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Side Stats */}
                    <section className="flex flex-col gap-8 w-full lg:w-auto">
                        {/* Period Stats */}
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
                                        {periodStats.current}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Total Rooms</p>
                                </div>
                                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                    <p className="text-sm text-gray-600 mb-1">
                                        {selectedType === 'week' ? 'Last Week' : selectedType === 'month' ? 'Last Month' : 'Last Year'}
                                    </p>
                                    <p className="font-bold text-3xl text-[#F8C140]">
                                        {periodStats.previous}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Total Rooms</p>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </main>

            {/* Upcoming Events Section */}
            <section className="mx-0 lg:mx-6 p-4 lg:p-6 border border-gray-200 rounded-2xl mt-5 bg-white shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>

                {data.events && data.events.totalUpcomingEvents > 0 ? (
                    <div className="space-y-3">
                        {data.events.upcomingEventsList.map((event) => {
                            const eventDate = new Date(event.date);
                            const formattedDate = eventDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });

                            return (
                                <div
                                    key={event._id}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-800">{event.fullName}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formattedDate}
                                            </span>
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {event.time}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                                            Upcoming
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">No Events Found</h3>
                        <p className="text-sm text-gray-500">You don't have any upcoming events scheduled</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;