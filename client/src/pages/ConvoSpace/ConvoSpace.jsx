import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Mic, Link2, ChevronLeft, ChevronRight } from "lucide-react";

const ConvoSpace = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Backend URL
  // const BACKEND_URL = "https://talkbrush.com/accent";
  const BACKEND_URL = "http://127.0.0.1:4444/accent";


  // Add your image URLs here
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
      title: "Obtén un vínculo para compartir",
      description:
        "Haz clic en Nueva reunión para obtener un vínculo que puedas enviar a las personas con quienes quieras reunirte",
    },
    {
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop",
      title: "Connect with Anyone",
      description:
        "Share your conversation link and start chatting in different accents instantly",
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      title: "Enhance Your Experience",
      description:
        "Practice languages and enjoy diverse conversations with people worldwide",
    },
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

  //  NEW: Create Room API Integration
  const handleStartConversation = async () => {
    setIsCreatingRoom(true);

    try {
      const response = await fetch(`${BACKEND_URL}/create_room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
      });

      const data = await response.json();

      if (data.success && data.room_code) {
        console.log('✅ Room created:', data.room_code);

        // Navigate to room with code in URL (so link sharing works)
        navigate(`/accent/room/${data.room_code}`);
      } else {
        alert('Failed to create room. Please try again.');
      }
    } catch (error) {
      console.error(' Error creating room:', error);
      alert('Could not connect to server. Please check if backend is running at http://localhost:4444');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleCopyLink = () => {
    // This will copy current page URL
    // In real scenario, you'd create a room first then copy that link
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 lg:ml-[240px] lg:mt-[50px] lg:mr-[250px] lg:w-[calc(100%-240px)] pt-3">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-4 lg:space-y-6 mt-18 sm:mt-24 lg:mt-0">
          <h1 className="text-xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Start Conversation <br className="hidden lg:block"></br>with TalkBrush para <br className="hidden lg:block"></br>todos.
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
          </div>

          <a
            href="#"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Más información sobre Talk Brush
          </a>
        </div>


        {/* Right Section */}
        <div className="relative mx-auto lg:ml-0 lg:pl-12 w-full max-w-md lg:max-w-none">
          {/* Image Slider Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden aspect-square shadow-lg w-full max-w-[280px] sm:max-w-sm mx-auto">            {/* Images */}
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