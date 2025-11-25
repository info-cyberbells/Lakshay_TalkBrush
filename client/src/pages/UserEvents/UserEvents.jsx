import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../features/eventSlice";
import { X, ZoomIn, Image as ImageIcon, ZoomOut } from 'lucide-react';

const ScheduleCard = ({ event }) => {
  const [previewImg, setPreviewImg] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Helper to close preview and reset zoom state
  const closePreview = () => {
    setPreviewImg(null);
    setIsZoomed(false);
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <>

      {previewImg && (
        <div
          className="fixed inset-0 z-[60] lg:ml-60 lg:mr-60 mt-12 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden"
          onClick={closePreview}
        >
          {/* Controls Container */}
          <div className="absolute top-4 right-4 z-50 flex gap-3">
            {/* Zoom Indicator / Toggle Button (Optional visual cue) */}
            <button
              className="p-2 cursor-pointer bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              onClick={toggleZoom}
            >
              {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
            </button>

            {/* Close Button */}
            <button
              className="p-2 cursor-pointer bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              onClick={(e) => { e.stopPropagation(); closePreview(); }}
            >
              <X size={24} />
            </button>
          </div>

          <img
            src={previewImg}
            alt="Preview"
            className={`max-w-[95%] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-in-out ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
            onClick={toggleZoom}
          />
        </div>
      )}

      {showGrid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* Modal Container */}
          <div
            className="bg-white w-full max-w-2xl mt-10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Event Gallery</h3>
                  <p className="text-xs text-gray-500">{event.pictures?.length || 0} photos</p>
                </div>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Grid Area */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.pictures?.slice(0, 10).map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-gray-100"
                    onClick={() => setPreviewImg(img)}
                  >
                    {/* Image with Zoom Effect */}
                    <img
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                      <div className="opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur text-gray-900 p-2 rounded-full shadow-lg">
                          <ZoomIn size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Click an image to view full screen</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="font-[Poppins] border-l-8 border border-[#E5E7EB] bg-white rounded-lg p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow w-full overflow-hidden"
        style={{ borderLeftColor: "#2D4CCA" }}
      >
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start gap-2 w-full">
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="text-[#A098AE] font-medium text-xs sm:text-sm md:text-[14px]">
                {event.time}
              </span>

              <h3 className="text-[#252525] text-sm sm:text-base md:text-[18px] font-semibold mt-1">
                {event.fullName}
              </h3>
            </div>
            {/* Images Section on Card */}
            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
            </div>
          </div>
          <div>
            <p className="text-[#A098AE] text-xs sm:text-sm md:text-[14px] font-normal mt-2 sm:mt-3 break-words whitespace-pre-wrap overflow-hidden">
              {event.description}
            </p>

            {event.pictures && event.pictures.length > 0 ? (
              <div className="flex -space-x-2 mt-3">
                {event.pictures.slice(0, 3).map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    onClick={() => setPreviewImg(pic)}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white cursor-pointer hover:scale-105 hover:z-10 transition-transform duration-200"
                  />
                ))}

                {event.pictures.length > 3 && (
                  <div
                    onClick={() => setShowGrid(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:scale-105 transition-transform duration-200 z-0 overflow-hidden"
                  >
                    <img
                      src={event.pictures[3]}
                      alt="More"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />

                    <span className="relative z-10 text-xs sm:text-sm font-bold text-white">
                      +{event.pictures.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};




const Event = () => {
  const dispatch = useDispatch();
  const { events, todayEvents, currentPage, totalEvents, totalPages, loading, error } = useSelector(
    (state) => state.events
  );

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const limit = 20;

  useEffect(() => {
    dispatch(fetchAllEvents({ page, limit }));
  }, [dispatch, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Group events by date
  const groupEventsByDate = (eventsList) => {
    const grouped = {};
    eventsList.forEach((event) => {
      const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    });
    return grouped;
  };

  const sortedUpcomingEvents = [...events].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const groupedEvents = groupEventsByDate(sortedUpcomingEvents);

  return (

    // <div className="bg-gray-50 min-h-screen w-full px-[240px] pt-[30px] pb-10">
    <div className="bg-gray-50 min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-[240px] pt-[30px] pb-10">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">
              Events
            </h1>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full relative lg:min-h-[600px]">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 z-10">
              <div className="spinner"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-[Poppins]">{error}</p>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-8">
                {/* Today's Events Section */}
                <div className="bg-white rounded-xl w-full shadow-sm p-6">
                  <h3 className="text-xl font-[Poppins] font-semibold mb-5 text-[#2D4CCA] flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Today's Events
                  </h3>
                  {todayEvents && todayEvents.length > 0 ? (
                    <div className="space-y-4">
                      {todayEvents.map((event) => (
                        <ScheduleCard key={event._id || `today-${index}`} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <p className="text-gray-500 font-[Poppins] text-base">No events scheduled for today</p>
                    </div>
                  )}
                </div>

                {/* Upcoming Events Section */}
                {events && events.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-[Poppins] font-semibold mb-5 text-[#252525] flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upcoming Events
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                        <div key={date}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-px bg-gradient-to-r from-[#2D4CCA] to-transparent flex-1"></div>
                            <h4 className="text-sm font-[Poppins] font-semibold text-gray-700 uppercase tracking-wide">
                              {date}
                            </h4>
                            <div className="h-px bg-gradient-to-l from-[#2D4CCA] to-transparent flex-1"></div>
                          </div>
                          <div className="space-y-4">
                            {dateEvents.map((event, index) => (
                              <ScheduleCard key={event._id || `event-${index}`} event={event} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!todayEvents?.length && !events?.length && (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 font-[Poppins] text-lg mb-4">No events found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {totalPages >= 1 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg mt-3">
              <span className="text-sm text-gray-600 mb-3 sm:mb-0">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {currentPage}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-800">
                  {totalEvents}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {totalPages}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  ← Previous
                </button>

                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md ">
                  {currentPage}
                </span>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;