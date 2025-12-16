import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Mic, Link2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { createRoomThunk, getRoomDetailsThunk } from "../../features/roomSlice";
import img1 from "/img1.png";
import img2 from "/img2.jpg";
import img4 from "/img4.jpg";
import img5 from "/img5.jpg";

const ConvoSpace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);


  // Add your image URLs here
  const slides = [
    {
      image: img1,
      title: "Start a Conversation Instantly",
      description:
        "Create a private room and practice English accents with friends, colleagues, or anyone you invite.",
    },
    {
      image: img2,
      title: "Share Your Room Link",
      description:
        "Generate a unique join link and share it with others to start speaking together effortlessly.",
    },
    {
      image: img4,
      title: "Practice Anytime, Anywhere",
      description:
        "Join or create rooms on the go and improve your English speaking skills with flexible, on-demand conversations.",
    },
    {
      image: img5,
      title: "Speak with Confidence",
      description:
        "Enhance your pronunciation and fluency through natural real-time voice interactions tailored to your accent goals.",
    }
  ];

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleStartConversation = async () => {
    setIsCreatingRoom(true);

    const result = await dispatch(createRoomThunk());

    setIsCreatingRoom(false);

    if (createRoomThunk.fulfilled.match(result)) {
      const roomCode = result.payload.room_code;

      const shareLink = `${window.location.origin}/accent/room/${roomCode}`;
      console.log('📋 Share this link:', shareLink);

      navigate(`/accent/room/${roomCode}`, {
        replace: true,
        state: { fromCreateRoom: true }
      });
    } else {
      alert("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (code) => {
    const trimmedCode = code.trim();

    if (!trimmedCode || trimmedCode.length !== 8) {
      alert('Please enter a valid 8-character room code');
      return;
    }

    setIsJoiningRoom(true);

    try {
      const result = await dispatch(getRoomDetailsThunk(trimmedCode));

      if (getRoomDetailsThunk.fulfilled.match(result)) {
        navigate(`/accent/room/${trimmedCode}`);
      } else {
        alert('Room not found. Please check the room code and try again.');
        setJoinRoomCode('');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Room not found. Please check the room code and try again.');
      setJoinRoomCode('');
    } finally {
      setIsJoiningRoom(false);
    }
  };



  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-4 lg:space-y-6 mt-18 sm:mt-24 lg:mt-0">
          <h1 className="text-xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Start Conversations <br className="hidden lg:block" />
            with TalkBrush for <br className="hidden lg:block" />
            everyone, everywhere.
          </h1>

          <p className="text-sm leading-relaxed" style={{ color: "#5F6368" }}>
            TalkBrush is an innovative app that lets users communicate in
            various accents. With TalkBrush, you can enhance your language
            skills while having fun chatting with people from around the globe.
            Discover the magic of linguistic diversity and connect with others
            through unique accents!
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4">
            <button
              onClick={handleStartConversation}
              disabled={isCreatingRoom}
              className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md cursor-pointer text-sm lg:text-base ${isCreatingRoom ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <Mic className="w-5 h-5" />
              {isCreatingRoom ? 'Creating Room...' : 'Start Conversation'}
            </button>

            {/* Join Room Section */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room Code"
                value={joinRoomCode}
                onChange={(e) => {
                  // Only allow alphanumeric characters, max 8
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  if (value.length <= 8) {
                    setJoinRoomCode(value);
                  }
                }}
                maxLength={8}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm lg:text-base transition-colors bg-white"
                disabled={isJoiningRoom}
              />
              <button
                onClick={() => handleJoinRoom(joinRoomCode)}
                disabled={joinRoomCode.length !== 8 || isJoiningRoom}
                className={`flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md cursor-pointer text-sm lg:text-base whitespace-nowrap ${(joinRoomCode.length !== 8 || isJoiningRoom) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <Link2 className="w-5 h-5" />
                {isJoiningRoom ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>

          <a
            href="/how-talkbrush-works"
            target="blank"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Discover how TalkBrush works
          </a>
        </div>

        {/* Right Section */}
        <div className="relative mx-auto lg:ml-0 lg:pl-12 w-full max-w-md lg:max-w-none">
          {/* Image Slider Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden aspect-square  w-full max-w-[280px] sm:max-w-sm mx-auto">
            {/* Images */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Navigation Arrows on Image */}
            <button
              onClick={prevSlide}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800 cursor-pointer" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-800 cursor-pointer" />
            </button>
          </div>

          {/* Info Card Below Image */}
          <div className="mt-6 lg:mt-8 bg-white rounded-2xl p-4 lg:p-6">
            {/* Slide Content */}
            <div className="text-center">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 lg:mb-3">
                {slides[currentSlide].title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-blue-600 w-8" : "bg-gray-300"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvoSpace;