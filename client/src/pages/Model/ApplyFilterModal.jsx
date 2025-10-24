import React from 'react';

const ApplyFilterModal = ({
    isOpen,
    onClose,
    filterConfig,
    setFilterConfig,
    onApply,
    onReset
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Filter Options</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                        </label>
                        <div className="relative">
                        <select
                            value={filterConfig.sortBy}
                            onChange={(e) => setFilterConfig({ ...filterConfig, sortBy: e.target.value })}
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="fullName">Name</option>
                            <option value="email">Email</option>
                            <option value="phoneNumber">Phone Number</option>
                            <option value="lastLogin">Last Login</option>
                            <option value="createdAt">Date Created</option>
                        </select>

                        {/* downward arrow  */}
                        <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            </div>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort Order
                        </label>
                        <div className="relative">
                        <select
                            value={filterConfig.sortOrder}
                            onChange={(e) => setFilterConfig({ ...filterConfig, sortOrder: e.target.value })}
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="asc">Ascending (A-Z, Old to New)</option>
                            <option value="desc">Descending (Z-A, New to Old)</option>
                        </select>
                        {/* downward arrow  */}
                        <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

                        </div>
                    </div>

                    {/* Items Per Page */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Items Per Page
                        </label>
                        <div className="relative">
                        <select
                            value={filterConfig.limit}
                            onChange={(e) => setFilterConfig({ ...filterConfig, limit: parseInt(e.target.value) })}
                            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>

                        {/* downward arrow  */}
                        <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyFilterModal;