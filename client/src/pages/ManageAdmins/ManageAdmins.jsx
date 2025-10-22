import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Filter, Download, Plus, MoreVertical, ChevronDown } from 'lucide-react';
import { getAllUsersByType } from '../../features/userSlice';

const ManageAdmins = () => {
  const dispatch = useDispatch();
  const { allUsers, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsersByType());
  }, [dispatch]);

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
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add new Admin
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">Manage all admin users and their access</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
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
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;