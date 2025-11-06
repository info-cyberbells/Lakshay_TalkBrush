import React, { useState } from "react";

const Analytics = () => {
    const [activeTab, setActiveTab] = useState("12 month");

    // Sample data for the bar chart
    const barData = [
        { month: "Jan", values: [85, 15, 10, 5] },
        { month: "Feb", values: [50, 20, 15, 15] },
        { month: "Mar", values: [40, 25, 20, 8] },
        { month: "Apr", values: [55, 20, 18, 12] },
        { month: "May", values: [45, 25, 18, 15] },
    ];

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

                {/* Conversations Chart Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Conversations per day/week/month
                    </h2>

                    {/* Time Filter Tabs */}
                    <div className="flex gap-2 mb-8">
                        {["12 month", "30 days", "7 days", "24 hours"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Bar Chart */}
                    <div className="space-y-4">
                        {barData.map((data, index) => (
                            <div key={index} className="flex items-center gap-4">
                                {/* Month label - hidden on small screens, shown later */}
                                <div className="w-8 text-xs text-gray-400 text-right hidden md:block">
                                    {data.month}
                                </div>

                                {/* Stacked bar */}
                                <div className="flex-1 flex h-10 rounded-full overflow-hidden bg-gray-100">
                                    {data.values.map((value, idx) => (
                                        <div
                                            key={idx}
                                            className={`${colors[idx]} transition-all duration-300`}
                                            style={{ width: `${value}%` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Month labels at bottom for mobile/tablet */}
                        <div className="flex justify-between text-xs text-gray-400 mt-2 md:hidden">
                            {barData.map((data, index) => (
                                <span key={index}>{data.month}</span>
                            ))}
                        </div>

                        {/* Desktop month labels */}
                        <div className="hidden md:flex justify-around text-xs text-gray-400 mt-2 pl-12">
                            {barData.map((data, index) => (
                                <span key={index} className="flex-1 text-center">
                                    {data.month}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active vs Inactive User Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Active user vs inactive user ratio
                    </h2>

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

                                {/* Active user segment (46%) - Dark blue */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#4338ca"
                                    strokeWidth="12"
                                    strokeDasharray="160 220"
                                    strokeDashoffset="0"
                                    className="transition-all duration-500"
                                />

                                {/* Inactive user segment (24%) - Light blue */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="#a5b4fc"
                                    strokeWidth="12"
                                    strokeDasharray="53 220"
                                    strokeDashoffset="-160"
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
                                <span className="text-sm font-semibold text-gray-900 ml-auto">46%</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#a5b4fc]"></div>
                                    <span className="text-sm text-gray-700 font-medium">Inactive</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-auto">24%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;