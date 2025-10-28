import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, fetchAllEvents, updateEvent, deleteEvent } from "../../features/eventSlice";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import AddEventModal from "../Model/AddEventModal";
import DeleteModal from "../Model/DeleteModal";
import { showToast } from "../../features/toastSlice";

const ScheduleCard = ({ event, onEdit, onDelete }) => (

  <div
    className="flex font-[Poppins] border-l-8 border border-[#E5E7EB] bg-white rounded-lg p-5 hover:shadow-md transition-shadow"
    style={{ borderLeftColor: "#2D4CCA" }}
  >
    <div className="flex flex-col flex-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-[#A098AE] font-medium text-[14px]">
            {event.time}
          </span>
          <h3 className="text-[#252525] text-[18px] font-semibold mt-1">
            {event.fullName}
          </h3>
          <p className="text-[#A098AE] text-[14px] font-normal mt-3">
            {event.description}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          {event.pictures && event.pictures.length > 0 ? (
            <div className="flex -space-x-2">
              {event.pictures.slice(0, 3).map((pic, idx) => (
                <img
                  key={idx}
                  src={pic}
                  alt={`Event ${idx + 1}`}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />
              ))}
              {event.pictures.length > 3 && (
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-sm font-semibold text-gray-600">+{event.pictures.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-[#2D4CCA] to-[#1e3a8a] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {event.fullName ? event.fullName.charAt(0) : '?'}
              </span>
            </div>
          )}
          <button
            onClick={() => onEdit(event)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit event"
          >
            <Edit className="w-4 h-4 text-gray-600 cursor-pointer" />
          </button>
          <button
              onClick={() => onDelete(event)}
              className="p-2 hover:bg-red-50 rounded-md transition-colors"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" />
            </button>
        </div>
      </div>
    </div>
  </div>
);

const Event = () => {
  const dispatch = useDispatch();
  const { events, todayEvents, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.events
  );

  // const [isDeleteModelOpen, setDeleteModel] = useState(false);
  const [isDeleteModelOpen, setDeleteModel] = useState(false);
const [eventToDelete, setEventToDelete] = useState(null);

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

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await dispatch(updateEvent({
          eventId: editingEvent._id,
          eventData: formData
        })).unwrap();
      } else {
        await dispatch(addEvent(formData)).unwrap();
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      dispatch(fetchAllEvents({ page, limit }));
    } catch (error) {
      console.error('Error saving event:', error);
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

  // const handleDeleteEvent = async (eventId) => {
  //   if (window.confirm('Are you sure you want to delete this event?')) {
  //     try {
  //       await dispatch(deleteEvent(eventId)).unwrap();
  //       dispatch(fetchAllEvents({ page, limit }));
  //     } catch (error) {
  //       console.error('Error deleting event:', error);
  //     }
  //   }
  // };

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
      dispatch(showToast({message:"Event Deleted Successfully!!!"}))
    } catch (error) {
      console.error('Error deleting event:', error);
      dispatch(showToast({message: "Failed to Delete Event!!!!"}))
    }
  }
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

  const groupedEvents = groupEventsByDate(events);

  return (
  
    <div className="min-h-screen min-w-full bg-gray-50 px-[240px] pt-[40px] flex flex-col">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">
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

        <div className="bg-white rounded-lg shadow overflow-hidden w-full relative min-h-[800px]">
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
              <div className="lg:col-span-2 space-y-8">
                {/* Today's Events Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-[Poppins] font-semibold mb-5 text-[#2D4CCA] flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Today's Events
                  </h3>
                  {todayEvents && todayEvents.length > 0 ? (
                    <div className="space-y-4">
                      {todayEvents.map((event) => (
                        // <ScheduleCard key={event._id || `today-${index}`} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                        <ScheduleCard key={event._id || `today-${index}`} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
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
                              // <ScheduleCard key={event._id || `event-${index}`} event={event} onEdit={handleEditEvent}  />
                              <ScheduleCard key={event._id || `event-${index}`} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
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
                    <button
                      onClick={handleAddEvent}
                      className="text-[#2D4CCA] font-[Poppins] font-medium hover:underline"
                    >
                      Create your first event
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-[Poppins] font-semibold mb-4 text-[#252525]">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-[Poppins] text-gray-600">Today's Events</span>
                      <span className="text-xl font-bold text-[#2D4CCA]">{todayEvents?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-[Poppins] text-gray-600">Total Events</span>
                      <span className="text-xl font-bold text-purple-600">{events?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-[Poppins] font-semibold mb-4 text-[#252525]">Filter</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-[Poppins] text-sm text-gray-700">
                      All Events
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-[Poppins] text-sm text-gray-700">
                      This Week
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-[Poppins] text-sm text-gray-700">
                      This Month
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {/* {totalPages >= 1 && (
            <div className="flex justify-center items-center gap-4 my-5">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`px-6 py-3 rounded-lg font-[Poppins] font-medium transition-all ${page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#2D4CCA] border-2 border-[#2D4CCA] hover:bg-[#2D4CCA] hover:text-white shadow-sm"
                  }`}
              >
                Previous
              </button>

              <span className="text-gray-700 font-[Poppins] font-medium px-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`px-6 py-3 rounded-lg font-[Poppins] font-medium transition-all ${page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#2D4CCA] text-white hover:bg-[#2440a8] shadow-sm"
                  }`}
              >
                Next
              </button>
            </div>
          )} */}

            {totalPages >= 1 && (
                        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
                          <span className="text-sm text-gray-600 mb-3 sm:mb-0">
                            Showing{" "}
                            <span className="font-semibold text-gray-800">
                            5
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-gray-800">
                              5
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-800">
                            5
                            </span>
                          </span>
            
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                            >
                              ← Previous
                            </button>
            
                            <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md ">
                              Page 
                            </span>
            
                            <button
                              
                              disabled
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