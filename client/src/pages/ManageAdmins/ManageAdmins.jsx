import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserFormModal from "../Model/UserFormModal";
import FilterModal from "../Model/ApplyFilterModal";
import { Trash2, Filter, Download, Plus, MoreVertical, ChevronDown } from 'lucide-react';
import { getAllUsersByType, setPaginationConfig } from '../../features/userSlice';

const ManageAdmins = () => {
  const dispatch = useDispatch();
  const { allUsers, isLoading, pagination } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 20
  });


  useEffect(() => {
    dispatch(getAllUsersByType());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllUsersByType({
      page: pagination.currentPage,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder
    }));
  }, [dispatch, pagination.currentPage]);

  const handleApplyFilter = () => {
    dispatch(setPaginationConfig({
      ...filterConfig,
      currentPage: 1
    }));
    dispatch(getAllUsersByType({
      page: 1,
      limit: filterConfig.limit,
      sortBy: filterConfig.sortBy,
      sortOrder: filterConfig.sortOrder
    }));
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    const defaultConfig = {
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 20
    };
    setFilterConfig(defaultConfig);
    dispatch(setPaginationConfig({
      ...defaultConfig,
      currentPage: 1
    }));
    dispatch(getAllUsersByType({
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }));
    setIsFilterOpen(false);
  };
  const handleAddAdmin = (data) => {
    console.log("New Admin:", data);
    // dispatch action here if needed
    setIsModalOpen(false);
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins(prev =>
      prev.includes(adminId)
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAdmins.length === allUsers?.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(allUsers?.map(admin => admin._id) || []);
    }
  };

  const handleExport = () => {
    if (!allUsers || allUsers.length === 0) {
      alert("No data to export");
      return;
    }

    // Create Excel-compatible HTML table
    const tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>Users</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            ${allUsers.map(user => `
              <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber || 'N/A'}</td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

    // Create and download file
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `admins_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-60 pr-60">
      <div className="w-full px-10 py-10 pt-20">

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 mt-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mt-3">Manage Admins</h1>
              <p className="text-sm text-blue-600 mt-1">Total Admins: {allUsers?.length || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setIsFilterOpen(true)}>
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add new Admin
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Manage all admin and their access</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={allUsers?.length > 0 && selectedAdmins.length === allUsers?.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left w-1/4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Name
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left w-1/4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Email
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left w-1/4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Phone Number
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left w-1/4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Last Login
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(admin._id)}
                          onChange={() => handleSelectAdmin(admin._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {admin.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
                  <span className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch(setPaginationConfig({ currentPage: pagination.currentPage - 1 }));
                      }}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => {
                        dispatch(setPaginationConfig({ currentPage: pagination.currentPage + 1 }));
                      }}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </table>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterConfig={filterConfig}
        setFilterConfig={setFilterConfig}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />


      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAdmin}
      />
    </div>

  );
};

export default ManageAdmins;