import React from "react";

const todayEvents = [
  {
    time: "09.00 - 10.00 AM",
    title: "Web Design Webinar",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    badgeColor: "bg-blue-600",
  },
  {
    time: "10.00 - 11.00 AM",
    title: "Food Festival",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    // badgeColor: "bg-yellow-500",
  },
  {
    time: "11.00 - 12.00 PM",
    title: "Project Discuss",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    // badgeColor: "bg-yellow-500",
  },
  {
    time: "1.00 - 2.00 PM",
    title: "Evening Party",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    // badgeColor: "bg-yellow-500",
  },
];

const tomorrowEvents = [
  {
    time: "09.00 - 10.00 AM",
    title: "Tech Seminar",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    badgeColor: "bg-red-500",
  },
  {
    time: "10.00 - 11.00 AM",
    title: "Music Event",
    description:
      "Sed eligendi facere repellendus. Ipsam ipsam incidunt minima harum tenetur. Ab sit asperiores architecto repudiandae.",
    badgeColor: "bg-sky-400",
  },
];

  // Helper to get ordinal (1st, 2nd, 3rd, 4th, etc.)
  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Function to format a date
  function formatDate(date) {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = getOrdinal(date.getDate());
    const year = date.getFullYear();
    return `${weekday}, ${day} ${month}, ${year}`;
  }

  // Today
  const today = new Date();
  const todayFormatted = formatDate(today);
  console.log("Today:", todayFormatted);

  // Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowFormatted = formatDate(tomorrow);
  console.log("Tomorrow:", tomorrowFormatted);

const ScheduleCard = ({ event, items = [] }) => {
  const getImageUrl = (item) => {
    return null; // no image
  };

  // Always show 3 avatars
  const avatars = [0, 1, 2, 3].map((i) => items[i] || {});

  return (
    <div className="flex font-[Poppins] border-l-8 border-2 border-[#D1D1D1] bg-white rounded-md p-4 mb-4 mt-3" style={{ borderLeftColor: event.badgeColor }}>
      <div className="flex flex-col flex-1">
        {/* Header: Time + Title on left, Avatars on right */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[#A098AE] font-medium text-[14px]">{event.time}</span>
            <h3 className="text-[#252525] text-[18px] font-semibold mt-1">{event.title}</h3>
          </div>
          <div className="flex -space-x-3">
            {avatars.map((item, idx) => {
              const imgUrl = getImageUrl(item);
              return imgUrl ? (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={"Avatar"}
                  className="w-12 h-12 object-cover rounded-full border-2 border-white"
                />
              ) : (
                <div
                  key={idx}
                  className="w-12 h-12 bg-[#A098AE] rounded-2xl border-4 border-white"
                />
              );
            })}
          </div>
        </div>

        <p className="text-[#A098AE] text-[14px] font-normal mt-3">{event.description}</p>
      </div>
    </div>
  );
};




const Event = () => {
      const borderColors = ["#2D4CCA", "#F8C140", "#F58869", "#64C4F7"];
  return (
    <div className="px-6 pt-4 ml-[240px] mr-[240px] mt-[45px] ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today Column */}
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-[poppins] font-bold">Today</h2>
            <p className="flex items-center text-gray-400 text-sm">{todayFormatted}</p>
          </div>
          {todayEvents.map((event, idx) => (
            <ScheduleCard key={idx} 
                event={{ ...event, badgeColor: borderColors[idx % borderColors.length] }}
             />
          ))}
        </div>

        {/* Tomorrow Column */}
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-[poppins] font-bold">Tomorrow</h2>
            <p className="flex items-center text-gray-400 text-sm">{tomorrowFormatted}</p>
          </div>
          {tomorrowEvents.map((event, idx) => (
            <ScheduleCard key={idx} 
                event={{ ...event, badgeColor: borderColors[idx % borderColors.length] }}
 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event;
