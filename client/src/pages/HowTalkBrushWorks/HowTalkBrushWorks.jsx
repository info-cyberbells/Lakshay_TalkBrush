import React from "react";
import { useNavigate } from 'react-router-dom';
import { Mic, Users, Globe, Headphones, Share2, Settings } from "lucide-react";

const HowTalkBrushWorks = () => {
    const navigate = useNavigate();

    const steps = [
        {
            icon: <Mic className="w-10 h-10" />,
            title: "Create Your Room",
            description: "Click 'Start Conversation' to instantly create your private voice room.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Share2 className="w-10 h-10" />,
            title: "Share the Link",
            description: "Share your unique room link with friends or colleagues to invite them.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <Settings className="w-10 h-10" />,
            title: "Choose Your Accent",
            description: "Select from 15+ English accents like American, British, Australian, and more.",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: <Headphones className="w-10 h-10" />,
            title: "Start Speaking",
            description: "Unmute and speak naturally - TalkBrush transforms your voice in real-time.",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const features = [
        {
            icon: <Globe className="w-8 h-8" />,
            title: "15+ Accents",
            description: "American, British, Australian, Indian, Irish, Portuguese, Canadian, and more"
        },
        {
            icon: <Mic className="w-8 h-8" />,
            title: "Real-Time Conversion",
            description: "Advanced AI transforms your voice instantly with natural-sounding results"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Group Conversations",
            description: "Connect with multiple people in the same room simultaneously"
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: "Customizable",
            description: "Choose gender voice and accent preferences for personalized experience"
        }
    ];

    return (
        <div className="min-h-screen bg-white lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-20">
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                    How TalkBrush Works
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                    Transform your voice and practice English accents in real-time conversations with advanced AI technology.
                </p>
            </div>

            {/* Steps Section - Simplified Grid */}
            <div className="max-w-5xl mx-auto mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                                    {step.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-gray-400">
                                            STEP {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-5xl mx-auto mb-20">
                <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-10">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {[
                        {
                            q: "Do I need to create an account?",
                            a: "No! You can join as a guest instantly. However, creating an account saves your preferences and room history."
                        },
                        {
                            q: "How many people can join one room?",
                            a: "TalkBrush supports multiple participants in a single room, perfect for group practice sessions."
                        },
                        {
                            q: "Can I switch accents during a conversation?",
                            a: "Yes! You can change your accent anytime using the dropdown menu during the call."
                        },
                        {
                            q: "Is my voice data stored?",
                            a: "No, we process audio in real-time and don't store your voice recordings for privacy."
                        },
                        {
                            q: "What devices are supported?",
                            a: "TalkBrush works on any device with a modern web browser and microphone - desktop, laptop, tablet, or smartphone."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {faq.q}
                            </h3>
                            <p className="text-gray-600">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section - Cleaner Design */}
            <div className="max-w-3xl mx-auto text-center">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-8 lg:p-12">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join users practicing and perfecting their English accents
                    </p>
                    <button
                        onClick={() => navigate('/convo-space')}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 cursor-pointer text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <Mic className="w-5 h-5" />
                        Start Your First Conversation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowTalkBrushWorks;