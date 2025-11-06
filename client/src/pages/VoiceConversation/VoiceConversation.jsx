import React, { useState, useEffect } from "react";
import { Mic, Share2, ThumbsUp, Phone, ChevronDown } from "lucide-react";

const VoiceConversation = ({ onEndCall }) => {
    const [isListening, setIsListening] = useState(true);
    const [waveAnimation, setWaveAnimation] = useState(0);

    // Animate the wave
    useEffect(() => {
        if (isListening) {
            const interval = setInterval(() => {
                setWaveAnimation((prev) => (prev + 1) % 100);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isListening]);

    // Participant data
    const participants = [
        {
            id: 1,
            name: "Frank",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank1",
            isActive: true,
        },
        {
            id: 2,
            name: "Frank",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank2",
            isActive: true,
        },
        {
            id: 3,
            name: "Frank",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank3",
            isActive: true,
        },
    ];

    const additionalParticipants = [
        { id: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1" },
        { id: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User2" },
        { id: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User3" },
    ];

    const handleMicToggle = () => {
        setIsListening(!isListening);
    };

    const handleEndCall = () => {
        // Handle end call logic
        console.log("Ending call...");
    };

    const handleShare = () => {
        console.log("Sharing...");
    };

    const handleLike = () => {
        console.log("Liked!");
    };

    return (
        <div
            className="h-screen bg-gray-50 flex flex-col lg:flex-row lg:ml-[240px] lg:mt-[50px] lg:mr-[235px] lg:w-[calc(100%-240px)] overflow-hidden px-4 lg:px-0 pt-4 lg:pt-0"
            style={{ fontFamily: "'Mia-Assistant-Vocal', sans-serif" }}
        >
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-gray-200 px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 pt-16 lg:pt-4">
                    <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start order-2 lg:order-1">
                        {/* Accent Dropdown */}
                        <button className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-gray-300 rounded-lg hover:bg-white-50 transition-colors text-sm lg:text-base">
                            <span className="font-medium cursor-pointer" style={{
                                fontFamily: "'Poppins', sans-serif",
                                color: "#333333"
                            }}>Choose Accent</span>
                            <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
                        </button>
                    </div>

                    <div className="flex-1 text-center w-full lg:w-auto">
                        <h1
                            className="text-xl lg:text-3xl"
                            style={{
                                fontFamily: "'Hanken Grotesk', sans-serif",
                                fontWeight: 700,
                                fontStyle: "normal",
                                lineHeight: "1.4",
                                letterSpacing: "0",
                                color: "#000000",
                            }}
                        >
                            Mia - Assistant Vocal
                        </h1>
                        <p className="text-sm lg:text-xl" style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            lineHeight: "1.4",
                            letterSpacing: "0",
                            color: "#868686",
                            marginTop: "0px",
                        }}>
                            Specialized AI Assistant for Ivory Coast
                        </p>
                    </div>

                </div>

                {/* Center Content - Waveform */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-6 lg:py-0">
                    {/* Animated Waveform */}
                    <div className="relative w-full max-w-xl h-40 lg:h-64 flex items-center justify-center mb-6 lg:mb-8">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 800 300"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Main wave paths */}
                            <path
                                d={`M 0 100 Q 100 ${70 + Math.sin(waveAnimation * 0.1) * 25} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#gradient1)"
                                strokeWidth="2"
                                opacity="0.8"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${60 + Math.sin(waveAnimation * 0.12 + 0.5) * 30} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#gradient2)"
                                strokeWidth="2.5"
                                opacity="0.7"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${50 + Math.sin(waveAnimation * 0.15 + 1) * 35} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#gradient3)"
                                strokeWidth="2"
                                opacity="0.6"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${65 + Math.sin(waveAnimation * 0.08 + 1.5) * 28} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#gradient4)"
                                strokeWidth="1.8"
                                opacity="0.5"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${55 + Math.sin(waveAnimation * 0.13 + 2) * 32} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#gradient5)"
                                strokeWidth="2.2"
                                opacity="0.65"
                                strokeLinecap="round"
                            />

                            {/* Reflection/Glow effect below - faded versions */}
                            <path
                                d={`M 0 100 Q 100 ${130 - Math.sin(waveAnimation * 0.1) * 20} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#verticalGradient1)"
                                strokeWidth="2"
                                opacity="0.4"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${140 - Math.sin(waveAnimation * 0.12 + 0.5) * 25} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#verticalGradient2)"
                                strokeWidth="2.5"
                                opacity="0.35"
                                strokeLinecap="round"
                            />
                            <path
                                d={`M 0 100 Q 100 ${150 - Math.sin(waveAnimation * 0.15 + 1) * 30} 200 100 T 400 100 T 600 100 T 800 100`}
                                fill="none"
                                stroke="url(#verticalGradient3)"
                                strokeWidth="2"
                                opacity="0.3"
                                strokeLinecap="round"
                            />

                            {/* Gradients */}
                            <defs>
                                {/* Horizontal gradients for main waves */}
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#38BDF8" />
                                    <stop offset="50%" stopColor="#A78BFA" />
                                    <stop offset="100%" stopColor="#F472B6" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#A78BFA" />
                                    <stop offset="50%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#FB923C" />
                                </linearGradient>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#60A5FA" />
                                    <stop offset="50%" stopColor="#C084FC" />
                                    <stop offset="100%" stopColor="#F9A8D4" />
                                </linearGradient>
                                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#22D3EE" />
                                    <stop offset="50%" stopColor="#A78BFA" />
                                    <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                                <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#818CF8" />
                                    <stop offset="50%" stopColor="#F472B6" />
                                    <stop offset="100%" stopColor="#FBBF24" />
                                </linearGradient>

                                {/* Vertical fade gradients for reflection effect */}
                                <linearGradient id="verticalGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="verticalGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="verticalGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Listening Status */}
                    <div className="text-center mb-6 lg:mb-8">
                        <p
                            className="text-xl lg:text-3xl"
                            style={{
                                fontFamily: "'Turret Road', sans-serif",
                                fontWeight: 400,
                                fontSize: "30px",
                                lineHeight: "100%",
                                letterSpacing: "0",
                                textAlign: "center",
                                color: "#000000",
                                marginBottom: "0.75rem",
                            }}
                        >
                            {isListening ? "Listening..." : "Muted"}
                        </p>

                        {isListening && (
                            <div className="w-12 h-12 mx-auto flex items-center justify-center">
                                <Mic className="w-8 h-8 text-yellow-500 animate-pulse" />
                            </div>)}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={handleMicToggle}
                            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-lg ${isListening
                                ? "bg-white text-gray-700 hover:bg-gray-100"
                                : "bg-gray-700 text-white hover:bg-gray-800"
                                }`}
                        >
                            <Mic className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>

                        <button
                            onClick={handleShare}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <Share2 className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                        </button>

                        <button
                            onClick={handleLike}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <ThumbsUp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white rotate-[135deg]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Participants */}
            <div className="w-full lg:w-80 text-center p-4 lg:p-6 bg-gray-50 border-t lg:border-t-0 lg: border-gray-200 max-h-[50vh] lg:max-h-none overflow-y-auto">
                <div
                    className="font-medium mb-4 lg:mb-5 text-sm lg:text-base"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                >
                    <span>5 Nov 2025</span>
                    <span
                        style={{
                            display: "inline-block",
                            width: "1px",
                            height: "24px",
                            backgroundColor: "#000",

                        }}
                    ></span>
                    <span style={{ fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: "25px" }}>4:30</span>
                </div>


                <div className="w-auto bg-white p-4 lg:p-6">
                    {/* Active Participants */}
                    <div className="space-y-6">
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="relative">
                                    <img
                                        src={participant.avatar}
                                        alt={participant.name}
                                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-blue-500"
                                    />
                                    {participant.isActive && (
                                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {participant.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Additional Participants Preview */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-center items-center gap-2 mb-3">
                            {additionalParticipants.map((user) => (
                                <img
                                    key={user.id}
                                    src={user.avatar}
                                    alt="Participant"
                                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-md"
                                />
                            ))}
                        </div>
                        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer">
                            + 10 More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceConversation;