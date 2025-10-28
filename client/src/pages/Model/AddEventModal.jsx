import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddEventModal = ({ isOpen, onClose, onSubmit, editingEvent }) => {
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
        }
    }, [editingEvent]);


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'pictures' && files && files.length > 0) {
            const fileArray = Array.from(files);
            const readers = fileArray.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then(results => {
                setFormData(prev => ({
                    ...prev,
                    pictures: [...prev.pictures, ...results] 
                }));
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form
        setFormData({
            fullName: '',
            description: '',
            date: '',
            time: '',
            picture: ''
        });
    };

    const handleClose = () => {
        setFormData({
            fullName: '',
            description: '',
            date: '',
            time: '',
            picture: ''
        });
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
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins]"
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
                            required
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins] resize-none"
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
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins]"
                            />
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
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins]"
                            />
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent outline-none font-[Poppins] cursor-pointer"
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

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-[Poppins] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-[#2D4CCA] text-white rounded-lg font-[Poppins] font-medium hover:bg-[#2440a8] transition-colors cursor-pointer"
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