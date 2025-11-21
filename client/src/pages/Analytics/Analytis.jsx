import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsData, setPeriod } from '../../features/AnalyticsSlice';

const Analytics = () => {
    const dispatch = useDispatch();
    const {
        data,
        totalUsers,
        activeUsers,
        inactiveUsers,
        period,
        loading,
        error
    } = useSelector((state) => state.analytics);

    const [activeTab, setActiveTab] = useState(period);

    // Period mapping for API calls
    const periodMapping = {
        "24 hours": "yesterday",
        "7 days": "week",
        "30 days": "month",
        "12 month": "year"
    };

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchAnalyticsData('week')); // Default to week
    }, [dispatch]);

    // Handle tab change and API call
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const apiPeriod = periodMapping[tab];
        dispatch(setPeriod(apiPeriod));
        dispatch(fetchAnalyticsData(apiPeriod));
    };

    // Transform API data for chart display
    const getChartData = () => {
        if (!data || data.length === 0) {
            return [];
        }

        // Convert API data to chart format
        return data.map((item, index) => ({
            label: item.label,
            values: [
                Math.max(item.count * 0.7, 10), // Main value
                Math.max(item.count * 0.2, 5),  // Secondary
                Math.max(item.count * 0.08, 3), // Tertiary  
                Math.max(item.count * 0.02, 1)  // Minimal
            ]
        }));
    };

    // Calculate active/inactive percentages
    const getActivePercentage = () => {
        if (totalUsers === 0) return 0;
        return Math.round((activeUsers / totalUsers) * 100);
    };

    const getInactivePercentage = () => {
        if (totalUsers === 0) return 0;
        return Math.round((inactiveUsers / totalUsers) * 100);
    };

    const chartData = getChartData();
    const activePercentage = getActivePercentage();
    const inactivePercentage = getInactivePercentage();

    // Color shades for the bars (dark to light blue/purple)
    const colors = [
        "bg-[#4338ca]", // Dark blue
        "bg-[#818cf8]", // Medium blue
        "bg-[#c4b5fd]", // Light purple
        "bg-[#e9d5ff]", // Very light purple
    ];

    return (
        <div className="lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3 px-4 lg:px-0 mt-4">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Conversations Chart Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 lg:ml-4 ml-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Conversations per day/week/month
                    </h2>

                    {/* Time Filter Tabs */}
                    <div className="flex gap-2 mb-8">
                        {["12 month", "30 days", "7 days", "24 hours"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            <span className="ml-2">Loading analytics...</span>
                        </div>
                    )}

                    {/* Bar Chart */}
                    {!loading && chartData.length > 0 && (
                        <div className="space-y-4">
                            {chartData.map((data, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    {/* Month label - hidden on small screens, shown later */}
                                    <div className="w-20 text-xs text-gray-400 text-right hidden md:block">
                                        {data.label}
                                    </div>

                                    {/* Stacked bar */}
                                    <div className="flex-1 flex h-10 rounded-full overflow-hidden bg-gray-100">
                                        {data.values.map((value, idx) => (
                                            <div
                                                key={idx}
                                                className={`${colors[idx]} transition-all duration-300`}
                                                style={{ width: `${Math.min(value, 100)}%` }}
                                                title={`Value: ${value}`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Month labels at bottom for mobile/tablet */}
                            <div className="flex justify-between text-xs text-gray-400 mt-2 md:hidden">
                                {chartData.map((data, index) => (
                                    <span key={index} className="truncate text-center flex-1">
                                        {data.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Data State */}
                    {!loading && chartData.length === 0 && !error && (
                        <div className="text-center text-gray-500 py-8">
                            No data available for the selected period
                        </div>
                    )}
                </div>

                {/* Active vs Inactive User Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Active user vs inactive user ratio
                    </h2>

                    {/* User Stats Summary */}
                    <div className="mb-4 text-sm text-gray-600">
                        Total Users: {totalUsers} | Active: {activeUsers} | Inactive: {inactiveUsers}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Donut Chart */}
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#f3f4f6"
                                    strokeWidth="12"
                                />

                                {/* Active user segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#4338ca"
                                    strokeWidth="12"
                                    strokeDasharray={`${activePercentage * 2.2} 220`}
                                    strokeDashoffset="0"
                                    className="transition-all duration-500"
                                />

                                {/* Inactive user segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#a5b4fc"
                                    strokeWidth="12"
                                    strokeDasharray={`${inactivePercentage * 2.2} 220`}
                                    strokeDashoffset={`-${activePercentage * 2.2}`}
                                    className="transition-all duration-500"
                                />
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#4338ca]"></div>
                                    <span className="text-sm text-gray-700 font-medium">Active</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-auto">
                                    {activePercentage}%
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#a5b4fc]"></div>
                                    <span className="text-sm text-gray-700 font-medium">Inactive</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-auto">
                                    {inactivePercentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;