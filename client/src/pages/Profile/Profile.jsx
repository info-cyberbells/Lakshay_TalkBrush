import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../features/userSlice";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";
import { showToast } from "../../features/toastSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [isChanged, setIsChanged] = useState(false);

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
    // setFormData({
    //     ...formData,
    //     [e.target.name]: e.target.value
    // });
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    // Compare current formData with original user data
    const hasChanges = Object.keys(formData).some(
      (key) => updatedData[key]?.trim?.() !== user[key]?.trim?.()
    );
    setIsChanged(hasChanges);
  };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     // await dispatch(updateProfile(formData));
  //      try {
  //         await dispatch(updateProfile(formData)).unwrap();
  //         dispatch(showToast({ message: "✅ Profile updated successfully!", type: "success" }));
  //         dispatch(fetchProfile());
  //     } catch (error) {
  //         dispatch(showToast({ message: "❌ Failed to update profile!", type: "error" }));
  //     }
  // };

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
          message: "✅ Profile updated successfully!",
          type: "success",
        })
      );
      await dispatch(fetchProfile());
      setIsChanged(false);
    } catch (error) {
      console.error("Update failed");
      dispatch(
        showToast({ message: "❌ Failed to update profile.", type: "error" })
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
    // <div className="min-h-screen bg-gray-50 py-8 pl-[240px] pr-[240px] pt-[40px]">
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[240px] pt-[40px] min-w-[320px]">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <header className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Profile</h1>
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 min-w-[260px] ">
            <div className="bg-white rounded-lg shadow p-6 lg:min-h-[433px]">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.fullName || "User"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
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
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* {isError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                        <p className="text-red-700 text-sm font-medium">{message}</p>
                                    </div>
                                )}

                                {isSuccess && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                        <p className="text-green-700 text-sm font-medium">Profile updated successfully!</p>
                                    </div>
                                )} */}

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
    </div>
  );
};

export default Profile;
