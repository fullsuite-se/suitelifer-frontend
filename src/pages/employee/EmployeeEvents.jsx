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
// addded
import { Modal, Box, Typography } from "@mui/material";
//
//
const EmployeeEvents = () => {
  const [isComingSoon, setComingSoon] = useState(true); //Change this when the page is ready.
  //added
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  //end
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
      {selectedEvent && (
        <Modal
          open={isEventDetailsModalOpen}
          onClose={() => setIsEventDetailsModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 4,
              bgcolor: "white",
              borderRadius: 1,
              boxShadow: 24,
              width: "400px",
            }}
          >
            <Typography variant="h6" className="font-bold text-primary mb-2">
              {selectedEvent.title}
            </Typography>
            <Typography>
              <strong>Start:</strong>{" "}
              {moment(selectedEvent.start).format("MMMM D, YYYY h:mm A")}
            </Typography>
            <Typography>
              <strong>End:</strong>{" "}
              {moment(selectedEvent.end).format("MMMM D, YYYY h:mm A")}
            </Typography>
            <Typography>
              <strong>Description:</strong>{" "}
              {selectedEvent.description || "No description"}
            </Typography>
            <Typography>
              <strong>Drive Link:</strong>{" "}
              {selectedEvent.gdrive_link ? (
                <a
                  href={selectedEvent.gdrive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedEvent.gdrive_link}
                </a>
              ) : (
                "No link provided"
              )}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <button
                onClick={() => setIsEventDetailsModalOpen(false)}
                className="btn-light"
              >
                Close
              </button>
            </Box>
          </Box>
        </Modal>
      )}

      <div className="bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Events Calendar</h2>
        <div className="border border-gray-200 rounded-md p-4">
          <EventCalendar
            events={events}
            // onSelectEvent={(event) => {
            //   alert(`Event: ${event.title}`);
            // }}
            onSelectEvent={handleEventClick}
            eventPropGetter={() => ({
              className: "custom-event",
            })}
            // eventPropGetter={() => ({
            //   style: {
            //     backgroundColor: "#2563eb",
            //     color: "white",
            //     padding: "4px",
            //     borderRadius: "4px",
            //   },
            // })}
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
