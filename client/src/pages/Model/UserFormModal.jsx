import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { signUp } from "../../features/userSlice";

const UserFormModal = ({ isOpen, onClose, onSubmit, type }) => {
    if (!isOpen) return null;

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [ AddErrors, setAddErrors] = useState({})
    const [toastMsg, setToastMsg] = useState('');



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const { fullName, email, phoneNumber, password, confirmPassword } = formData;

            //   const newErrors = {};
            //   if (!fullName) newErrors.fullName = true;
            //   if (!phoneNumber) newErrors.phoneNumber = true;
            //   if (!email) newErrors.email = true;
            //   if (!password) newErrors.password = true;
            //   if (!confirmPassword) newErrors.confirmPassword = true;
        
            //   if (password !== confirmPassword) {
            //     newErrors.confirmPassword = true;
            //   }
        
            //   if (Object.keys(newErrors).length > 0) {
            //     setAddErrors(newErrors);
            //     showToast('Please fill in all fields');
            //     return;
            //   }

            //   setAddErrors({});

            try {
                const userType = type === "admin" ? "2" : "3";

                const result = await dispatch(signUp({ fullName, phoneNumber, email, type : userType, password, confirmPassword}));
                if (signUp.fulfilled.match(result)) {
                    // showToast("SignUp successful!");
                    setFormData({
                        fullName: "",
                        email: "",
                        phoneNumber: "",
                        password: "",
                        confirmPassword: "",
                    });
                    onClose();
                } else {
                    // showToast(result.payload || "Failed to Add");
                    console.log(result.payload || "Failed to Add")
                }              
            } catch (error) {
                console.error(error);
                // showToast('Something wents wrong!!!');
            }  
            
        onSubmit(formData);
    };

    const isManageUsersPage = window.location.pathname.includes("manage-users");

    const headingText = isManageUsersPage ? "Add New User" : "Add New Admin";
    const buttonText = isManageUsersPage ? "Add User" : "Add Admin";

    return (
        <>
    
        <div className="fixed inset-0 left-0 right-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-[9999]">
            <div className="bg-white w-[480px] rounded-xl shadow-2xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {headingText}
                </h2>


                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
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
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            data-lpignore="true"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                data-lpignore="true"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer"
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
