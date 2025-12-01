import React, { useEffect } from 'react';
import { Users, Shield, ArrowRight, X } from 'lucide-react';


const RoomPreviewModal = ({ roomCode, roomDetails, onClose, onContinue }) => {


    if (!roomDetails) return null;

    if (!roomDetails) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-slideUp">

                {/* Close Btn */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <X size={22} />
                </button>

                {/* Header */}
                <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Users size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">You're Invited!</h2>
                    <p className="text-gray-600 mt-1 text-sm">Join this TalkBrush room</p>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-5">

                    {/* Room Code */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Shield size={18} className="text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-500">Room Code</p>
                            <p className="text-base font-semibold text-gray-900">{roomCode}</p>
                        </div>
                    </div>

                    {/* Host */}
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <Users size={18} className="text-purple-600" />
                        <div>
                            <p className="text-xs text-gray-500">Host</p>
                            <p className="text-base font-semibold text-gray-900">
                                {roomDetails?.initiator_name}
                            </p>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                        <Users size={18} className="text-green-600" />
                        <div>
                            <p className="text-xs text-gray-500">Participants</p>
                            <p className="text-base font-semibold text-gray-900">
                                {roomDetails?.members_joined}
                            </p>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <Shield size={18} className="text-orange-600" />
                        <div>
                            <p className="text-xs text-gray-500">Created At</p>
                            <p className="text-base font-semibold text-gray-900">
                                {new Date(roomDetails?.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Notice */}
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
                    <ArrowRight size={15} className="text-yellow-800" />
                    <p className="text-sm text-yellow-800">Login or create an account to continue</p>
                </div>

                {/* Continue Button */}
                <button
                    onClick={onContinue}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold cursor-pointer text-base hover:opacity-90 transition shadow-md"
                >
                    Continue to Login
                </button>

            </div>

            {/* Animations */}
            <style>{`
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .animate-slideUp {
                animation: slideUp 0.25s ease-out forwards;
            }
        `}</style>
        </div>
    );

};

export default RoomPreviewModal;