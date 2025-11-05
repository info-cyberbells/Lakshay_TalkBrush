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
  ChevronUp, Eye, Edit, X,
} from "lucide-react";
import {
  getAllUsersByType,
  setPaginationConfigType2,
  deleteUsers,
  updateUser
} from "../../features/userSlice";
import DeleteModal from "../Model/DeleteModal";
import { showToast } from "../../features/toastSlice";


const ManageAdmins = () => {
  const dispatch = useDispatch();
  const { allUsers, isLoading, paginationType2 } = useSelector(
    (state) => state.auth
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 20,
  });

  const [isDeleteModelOpen, setDeleteModel] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(
      getAllUsersByType({
        page: paginationType2.currentPage,
        limit: paginationType2.limit,
        sortBy: paginationType2.sortBy,
        sortOrder: paginationType2.sortOrder,
      })
    );
  }, [dispatch, paginationType2.currentPage]);

  const handleApplyFilter = () => {
    dispatch(
      setPaginationConfigType2({
        ...filterConfig,
        currentPage: 1,
      })
    );
    dispatch(
      getAllUsersByType({
        page: 1,
        limit: filterConfig.limit,
        sortBy: filterConfig.sortBy,
        sortOrder: filterConfig.sortOrder,
      })
    );
    //  dispatch(
    //    showToast({
    //      message: `Filter applied: Sorted by "${filterConfig.sortBy}", Limit: ${filterConfig.limit}`,
    //      type: "info",
    //    })
    // );

    dispatch(
      showToast({
        message: "Filter applied Successfully",
        type: "info",
      })
    );

    setIsFilterOpen(false);
  };


  const [sortConfig, setSortConfig] = useState({
    column: null,
    order: null,
  });

  const handleSort = (column) => {
    const newOrder =
      sortConfig.column === column
        ? sortConfig.order === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setSortConfig({ column, order: newOrder });

    dispatch(setPaginationConfigType2({ currentPage: 1, sortOrder: newOrder }));

    dispatch(
      getAllUsersByType({
        page: 1,
        limit: filterConfig.limit,
        sortBy: column,
        sortOrder: newOrder,
      })
    );
  };

  const handleResetFilter = () => {
    const defaultConfig = {
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 20,
    };
    setFilterConfig(defaultConfig);
    dispatch(
      setPaginationConfigType2({
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
    dispatch(showToast({ message: "Filter Reset." }));
    setIsFilterOpen(false);
  };

  const handleAddAdmin = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    dispatch(
      getAllUsersByType({
        page: paginationType2.currentPage,
        limit: paginationType2.limit,
        sortBy: paginationType2.sortBy,
        sortOrder: paginationType2.sortOrder,
      })
    );
  };

  const handleSelectAdmin = (adminId) => {
    setSelectedAdmins((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAdmins.length === allUsers?.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(allUsers?.map((admin) => admin._id) || []);
    }
  };

  const handleDelete = () => {
    if (selectedAdmins.length === 0) return;

    dispatch(deleteUsers(selectedAdmins))
      .unwrap()
      .then(() => {
        setSelectedAdmins([]);
        dispatch(
          getAllUsersByType({
            page: paginationType2.currentPage,
            limit: paginationType2.limit,
            sortBy: paginationType2.sortBy,
            sortOrder: paginationType2.sortOrder,
          })
        );
        dispatch(
          showToast({
            message: `${selectedAdmins.length} admin${selectedAdmins.length > 1 ? "s" : ""} deleted successfully.`,
            type: "success",
          })
        );
      })
      .catch((error) => {
        console.error("Delete Failed", error);
        dispatch(showToast({ message: "Failed to delete!!!", type: 'error' }))
      })

  };

  const handleExport = () => {
    if (!allUsers || allUsers.length === 0) {
      alert("No data to export");
      return;
    }

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

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `admins_${new Date().toISOString().split("T")[0]}.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* <div className="min-h-screen bg-gray-50 ml-60 pr-60"> */}
      <div className="min-h-screen bg-gray-50 lg:ml-60 lg:pr-60 ml-0 pr-0">
        <div className="w-full px-5 md:px-10 md:py-10 pt-10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 mt-5">
              <div>
                <h1 className="text-sm md:text-2xl font-semibold text-gray-900 mt-3">
                  Manage Admins
                </h1>
                <p className="text-xs md:text-sm text-blue-600 mt-1">
                  Total Admins: {paginationType2.totalUsers}
                  {/* {allUsers?.length || 0} */}
                </p>
              </div>
              <div className="grid grid-cols-2 text-sm lg:text-base md:flex items-center gap-1 md:gap-3">
                <button
                  onClick={() => setDeleteModel(true)}
                  disabled={selectedAdmins.length === 0}
                  className={`flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 rounded-lg transition-colors border ${selectedAdmins.length > 0
                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
                    : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>

                <button
                  className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button
                  className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add <p className="hidden md:inline">New Admin</p>
                </button>
              </div>
            </div>
            <p className="text-sm hidden md:inline text-gray-600">
              Manage all admin and their access
            </p>
          </div>

          {/* <div className="bg-white rounded-lg shadow overflow-hidden w-full relative"> */}
          <div className="bg-white rounded-lg shadow overflow-hidden w-full relative">

            {isLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 z-10">
                <div className="spinner"></div>
              </div>
            )}
            {/* <table className="min-w-full w-full table-fixed"> */}
            <table className="min-w-full w-full md:table-fixed sm:scroll-auto " >
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-1 md:px-6 md:py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        allUsers?.length > 0 &&
                        selectedAdmins.length === allUsers?.length
                      }
                      onChange={handleSelectAll}
                      className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-1 md:px-6 md:py-3 text-left w-1/4">
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

                  {/* <th className="px-3 py-1 md:px-6 md:py-3 text-left w-1/4"> */}
                  <th className="px-6 py-3 text-left w-[35%] sm:w-[30%]">
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

                  {/* <th className="px-6 py-3 text-left w-1/4"> */}
                  <th className="px-6 py-3 text-left w-1/4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none">
                      Phone No.
                    </div>
                  </th>

                  {/* <th className="px-6 py-3 text-left w-1/4"> */}
                  <th className="px-6 py-3 text-left w-1/4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 select-none">
                      Last Login
                    </div>
                  </th>

                  <th className="px-3 py-1 md:px-6 md:py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-1 md:px-6 md:py-4">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(admin._id)}
                          onChange={() => handleSelectAdmin(admin._id)}
                          // className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          className="w-2 h-2 lg:w-4 lg:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td
                        className="px-2 py-1 md:px-6 md:py-4 text-sm font-medium  md:font-semibold text-gray-900"
                      >
                        {admin.fullName}
                      </td>
                      <td
                        // className="px-6 py-4 text-sm text-gray-600"
                        className="px-2 py-1 md:px-6 md:py-4 text-sm text-gray-600"
                      >
                        {admin.email}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-600"> */}
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {admin.phoneNumber || "N/A"}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-600"> */}
                      <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      {/* <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td> */}

                      <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-4 text-right relative">
                        <button
                          onClick={() => {
                            setEditingUser(admin);
                            setIsModalOpen(true);
                          }}
                          className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical className="w-3 h-3 md:w-5 md:h-5" />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {paginationType2 && paginationType2.totalPages >= 1 && (
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <span className="text-sm text-gray-600 mb-3 sm:mb-0">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {(paginationType2.currentPage - 1) * paginationType2.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.min(
                      paginationType2.currentPage * paginationType2.limit,
                      paginationType2.totalUsers
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {paginationType2.totalUsers}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(
                        setPaginationConfigType2({
                          currentPage: paginationType2.currentPage - 1,
                        })
                      )
                    }
                    disabled={paginationType2.currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                  >
                    ← Previous
                  </button>

                  <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md ">
                    Page {paginationType2.currentPage} / {paginationType2.totalPages}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        setPaginationConfigType2({
                          currentPage: paginationType2.currentPage + 1,
                        })
                      )
                    }
                    disabled={paginationType2.currentPage === paginationType2.totalPages}
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
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleAddAdmin}
          type="admin"
          userData={editingUser}
        />

        {isDeleteModelOpen && (
          <DeleteModal
            onClose={() => setDeleteModel(false)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default ManageAdmins;