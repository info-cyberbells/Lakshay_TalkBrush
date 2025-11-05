import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { requestPasswordReset, verifyResetCode } from "../../features/userSlice.js";

const PasswordResetModal = ({ isOpen, onClose, showToast }) => {
    const dispatch = useDispatch();
    const [resetStep, setResetStep] = useState(1);
    const [resetEmail, setResetEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
    const [resetErrors, setResetErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setResetStep(1);
            setResetEmail("");
            setOtp("");
            setNewPassword("");
            setNewConfirmPassword("");
            setResetErrors({});
            setShowNewPassword(false);
            setShowNewConfirmPassword(false);
        }
    }, [isOpen]);

    const handleVerifyEmail = async (e) => {
        e.preventDefault();

        if (!resetEmail) {
            setResetErrors({ email: true });
            showToast("Please enter your email");
            return;
        }

        try {
            const response = await dispatch(requestPasswordReset(resetEmail)).unwrap();
            showToast(response.message || "OTP sent to your email");
            setResetStep(2);
            setResetErrors({});
        } catch (error) {
            showToast(error || "Email not found");
        }

    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!otp) errors.otp = true;
        if (!newPassword) errors.newPassword = true;
        if (!newConfirmPassword) errors.newConfirmPassword = true;

        if (newPassword !== newConfirmPassword) {
            errors.newConfirmPassword = true;
            showToast("Passwords do not match");
            return;
        }

        if (Object.keys(errors).length > 0) {
            setResetErrors(errors);
            showToast("Please fill all fields");
            return;
        }

        try {
            const response = await dispatch(
                verifyResetCode({ email: resetEmail, code: otp, newPassword })
            ).unwrap();
            showToast(response.message || "Password reset successful!");
            handleClose();
        } catch (error) {
            showToast(error || "Invalid OTP or reset failed");
        }
    };

    const handleClose = () => {
        setResetStep(1);
        setResetEmail("");
        setOtp("");
        setNewPassword("");
        setNewConfirmPassword("");
        setResetErrors({});
        setShowNewPassword(false);
        setShowNewConfirmPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 left-0 right-0 flex items-center justify-center bg-black/70 z-[9999] font-[Poppins]">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-2xl font-[Poppins] font-semibold text-gray-900">
                        {resetStep === 1 ? "Reset Password" : "Verify OTP"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Step 1: Email Verification */}
                {resetStep === 1 && (
                    <form onSubmit={handleVerifyEmail} className="p-6 space-y-5 -mt-[32px]">
                        <p className="text-sm text-gray-600 mb-4">
                            Enter your email address to receive an OTP for password reset
                        </p>

                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => {
                                    setResetEmail(e.target.value);
                                    if (resetErrors.email) {
                                        setResetErrors((prev) => ({ ...prev, email: false }));
                                    }
                                }}
                                onFocus={() =>
                                    setResetErrors((prev) => ({ ...prev, email: false }))
                                }
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-gray-700 font-[Poppins] transition-colors duration-200 ${resetErrors.email
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`}
                            />
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-[Poppins] text-sm font-medium hover:bg-[#2440a8] transition-colors cursor-pointer whitespace-nowrap"
                            >
                                Send OTP
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: OTP and New Password */}
                {resetStep === 2 && (
                    <form onSubmit={handleResetPassword} className="p-6 space-y-5 -mt-[32px]">
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the OTP sent to your email and set a new password
                        </p>

                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                OTP Code *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter 4-digit OTP"
                                value={otp}
                                autoComplete="off"
                                name="otp_code"
                                id="otp_code"
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    if (resetErrors.otp) {
                                        setResetErrors((prev) => ({ ...prev, otp: false }));
                                    }
                                }}
                                onFocus={() =>
                                    setResetErrors((prev) => ({ ...prev, otp: false }))
                                }
                                className={`w-full px-4 py-2 border rounded-lg outline-none text-gray-700 font-[Poppins] transition-colors duration-200 ${resetErrors.otp
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`}
                                maxLength="6"
                            />
                        </div>

                        {/* New Password Input */}
                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                New Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    autoComplete="new-password"
                                    name="new_password_field"
                                    id="new_password_field"
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (resetErrors.newPassword) {
                                            setResetErrors((prev) => ({
                                                ...prev,
                                                newPassword: false,
                                            }));
                                        }
                                    }}
                                    onFocus={() =>
                                        setResetErrors((prev) => ({ ...prev, newPassword: false }))
                                    }
                                    className={`w-full px-4 py-2 border rounded-lg outline-none text-gray-700 font-[Poppins] transition-colors duration-200 ${resetErrors.newPassword
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-[#2D4CCA]"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password Input */}
                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                Confirm New Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={newConfirmPassword}
                                    autoComplete="off"
                                    name="confirm_new_password_field"
                                    id="confirm_new_password_field"
                                    onChange={(e) => {
                                        setNewConfirmPassword(e.target.value);
                                        if (resetErrors.newConfirmPassword) {
                                            setResetErrors((prev) => ({
                                                ...prev,
                                                newConfirmPassword: false,
                                            }));
                                        }
                                    }}
                                    onFocus={() =>
                                        setResetErrors((prev) => ({ ...prev, newConfirmPassword: false }))
                                    }
                                    className={`w-full px-4 py-2 border rounded-lg outline-none text-gray-700 font-[Poppins] transition-colors duration-200 ${resetErrors.newConfirmPassword
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:border-[#2D4CCA]"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewConfirmPassword(!showNewConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    {showNewConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-[Poppins] text-sm font-medium hover:bg-[#2440a8] transition-colors cursor-pointer whitespace-nowrap"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordResetModal;