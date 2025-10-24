import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserFormModal from "../Model/UserFormModal";
import FilterModal from "../Model/ApplyFilterModal";
import {
  Trash2,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  X,
} from "lucide-react";
import {
  getAllUsersByTypeThree,
  setPaginationConfig,
  deleteUsers,
  updateUser,
} from "../../features/userSlice";
import DeleteModal from "../Model/DeleteModal";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, isLoading, pagination } = useSelector(
    (state) => state.auth
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [nameSortOrder, setNameSortOrder] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 20,
  });

  const [isDeleteModelOpen, setDeleteModel] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // useEffect(() => {
  //     dispatch(getAllUsersByType());
  //   }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAllUsersByTypeThree({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      })
    );
  }, [dispatch, pagination.currentPage]);

  const handleApplyFilter = () => {
    dispatch(
      setPaginationConfig({
        ...filterConfig,
        currentPage: 1,
      })
    );
    dispatch(
      getAllUsersByTypeThree({
        page: 1,
        limit: filterConfig.limit,
        sortBy: filterConfig.sortBy,
        sortOrder: filterConfig.sortOrder,
      })
    );
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    const defaultConfig = {
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 20,
    };
    setFilterConfig(defaultConfig);
    dispatch(
      setPaginationConfig({
        ...defaultConfig,
        currentPage: 1,
      })
    );
    dispatch(
      getAllUsersByType({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
    setIsFilterOpen(false);
  };

  const [sortConfig, setSortConfig] = useState({
    column: null, // "fullName" or "email"
    order: null, // "asc" or "desc"
  });

  const handleSort = (column) => {
    const newOrder =
      sortConfig.column === column
        ? sortConfig.order === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setSortConfig({ column, order: newOrder });

    dispatch(setPaginationConfig({ currentPage: 1, sortOrder: newOrder }));

    dispatch(
      getAllUsersByTypeThree({
        page: 1,
        limit: filterConfig.limit,
        sortBy: column,
        sortOrder: newOrder,
      })
    );
  };

  // handledelete api call
  const handleDelete = () => {
    if (selectedUsers.length === 0) return;

    dispatch(deleteUsers(selectedUsers))
      .unwrap()
      .then(() => {
        setSelectedUsers([]);
        // Refetch users after deletion
        dispatch(
          getAllUsersByTypeThree({
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: pagination.sortBy,
            sortOrder: pagination.sortOrder,
          })
        );
      })
      .catch((error) => console.error("Delete failed:", error));
  };

  // view details
  const onView = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
    setOpenMenuId(null); // close the dropdown
  };

  // edit details
  const onEdit = (user) => {
    setEditUser(user);
    setIsEditOpen(true);
    setOpenMenuId(null); // close the dropdown
  };

  const handleUpdateUser = (userData) => {
    const { _id, createdAt, updatedAt, ...updateData } = userData;

    dispatch(updateUser({ id: _id, data: updateData }))
      .unwrap()
      .then(() => {
        setIsEditOpen(false);
        // alert("User updated successfully");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        // alert(err || "Failed to update user");
      });
  };

  const handleAddUsers = (data) => {
    console.log("New User:", data);
    // dispatch action here if needed
    setIsModalOpen(false);

    dispatch(
      getAllUsersByTypeThree({
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      })
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === allUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUsers?.map((user) => user._id) || []);
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
            ${allUsers
        .map(
          (user) => `
              <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber || "N/A"}</td>
                <td>${user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "Never"
            }</td>
              </tr>
            `
        )
        .join("")}
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
    link.setAttribute(
      "download",
      `users_${new Date().toISOString().split("T")[0]}.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-60 pr-60">
      <div className="w-full px-10 py-10 pt-10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 mt-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mt-3">
                Manage Users
              </h1>
              <p className="text-sm text-blue-600 mt-1">
                Total users: {allUsers?.length || 0}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={()=>{setDeleteModel(true)}} >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button> */}

              <button
                onClick={() => setDeleteModel(true)}
                disabled={selectedUsers.length === 0} // disable if nothing selected
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${selectedUsers.length > 0
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
                  : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add new User
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Manage all users and their access
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 z-10">
              <div className="spinner"></div>
            </div>
          )}
          <table className="min-w-full w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        allUsers?.length > 0 &&
                        selectedUsers.length === allUsers?.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  {/* <th className="px-6 py-3 text-left w-1/4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700" onClick={()=>{}}>
                      Name
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th> */}

                  <th className="px-6 py-3 text-left w-1/4">
                    <div
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer select-none"
                      onClick={() => handleSort("fullName")}
                    >
                      Name
                      {sortConfig.column === "fullName" ? (
                        sortConfig.order === "asc" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )
                      ) : (
                        <ChevronDown className="opacity-50" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left w-1/4">
                    <div
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortConfig.column === "email" ? (
                        sortConfig.order === "asc" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )
                      ) : (
                        <ChevronDown className="opacity-50" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left w-1/4">
                    <div
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none"
                    // onClick={() => handleSort("createdAt")}
                    >
                      Phone No.
                      {/* {sortConfig.column === "createdAt" ? (
                        sortConfig.order === "asc" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )
                      ) : (
                        <ChevronDown className="opacity-50" />
                      )} */}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left w-1/4">
                    <div
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none"
                    // onClick={() => handleSort("createdAt")}
                    >
                      Last Login
                      {/* {sortConfig.column === "createdAt" ? (
                        sortConfig.order === "asc" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )
                      ) : (
                        <ChevronDown className="opacity-50" />
                      )} */}
                    </div>
                  </th>

                  <th className="px-6 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                        {admin.phoneNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        {/* <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button> */}

                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === admin._id ? null : admin._id
                            )
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors relative"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openMenuId === admin._id && (
                          <div className="absolute right-6 top-8 w-40 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
                            {/* Cross icon to close */}
                            <div className="flex items-center px-3 py-2 justify-between p-1">
                              <span className="text-sm font-semibold text-gray-700">
                                More Options
                              </span>
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                onView(admin);
                                setOpenMenuId(null);
                              }}
                              className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </button>
                            <button
                              onClick={() => {
                                onEdit(admin);
                                setOpenMenuId(null);
                              }}
                              className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {/* Info */}
              <span className="text-sm text-gray-600 mb-3 sm:mb-0">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {(pagination.currentPage - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-800">
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalUsers
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {pagination.totalUsers}
                </span>
              </span>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    dispatch(
                      setPaginationConfig({
                        currentPage: pagination.currentPage - 1,
                      })
                    )
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  ← Previous
                </button>

                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md ">
                  Page {pagination.currentPage} / {pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    dispatch(
                      setPaginationConfig({
                        currentPage: pagination.currentPage + 1,
                      })
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </div>
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
        onSubmit={handleAddUsers}
        type="user"
      />

      {isDeleteModelOpen && (
        <DeleteModal
          onClose={() => setDeleteModel(false)}
          onDelete={handleDelete}
        />
      )}

      {isUserDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-openDropdown">
            {/* Close button */}
            <button
              onClick={() => setIsUserDetailOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                User's Detail
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Information about the selected User
              </p>
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200 mb-4"></div>

            {/* Content */}
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Full Name:</span>
                <span className="text-gray-900">{selectedUser.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Phone:</span>
                <span className="text-gray-900">
                  {selectedUser.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Type:</span>
                <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-blue-600">
                  {selectedUser.type === "2" ? "Admin" : "User"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Created At:</span>
                <span className="text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Updated At:</span>
                <span className="text-gray-900">
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsUserDetailOpen(false)}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}

      {isEditOpen && editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-openDropdown">
            {/* Close button */}
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
              <p className="text-sm text-gray-500 mt-1">
                Update user information below
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editUser); // create this function to dispatch update
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editUser.fullName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, fullName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editUser.phoneNumber || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phoneNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium text-sm">Type:</span>
                <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-blue-600">
                  {editUser.type === "2" ? "Admin" : "User"}
                </span>
              </div>

              {/* Footer buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
