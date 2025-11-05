import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Mic, Link2, ChevronLeft, ChevronRight } from "lucide-react";

const ConvoSpace = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const handleStartConversation = () => {
    navigate('/voice-conversation');
  };

  const handleCopyLink = () => {
    // Add your copy link logic here
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 ml-[240px] mt-[50px] mr-[250px] w-[calc(100%-240px)] pt-3">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-6">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Start Conversation <br ></br>with TalkBrush para <br ></br>todos.
          </h1>

          <p className="text-sm leading-relaxed" style={{ color: "#5F6368" }}>
            TalkBrush is an innovative app that lets users communicate in
            various accents. With TalkBrush, you can enhance your language
            skills while having fun chatting with people from around the globe.
            Discover the magic of linguistic diversity and connect with others
            through unique accents!
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStartConversation}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              Start Conversation
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            >
              <Link2 className="w-5 h-5" />
              Copy the link and share
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
        <div className="relative ml-auto lg:ml-0 lg:pl-12">
          {/* Image Slider Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden aspect-square shadow-lg max-w-sm">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800 cursor-pointer" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-800 cursor-pointer" />
            </button>
          </div>

          {/* Info Card Below Image */}
          <div className="mt-8 bg-white rounded-2xl  p-6">
            {/* Slide Content */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
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