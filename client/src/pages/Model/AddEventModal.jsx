import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";

const AddEventModal = ({ isOpen, onClose, onSubmit, editingEvent }) => {

    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: '',
        description: '',
        date: '',
        time: '',
        pictures: []
    });

    useEffect(() => {
        if (editingEvent) {
            setFormData({
                fullName: editingEvent.fullName || '',
                description: editingEvent.description || '',
                date: editingEvent.date ? editingEvent.date.split('T')[0] : '',
                time: editingEvent.time || '',
                pictures: editingEvent.pictures || []
            });
        } else {
            setFormData({
                fullName: '',
                description: '',
                date: '',
                time: '',
                pictures: []
            });
        }
        setErrors({});
    }, [editingEvent, isOpen]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        setErrors((prev) => {
            if (!prev[name]) return prev;
            return { ...prev, [name]: false };
        });

        if (name === "pictures" && files && files.length > 0) {
            const fileArray = Array.from(files);

            if (formData.pictures.length + fileArray.length > 10) {
                dispatch(showToast({
                    message: "You can upload a maximum of 10 images.",
                    type: "error"
                }));
                return;
            }

            const processImages = fileArray.map(file => {
                return new Promise((resolve) => {
                    if (file.size > 5 * 1024 * 1024) {
                        dispatch(showToast({
                            message: `File ${file.name} is too large. Maximum 5MB allowed.`,
                            type: "error"
                        }));
                        return resolve(null);
                    }

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                        let { width, height } = img;

                        if (width > 1024) {
                            height = (height * 1024) / width;
                            width = 1024;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                        resolve(compressedBase64);
                    };

                    img.src = URL.createObjectURL(file);
                });
            });

            Promise.all(processImages).then(results => {
                const validResults = results.filter(result => result !== null);
                setFormData(prev => ({
                    ...prev,
                    pictures: [...prev.pictures, ...validResults]
                }));
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const picturesChanged = () => {
        if (!editingEvent) return true;

        const original = editingEvent.pictures || [];
        const current = formData.pictures || [];

        if (original.length !== current.length) return true;

        for (let i = 0; i < original.length; i++) {
            if (original[i] !== current[i]) return true;
        }

        return false;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = true;
        if (!formData.description) newErrors.description = true;
        if (!formData.date) newErrors.date = true;
        if (!formData.time) newErrors.time = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            dispatch(showToast({
                message: "Please fill all required * fields!",
                type: "error"
            }));
            return;
        }

        if (!editingEvent) {
            onSubmit(formData);

            dispatch(showToast({
                message: "Event Added Successfully!!!",
                type: "success"
            }));

            setFormData({
                fullName: "",
                description: "",
                date: "",
                time: "",
                pictures: [],
            });

            return;
        }

        const updatedFields = {};

        if (editingEvent.fullName !== formData.fullName)
            updatedFields.fullName = formData.fullName;

        if (editingEvent.description !== formData.description)
            updatedFields.description = formData.description;

        if (editingEvent.date.split("T")[0] !== formData.date)
            updatedFields.date = formData.date;

        if (editingEvent.time !== formData.time)
            updatedFields.time = formData.time;

        // pictures (only when changed)
        if (picturesChanged()) {
            updatedFields.pictures = formData.pictures;
        }

        if (Object.keys(updatedFields).length === 0) {
            dispatch(showToast({ message: "No changes detected!", type: "info" }));
            return;
        }

        onSubmit(updatedFields);

        dispatch(showToast({
            message: "Event Updated successfully!!",
            type: "success"
        }));

        setErrors({});
    };



    const handleClose = () => {
        setFormData({
            fullName: '',
            description: '',
            date: '',
            time: '',
            picture: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 left-0 right-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-[9999] ">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-2xl font-[Poppins] font-semibold text-gray-900">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
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
                            Event Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            // required
                            className={`w-full px-4 py-3 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.fullName
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-[#2D4CCA]"
                                }`}
                            placeholder="Enter event name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            // required
                            rows="4"
                            className={`w-full px-4 py-3 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.description
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-[#2D4CCA]"
                                }`}
                            placeholder="Enter event description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                // required
                                className={`w-full px-4 py-3 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.date
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`} />
                        </div>

                        <div>
                            <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                                Time *
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                // required
                                className={`w-full px-4 py-3 border rounded-lg outline-none font-[Poppins] transition-colors duration-200 ${errors.time
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:border-[#2D4CCA]"
                                    }`} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-[Poppins] font-medium text-gray-700 mb-2">
                            Picture (Optional)
                        </label>
                        <input
                            type="file"
                            name="pictures"
                            accept="image/*"
                            multiple
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins] cursor-pointer"
                        />

                        {/* ADD THIS PREVIEW SECTION */}
                        {formData.pictures && formData.pictures.length > 0 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pt-2">
                                {formData.pictures.map((pic, idx) => (
                                    <div key={idx} className="relative flex-shrink-0">
                                        <img
                                            src={pic}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    pictures: prev.pictures.filter((_, i) => i !== idx)
                                                }));
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;