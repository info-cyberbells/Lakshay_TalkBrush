import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";
import { Eye, EyeOff } from "lucide-react";


const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowPassword({
                current: false,
                new: false,
                confirm: false,
            });
        }
    }, [isOpen]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = formData;

        let newErrors = {};

        if (!currentPassword) newErrors.currentPassword = true;
        if (!newPassword) newErrors.newPassword = true;
        if (!confirmPassword) newErrors.confirmPassword = true;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.newPassword = true;
            newErrors.confirmPassword = true;
            dispatch(showToast({ message: "New passwords do not match!", type: "error" }));
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            dispatch(showToast({ message: "Please fix highlighted fields!", type: "error" }));
            return;
        }

        setErrors({});


        try {
            const response = await onSubmit({
                currentPassword,
                newPassword,
            });


            if (response?.status === true) {
                dispatch(showToast({ message: "Password changed successfully!", type: "success" }));

                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                onClose();
            }

        } catch (error) {
            dispatch(showToast({ message: error.message || "Something went wrong", type: "error" }));
        }
    };


    const handleClose = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setShowPassword({
            current: false,
            new: false,
            confirm: false,
        });

        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 left-0 right-0 flex items-center justify-center bg-black/70 z-[9999] font-[Poppins]">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-2xl font-[Poppins] font-semibold text-gray-900">
                        Change Password
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 -mt-[32px]">
                    <div>
                        <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                            Current Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.current ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                onFocus={() =>
                                    setErrors((prev) => ({ ...prev, currentPassword: false }))
                                }
                                className={`w-full px-4 py-2 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.currentPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => ({ ...prev, current: !prev.current }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword.current ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>


                    </div>

                    <div>
                        <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                            New Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                onFocus={() =>
                                    setErrors((prev) => ({ ...prev, newPassword: false }))
                                }
                                className={`w-full px-4 py-2 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.newPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword.new ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                    </div>


                    <div>
                        <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                            Confirm New Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onFocus={() =>
                                    setErrors((prev) => ({ ...prev, confirmPassword: false }))
                                }
                                className={`w-full px-4 py-2 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.confirmPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                    </div>


                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-[Poppins] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2  bg-blue-600 rounded-lg hover:bg-blue-700 text-white rounded-md font-[Poppins] text-sm font-medium hover:bg-[#2440a8] transition-colors cursor-pointer whitespace-nowrap"
                        >
                            Change Password
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
