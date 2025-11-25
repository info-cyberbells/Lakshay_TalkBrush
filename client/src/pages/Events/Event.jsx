import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  fetchAllEvents,
  updateEvent,
  deleteEvent,
} from "../../features/eventSlice";
import {
  X,
  ZoomIn,
  Image as ImageIcon,
  ZoomOut,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import AddEventModal from "../Model/AddEventModal";
import DeleteModal from "../Model/DeleteModal";
import { showToast } from "../../features/toastSlice";


const ScheduleCard = ({ event, onEdit, onDelete }) => {
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
          className="fixed inset-0 z-[60] lg:ml-60 lg:mr-60 mt-12 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden"
          onClick={closePreview}
        >
          {/* Controls Container */}
          <div className="absolute top-4 right-4 z-50 flex gap-3">
            {/* Zoom Indicator / Toggle Button */}
            <button
              className="p-2 bg-white/10 cursor-pointer hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              onClick={toggleZoom}
            >
              {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
            </button>

            {/* Close Button */}
            <button
              className="p-2 cursor-pointer bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                closePreview();
              }}
            >
              <X size={24} />
            </button>
          </div>

          <img
            src={previewImg}
            alt="Preview"
            className={`max-w-[95%] max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-in-out ${isZoomed
              ? "scale-150 cursor-zoom-out"
              : "scale-100 cursor-zoom-in"
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
                  <h3 className="font-bold text-gray-800 text-lg">
                    Event Gallery
                  </h3>
                  <p className="text-xs text-gray-500">
                    {event.pictures?.length || 0} photos
                  </p>
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

            {/* Footer / Hint */}
            <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">
                Click an image to view full screen
              </span>
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
              {/* <p className="text-[#A098AE] text-xs sm:text-sm md:text-[14px] font-normal mt-2 sm:mt-3 break-words whitespace-pre-wrap overflow-hidden">
                {event.description}
              </p> */}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">


              {/* --- Action Buttons --- */}
              <button
                onClick={() => onEdit && onEdit(event)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Edit event"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 cursor-pointer" />
              </button>

              <button
                onClick={() => onDelete && onDelete(event)}
                className="p-1 sm:p-2 hover:bg-red-50 rounded-md transition-colors"
                title="Delete event"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 cursor-pointer" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-[#A098AE] text-xs sm:text-sm md:text-[14px] font-normal mt-2 sm:mt-3 break-words whitespace-pre-wrap overflow-hidden">
              {event.description}
            </p>

            {/* --- Interactive Images Section --- */}
            {event.pictures && event.pictures.length > 0 ? (
              <div className="flex -space-x-2 mt-3">
                {event.pictures.slice(0, 3).map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    alt={`Event ${idx + 1}`}
                    onClick={() => setPreviewImg(pic)}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md object-cover border-2 border-white cursor-pointer hover:scale-105 hover:z-10 transition-transform duration-200"
                  />
                ))}

                {event.pictures.length > 3 && (
                  <div
                    onClick={() => setShowGrid(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md flex items-center justify-center border-2 border-white cursor-pointer hover:scale-105 transition-transform duration-200 z-0 overflow-hidden"
                  >
                    {/* 4th Image as background */}
                    <img
                      src={event.pictures[3]}
                      alt="More"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Count Text */}
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
  const {
    events,
    todayEvents,
    currentPage,
    totalPages,
    totalEvents,
    loading,
    error,
  } = useSelector((state) => state.events);
  const [isDeleteModelOpen, setDeleteModel] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const limit = 20;

  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    dispatch(fetchAllEvents({ page, limit }));
  }, [dispatch, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await dispatch(
          updateEvent({
            eventId: editingEvent._id,
            eventData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(addEvent(formData)).unwrap();
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      dispatch(fetchAllEvents({ page, limit }));
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setDeleteModel(true);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        await dispatch(deleteEvent(eventToDelete._id)).unwrap();
        dispatch(fetchAllEvents({ page, limit }));
        setDeleteModel(false);
        setEventToDelete(null);
        dispatch(showToast({ message: "Event Deleted Successfully!!!", type: "success" }));
      } catch (error) {
        console.error("Error deleting event:", error);
        dispatch(showToast({ message: "Failed to Delete Event!!!!", type: "error" }));
      }
    }
  };

  // Get start of week (Monday)
  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // Sunday = 0
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const filterEvents = (eventsList) => {
    if (filterType === "all") return eventsList;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filterType === "week") {
      const weekStart = startOfWeek(now);    // Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);  // Sunday

      return eventsList.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate >= weekStart && eventDate <= weekEnd;
      });
    }

    if (filterType === "month") {
      const month = now.getMonth();
      const year = now.getFullYear();

      return eventsList.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });
    }

    return eventsList;
  };


  // Group events by date
  const groupEventsByDate = (eventsList) => {
    const grouped = {};
    eventsList.forEach((event) => {
      const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[eventDate]) {
        grouped[eventDate] = [];
      }
      grouped[eventDate].push(event);
    });
    return grouped;
  };

  // const groupedEvents = groupEventsByDate(events);
  const filteredUpcomingEvents = filterEvents(events);
  // Sort upcoming events by date (ascending)
  const sortedUpcomingEvents = [...filteredUpcomingEvents].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Now group sorted events
  const groupedEvents = groupEventsByDate(sortedUpcomingEvents);

  const filteredTodayEvents = filterEvents(todayEvents);

  return (
    <div className="min-h-screen min-w-full bg-gray-50 sm:px-6 md:px-8 lg:px-[240px] pt-[40px] flex flex-col">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-semibold text-gray-900">
              Manage Events
            </h1>
          </div>
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden w-full relative">
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
            <div className="flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6 flex-1">
                  <h3 className="text-lg font-[Poppins] font-semibold mb-4 text-[#252525]">
                    Quick Stats
                  </h3>

                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Card 1 */}
                    <div className="flex flex-1 items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-[Poppins] text-gray-600">
                        Today's Events
                      </span>
                      <span className="text-xl font-bold text-[#2D4CCA]">
                        {todayEvents?.length || 0}
                      </span>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-1 items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-[Poppins] text-gray-600">
                        Total Events
                      </span>
                      <span className="text-xl font-bold text-purple-600">
                        {events?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="bg-white rounded-xl shadow-sm p-6 w-full lg:w-1/3 relative">
                  <h3 className="text-lg font-[Poppins] font-semibold mb-4 text-[#252525]">
                    Filter
                  </h3>

                  {/* WRAPPER DIV */}
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        // Optional: Remove focus after selection so the arrow flips back down
                        e.target.blur();
                      }}
                      className="
            peer
            appearance-none
            w-full px-4 py-3 
            border border-gray-300 rounded-lg 
            font-[Poppins] text-sm text-gray-700 
            outline-none cursor-pointer
            focus:ring-2 focus:ring-[#2D4CCA] focus:border-transparent
            transition-all
            bg-transparent
          "
                    >
                      <option value="all">All Events</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>

                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none peer-focus:hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>

                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none hidden peer-focus:block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Today's Events Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-[Poppins] font-semibold mb-5 text-[#2D4CCA] flex items-center gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Today's Events
                  </h3>

                  {todayEvents && todayEvents.length > 0 ? (
                    <div className="space-y-4">
                      {todayEvents.map((event, index) => (
                        <ScheduleCard
                          key={event._id || `today-${index}`}
                          event={event}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <p className="text-gray-500 font-[Poppins] text-base">
                        No events scheduled for today
                      </p>
                    </div>
                  )}
                </div>

                {/* Upcoming Events Section */}
                {filteredUpcomingEvents &&
                  filteredUpcomingEvents.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-xl font-[Poppins] font-semibold mb-5 text-[#252525] flex items-center gap-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Upcoming Events
                      </h3>

                      <div className="space-y-6">
                        {Object.entries(groupedEvents).map(
                          ([date, dateEvents]) => (
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
                                  <ScheduleCard
                                    key={event._id || `event-${index}`}
                                    event={event}
                                    onEdit={handleEditEvent}
                                    onDelete={handleDeleteEvent}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Empty State */}
                {!todayEvents?.length && !events?.length && (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg
                      className="w-20 h-20 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 font-[Poppins] text-lg mb-4">
                      No events found
                    </p>
                    <button
                      onClick={handleAddEvent}
                      className="text-[#2D4CCA] font-[Poppins] font-medium hover:underline"
                    >
                      Create your first event
                    </button>
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
                  {totalEvents}
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
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editingEvent={editingEvent}
      />
      {isDeleteModelOpen && (
        <DeleteModal
          onClose={() => setDeleteModel(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Event;
