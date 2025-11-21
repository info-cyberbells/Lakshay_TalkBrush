import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile, changePassword } from "../../features/userSlice";
import { User, Mail, Phone, Calendar, Shield, Pencil } from "lucide-react";
import { showToast } from "../../features/toastSlice";
import ChnagePasswordModal from "../Model/ChangePasswordModal.jsx";


const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    const hasChanges = Object.keys(formData).some(
      (key) => updatedData[key]?.trim?.() !== user[key]?.trim?.()
    );
    setIsChanged(hasChanges);
  };

  const handleChangePassword = () => {
    setIsModalOpen(true);
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      dispatch(showToast({
        message: "Image must be less than 5 MB!",
        type: "error"
      }));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        setFormData((prev) => ({ ...prev, image: compressedBase64 }));

        dispatch(updateProfile({ image: compressedBase64 }))
          .unwrap()
          .then(() => {
            dispatch(showToast({ message: "Profile photo updated!", type: "success" }));
            dispatch(fetchProfile());
          })
          .catch(() => {
            dispatch(showToast({ message: "Failed to update photo.", type: "error" }));
          });
      };
    };

    reader.readAsDataURL(file);
  };



  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      dispatch(showToast({ message: "Password changed successfully!", type: "success" }));
      setIsModalOpen(false);
    } catch (error) {
      dispatch(showToast({ message: error || "Failed to change password!", type: "error" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChanged) {
      dispatch(showToast({ message: "No changes detected!", type: "info" }));
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      dispatch(
        showToast({
          message: "Profile updated successfully!",
          type: "success",
        })
      );
      await dispatch(fetchProfile());
      setIsChanged(false);
    } catch (error) {
      console.error("Update failed");
      dispatch(
        showToast({ message: "Failed to update profile.", type: "error" })
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserType = (type) => {
    const types = {
      1: "SuperAdmin",
      2: "Admin",
      3: "User",
    };
    return types[type] || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8 lg:px-[230px] md:px-16 md:w-full  xl:px-[240px] pt-[40px] sm:w-full sm:mr-0 md:w-full xl:min-w-[320px]">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <header className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-semibold text-gray-900">
              Manage Profile
            </h1>
          </div>
          <div>
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Change Password
            </button>
          </div>
        </header>

        {/* <div className="grid grid-cols-1 container 2xl:px-25 lg:grid-cols-3 gap-6"> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 container 2xl:px-25 gap-6 mx-auto">
          {/* Profile Card */}
          <div className="lg:col-span-1 lg:min-w-[200px] min-w-[260px] ">
            <div className="bg-white rounded-lg shadow p-6 lg:min-h-[433px]">
              <div className="flex flex-col items-center">

                <div className="relative w-24 h-24 mb-4">

                  <img
                    src={formData?.image || user?.image || "/default-profile.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow"
                  />

                  {/* EDIT ICON */}
                  <label
                    htmlFor="profileInput"
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer shadow"
                  >
                    <Pencil className="w-4 h-4" />
                  </label>

                  <input
                    id="profileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                </div>

                {/* NAME */}
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.fullName || "User"}
                </h2>

                {/* EMAIL */}
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>

                {/* USER TYPE */}
                <div className="mt-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {getUserType(user?.type)}
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Joined</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Last Login</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(user?.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Profile
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    onChange={handleChange}
                    className={`
    w-full px-4 py-3 border rounded-lg focus:outline-none
    ${true
                        ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500"}
  `}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isChanged || isLoading}
                    className={`flex-1 py-3 font-medium rounded-lg transition  
                        ${isChanged
                        ? "bg-blue-600 cursor-pointer text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChnagePasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Profile;
