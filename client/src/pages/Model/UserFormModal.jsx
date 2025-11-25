import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { signUp, updateUser } from "../../features/userSlice";
import { showToast } from "../../features/toastSlice";

const UserFormModal = ({ isOpen, onClose, onSubmit, type, userData = null }) => {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const isEditMode = !!userData;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


const validateForm = () => {
  const newErrors = {};

  const trimmedName = formData.fullName.trim();
  const trimmedEmail = formData.email.trim();
  const trimmedPhone = formData.phoneNumber.trim();
  const password = formData.password || "";
  const confirmPassword = formData.confirmPassword || "";

  if (!trimmedName) newErrors.fullName = "Full name is required";
  if (!trimmedEmail) newErrors.email = "Email is required";
  if (!trimmedPhone) newErrors.phoneNumber = "Phone number is required";


  if (!isEditMode) {
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
  }

  // If any required field missing → stop here
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);

    dispatch(
      showToast({
        message: "All fields are required!",
        type: "error",
      })
    );
    return false;
  }

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d+$/;

 
  if (!nameRegex.test(trimmedName)) {
    newErrors.fullName = "Name must contain only letters";
    dispatch(showToast({ message: newErrors.fullName, type: "error" }));
    setErrors(newErrors);
    return false;
  }

  
  if (!emailRegex.test(trimmedEmail)) {
    newErrors.email = "Invalid email format";
    dispatch(showToast({ message: newErrors.email, type: "error" }));
    setErrors(newErrors);
    return false;
  }

  if (trimmedEmail.length > 40) {
    newErrors.email = "Email must not exceed 40 characters";
    dispatch(showToast({ message: newErrors.email, type: "error" }));
    setErrors(newErrors);
    return false;
  }

  // Phone regex (only add mode)
  if (!phoneRegex.test(trimmedPhone)) {
    newErrors.phoneNumber = "Invalid phone number";
    dispatch(showToast({ message: newErrors.phoneNumber, type: "error" }));
    setErrors(newErrors);
    return false;
  }

  if (!isEditMode) {
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      dispatch(showToast({ message: newErrors.password, type: "error" }));
      setErrors(newErrors);
      return false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      dispatch(showToast({ message: newErrors.confirmPassword, type: "error" }));
      setErrors(newErrors);
      return false;
    }
  }


  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { fullName, email, phoneNumber, password, confirmPassword } = formData;

    try {
      if (isEditMode) {
        const updateData = {
          fullName,
          email,
          phoneNumber,
        };

        if (password.trim()) {
          updateData.password = password;
        }

        const result = await dispatch(
          updateUser({ id: userData._id, data: updateData })
        );

        if (updateUser.fulfilled.match(result)) {
          dispatch(
            showToast({
              message: `${type === "admin" ? "Admin" : "User"} "${fullName}" updated successfully.`,
              type: "success",
            })
          );
          setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          });
          onSubmit();
          onClose();
        } else {
          const errorMsg = result.payload?.message || "Failed to update";
          dispatch(showToast({ message: errorMsg, type: "error" }));
        }
      } else {
        const userType = type === "admin" ? "2" : "3";

        const result = await dispatch(
          signUp({
            fullName,
            phoneNumber,
            email,
            type: userType,
            password,
            confirmPassword,
          })
        );

        if (signUp.fulfilled.match(result)) {
          dispatch(
            showToast({
              message: `${type === "admin" ? "Admin" : "User"} "${fullName || "New User"}" added successfully.`,
              type: "success",
            })
          );
          setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          });
          onSubmit();
          onClose();
        } else {
          const errorMsg = result.payload?.message || "Failed to Add";
          dispatch(showToast({ message: errorMsg, type: "error" }));
          console.log(errorMsg);
        }
      }
    } catch (error) {
      console.error("Form Submit Error:", error);
      dispatch(showToast({ message: "Something went wrong", type: "error" }));
    }
  };

  const isManageUsersPage = window.location.pathname.includes("manage-users");

  const headingText = isEditMode
    ? (isManageUsersPage ? "Edit User" : "Edit Admin")
    : (isManageUsersPage ? "Add New User" : "Add New Admin");

  const buttonText = isEditMode
    ? "Update"
    : (isManageUsersPage ? "Add User" : "Add Admin");
  return (
    <>
      <div className="fixed inset-0 left-0 right-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-[9999]">
        {/* <div className="bg-white w-[480px] rounded-xl shadow-2xl p-8 relative"> */}
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] hide-scrollbar overflow-y-auto">
          {/* <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button> */}

          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {headingText}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 -mt-[32px]"
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                // required
                className={`w-full px-4 py-2.5 border ${errors.fullName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {/* {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )} */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter email address"
                maxLength={30}
                value={formData.email}
                onChange={handleChange}
                // required
                autoComplete="new-password"
                data-lpignore="true"
                className={`w-full px-4 py-2.5 border ${errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {/* {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )} */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                maxLength={15}
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {/* {errors.phoneNumber} */}
                </p>
              )}
            </div>

            {!isEditMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                      value={formData.password}
                      onChange={handleChange}
                      // required
                      autoComplete="new-password"
                      data-lpignore="true"
                      className={`w-full px-4 py-2.5 border ${errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {/* {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )} */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder={isEditMode ? "Confirm new password" : "Re-enter password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      // required
                      className={`w-full px-4 py-2.5 border ${errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {/* {errors.confirmPassword} */}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-[Poppins] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2  bg-blue-600 rounded-lg hover:bg-blue-700 text-white rounded-md font-[Poppins] text-sm font-medium hover:bg-[#2440a8] transition-colors cursor-pointer whitespace-nowrap"
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;
