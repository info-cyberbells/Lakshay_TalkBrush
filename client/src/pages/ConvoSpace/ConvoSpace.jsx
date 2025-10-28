import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, fetchAllEvents, updateEvent, deleteEvent } from "../../features/eventSlice";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import AddEventModal from "../Model/AddEventModal";

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
            onClick={() => onDelete(event._id)}
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

const ConvoSpace = () => {
  const dispatch = useDispatch();
  const { events, todayEvents, currentPage, totalPages, loading, error } = useSelector(
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

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
        dispatch(fetchAllEvents({ page, limit }));
      } catch (error) {
        console.error('Error deleting event:', error);
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
    <div className="min-h-screen bg-gray-50 px-[240px] pt-[40px]">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">
           Hello
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

        <div className="bg-white rounded-lg shadow overflow-hidden w-full relative min-h-[200px]">
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

              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ConvoSpace;