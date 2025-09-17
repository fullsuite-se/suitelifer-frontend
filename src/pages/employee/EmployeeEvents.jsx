// import React from "react";
import { useState } from "react";
import { CalendarDaysIcon, Clock } from "lucide-react";
import ComingSoon from "../admin/ComingSoon";
// --added
import React, { useEffect } from "react";
import moment from "moment";
import EventCalendar from "../../components/admin/EventCalendar";
import api from "../../utils/axios";
// import ComingSoon from "./ComingSoon";
//
const EmployeeEvents = () => {
  const [isComingSoon, setComingSoon] = useState(true); //Change this when the page is ready.
  //added
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events");
      const rawEvents = response.data.events;
      const adjustedEvents = rawEvents.map((event) => ({
        ...event,
        start: moment.utc(event.start).local().toDate(),
        end: moment.utc(event.end).local().toDate(),
      }));
      setEvents(adjustedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  //

  if (isComingSoon) {
    // return <ComingSoon />;
  }
  return (
    // <section className="p-5 border border-primary rounded-2xl flex flex-col gap-4 mb-25">
    //   <div className="">
    //     <label className="text-sm text-gray-500">DATE</label>
    //     <p className="text-primary font-avenir-black flex gap-2">
    //       {" "}
    //       <span>
    //         <CalendarDaysIcon className="size-5" />
    //       </span>
    //       April 02, 2025
    //     </p>
    //   </div>
    //   <div className="">
    //     <label className="text-sm text-gray-500">TIME</label>
    //     <p className="text-primary font-avenir-black flex gap-2">
    //       <span>
    //         <Clock className="size-5" />
    //       </span>{" "}
    //       7:00 AM - 6:00 PM
    //     </p>
    //   </div>
    //   <div className="">
    //     <label className="text-sm text-gray-500">EVENT TITLE</label>
    //     <p className="font-avenir-black text-xl">Sports Fest 2025</p>
    //   </div>
    //   <div className="">
    //     <label className="text-sm text-gray-500">DESCRIPTION</label>
    //     <p className="">
    //       Get ready for an action-packed day of competition, teamwork, and fun
    //       at Sports Fest 2025! This annual company-wide event is designed to
    //       bring employees together through friendly matches, exciting
    //       challenges, and a celebration of sportsmanship. Whether you're an
    //       athlete, a casual player, or just there to cheer for your team,
    //       there's something for everyone! The event will feature a variety of
    //       sports and activities, including basketball, volleyball, relay races,
    //       and fun games to ensure that all employees, regardless of skill level,
    //       can participate. Teams will compete for trophies, medals, and special
    //       prizes, but most importantly, for the glory of teamwork and
    //       camaraderie. Aside from the games, there will be food stalls, music,
    //       and designated relaxation areas for those who want to take a break and
    //       enjoy the festive atmosphere. The day will conclude with an awarding
    //       ceremony, recognizing the best teams and outstanding individual
    //       performances. Join us as we promote wellness, unity, and a strong
    //       company culture through the spirit of sports! Mark your calendars and
    //       start preparing—Sports Fest 2025 is coming soon! <br />
    //       <br />
    //       📍 Venue: FullSuite Covered Court <br />
    //       👕 Dress Code: Sportswear / Team Colors <br />
    //       <br />
    //       Stay tuned for team assignments, schedules, and additional details.
    //       Let's make this event a memorable one! 🏆🔥
    //     </p>
    //   </div>
    // </section>
    <div>
      <div className="bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Events Calendar</h2>
        <div className="border border-gray-200 rounded-md p-4">
          <EventCalendar
            events={events}
            dayPropGetter={(date) => {
              const today = new Date();
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return isToday ? { className: "custom-today" } : {};
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeEvents;
