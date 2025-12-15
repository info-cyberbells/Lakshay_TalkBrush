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
        missingLoginUsers,
        period,
        loading,
        error
    } = useSelector((state) => state.analytics);

    const [activeTab, setActiveTab] = useState("7 days");

    // Period mapping for API calls
    const periodMapping = {
        "24 hours": "yesterday",
        "7 days": "week",
        "30 days": "month",
        "12 month": "year"
    };

    // Fetch data on component mount
    useEffect(() => {
        setActiveTab("7 days");
        dispatch(fetchAnalyticsData('week'));
    }, [dispatch]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const apiPeriod = periodMapping[tab];
        dispatch(setPeriod(apiPeriod));
        dispatch(fetchAnalyticsData(apiPeriod));
    };

    const getChartData = () => {
        if (!data || data.length === 0) {
            return [];
        }

        const maxValue = Math.max(...data.map(d => d.count));

        return data.map(item => ({
            label: item.label,
            count: item.count,
            values: [
                (item.count / maxValue) * 100,
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

    const getmissingLoginUsers = () => {
        if (totalUsers === 0) return 0;
        return Math.round((missingLoginUsers / totalUsers) * 100);
    };

    const chartData = getChartData();
    const activePercentage = getActivePercentage();
    const inactivePercentage = getInactivePercentage();
    const findmissingLoginUsers = getmissingLoginUsers();

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
                                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${activeTab === tab
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
                            {/* <div className=" rounded-full h-8 w-8 border-b-2 border-gray-900"></div>  */}

                            <div className="spinner -mt-28"></div>
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
                                    <div className="flex-1 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                                        {data.count > 0 ? (
                                            <div
                                                className="bg-[#4338ca] h-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-300"
                                                style={{ width: `${data.values[0]}%` }}
                                                title={`Rooms created: ${data.count}`}
                                            >
                                                {data.count} {data.count === 1 ? "room" : "rooms"}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
                                                0 rooms
                                            </div>
                                        )}
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
                        User Activity Distribution
                    </h2>


                    {/* User Stats Summary */}
                    <div className="mb-4 text-sm text-gray-600">
                        Total Users: {totalUsers} |
                        Active: {activeUsers} |
                        Inactive: {inactiveUsers} |
                        Never Logged In: {missingLoginUsers}
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

                                {/* ACTIVE segment */}
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

                                {/* INACTIVE segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#818cf8"
                                    strokeWidth="12"
                                    strokeDasharray={`${inactivePercentage * 2.2} 220`}
                                    strokeDashoffset={`-${activePercentage * 2.2}`}
                                    className="transition-all duration-500"
                                />

                                {/* MISSING LOGIN segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#c4b5fd"
                                    strokeWidth="12"
                                    strokeDasharray={`${findmissingLoginUsers * 2.2} 220`}
                                    strokeDashoffset={`-${(activePercentage + inactivePercentage) * 2.2}`}
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
                                    <div className="w-3 h-3 rounded-full bg-[#818cf8]"></div>
                                    <span className="text-sm text-gray-700 font-medium">Inactive</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-auto">
                                    {inactivePercentage}%
                                </span>
                            </div>


                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#c4b5fd]"></div>
                                    <span className="text-sm text-gray-700 font-medium">Never Logged In</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-auto">
                                    {findmissingLoginUsers}%
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