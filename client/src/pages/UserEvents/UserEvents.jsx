import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../features/eventSlice";

// const ScheduleCard = ({ event }) => (
//     <div
//         className="flex font-[Poppins] border-l-8 border border-[#E5E7EB] bg-white rounded-lg p-5 hover:shadow-md transition-shadow"
//         style={{ borderLeftColor: "#2D4CCA" }}
//     >
//         <div className="flex flex-col flex-1">
//             <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                     <span className="text-[#A098AE] font-medium text-[14px]">
//                         {event.time}
//                     </span>
//                     <h3 className="text-[#252525] text-[18px] font-semibold mt-1">
//                         {event.fullName}
//                     </h3>
//                     <p className="text-[#A098AE] text-[14px] font-normal mt-3">
//                         {event.description}
//                     </p>
//                 </div>
//                 <div className="flex items-center gap-3 ml-4">
//                     {event.pictures && event.pictures.length > 0 ? (
//                         <div className="flex -space-x-2">
//                             {event.pictures.slice(0, 3).map((pic, idx) => (
//                                 <img
//                                     key={idx}
//                                     src={pic}
//                                     alt={`Event ${idx + 1}`}
//                                     className="w-14 h-14 rounded-full object-cover border-2 border-white"
//                                 />
//                             ))}
//                             {event.pictures.length > 3 && (
//                                 <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
//                                     <span className="text-sm font-semibold text-gray-600">+{event.pictures.length - 3}</span>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="w-14 h-14 bg-gradient-to-br from-[#2D4CCA] to-[#1e3a8a] rounded-full flex items-center justify-center">
//                             <span className="text-white text-xl font-semibold">
//                                 {event.fullName ? event.fullName.charAt(0) : '?'}
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

const ScheduleCard = ({ event }) => (
  <div
    className="flex font-[Poppins] border-l-8 border border-[#E5E7EB] bg-white rounded-lg 
               p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow w-full"
    style={{ borderLeftColor: "#2D4CCA" }}
  >
    <div className="flex flex-col flex-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-[#A098AE] font-medium text-xs sm:text-sm md:text-[14px]">
            {event.time}
          </span>
          <h3 className="text-[#252525] text-sm sm:text-base md:text-[18px] font-semibold mt-1">
            {event.fullName}
          </h3>
          <p className="text-[#A098AE] text-xs sm:text-sm md:text-[14px] font-normal mt-2 sm:mt-3">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
          {event.pictures && event.pictures.length > 0 ? (
            <div className="flex -space-x-2">
              {event.pictures.slice(0, 3).map((pic, idx) => (
                <img
                  key={idx}
                  src={pic}
                  alt={`Event ${idx + 1}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white"
                />
              ))}
              {event.pictures.length > 3 && (
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs sm:text-sm font-semibold text-gray-600">
                    +{event.pictures.length - 3}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#2D4CCA] to-[#1e3a8a] rounded-full flex items-center justify-center">
              <span className="text-white text-sm sm:text-base md:text-xl font-semibold">
                {event.fullName ? event.fullName.charAt(0) : "?"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);


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

    const groupedEvents = groupEventsByDate(events);

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