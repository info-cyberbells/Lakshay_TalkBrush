import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserFormModal from "../Model/UserFormModal";
import { Trash2, Filter, Download, Plus, MoreVertical, ChevronDown } from 'lucide-react';
import { getAllUsersByTypeThree } from '../../features/userSlice';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { allUsers, isLoading } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        dispatch(getAllUsersByTypeThree());
    }, [dispatch]);


    const handleAddUsers = (data) => {
        console.log("New User:", data);
        // dispatch action here if needed
        setIsModalOpen(false);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === allUsers?.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(allUsers?.map(user => user._id) || []);
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
        link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.xls`);
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
                            <h1 className="text-2xl font-semibold text-gray-900 mt-3">Manage Users</h1>
                            <p className="text-sm text-blue-600 mt-1">Total users: {allUsers?.length || 0}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleExport}>
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                <Plus className="w-4 h-4" />
                                Add new User
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">Manage all users and their access</p>
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
                                            checked={allUsers?.length > 0 && selectedUsers.length === allUsers?.length}
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
                                                    checked={selectedUsers.includes(admin._id)}
                                                    onChange={() => handleSelectUser(admin._id)}
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
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddUsers}
            />
        </div>
    );
};

export default ManageUsers;