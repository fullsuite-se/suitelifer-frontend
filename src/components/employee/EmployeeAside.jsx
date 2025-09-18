import React, { useEffect, useState } from "react";
import Calendar from "../cms/Calendar";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import EventCard from "../events/EventCard";
import api from "../../utils/axios";
import { format, parseISO, isValid } from "date-fns";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { Modal, Box, Typography } from "@mui/material";

const EmployeeAside = () => {
  // Added for modal

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);

    console.log("Tapped:", event);
  };

  //
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [todayEventCount, setTodayEventCount] = useState(0);
  const [upcomingEventCount, setUpcomingEventCount] = useState(0);
  const [showTodayEvent, setShowTodayEvent] = useState(
    JSON.parse(localStorage.getItem("showTodayEvent")) ?? true
  );
  const [showUpcomingEvent, setShowUpcomingEvent] = useState(
    JSON.parse(localStorage.getItem("showUpcomingEvent")) ?? false
  );
  const [loading, setLoading] = useState(false);

  const toIso = (dateTime) => dateTime.replace(" ", "T") + "Z";

  const [todayEvents, setTodayEvents] = useState([]);

  const fetchTodayEvents = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");

      const response = await api.get(`/api/events/today?today=${today}`);

      setTodayEvents(response.data.todayEvents);
    } catch (err) {
      console.log("Error fetching today's events:", err);
    }
  };

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchUpcomingEvents = async () => {
    try {
      const today = moment().format("YYYY-MM-DD");

      const response = await api.get("/api/events/upcoming", {
        today,
      });

      setUpcomingEvents(response.data.upcomingEvents);
    } catch (err) {
      console.log("Error fetching upcoming events:", err);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/events");
        setEvents(response.data.events);

        const dates = response.data.events.reduce((acc, current) => {
          const dateRaw = current.start;

          if (typeof dateRaw === "string") {
            const parsedDate = parseISO(dateRaw);

            if (isValid(parsedDate)) {
              const formattedDate = format(parsedDate, "yyyy-MM-dd");
              acc.push(formattedDate);
            } else {
              console.warn("Invalid parsed date:", dateRaw);
            }
          } else {
            console.warn("Missing or non-string date:", dateRaw);
          }

          return acc;
        }, []);

        setEventDates(dates);

        const today = new Date().toISOString().split("T")[0];
        const todayCount = dates.filter((date) => date !== today).length;
        setTodayEventCount(todayCount);
        const upcomingCount = dates.filter((date) => date === today).length;
        setUpcomingEventCount(upcomingCount);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };

    fetchEvents();
    fetchTodayEvents();
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      const showToday =
        JSON.parse(localStorage.getItem("showTodayEvent")) ?? true;
      const showUpcoming =
        JSON.parse(localStorage.getItem("showUpcomingEvent")) ?? false;
      setShowTodayEvent(showToday);
      setShowUpcomingEvent(showUpcoming);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTodayDisclosureBtn = () => {
    const updatedShowToday = !showTodayEvent;
    localStorage.setItem("showTodayEvent", updatedShowToday);
    setShowTodayEvent(updatedShowToday);
  };

  const handleUpcomingDisclosureBtn = () => {
    const updatedShowUpcoming = !showUpcomingEvent;
    localStorage.setItem("showUpcomingEvent", updatedShowUpcoming);
    setShowUpcomingEvent(updatedShowUpcoming);
  };

  const location = useLocation();
  const hideCalendar = location.pathname.includes("company-events");
  //added
  const hideCalendarforAdmin = location.pathname.includes("events");

  if (loading) return null;
  if (hideCalendar) return null;
  if (hideCalendarforAdmin) return null;

  return (
    <aside className="w-52 md:w-64 lg:w-72 h-dvh flex flex-col p-2 xl:p-3">
      <section className="flex justify-between items-baseline">
        <h2 className="font-avenir-black">Events</h2>
      </section>

      {<Calendar eventDates={eventDates} />}

      <section className="mt-5">
        <div className="w-full">
          <div className="">
            {/* Today's Events */}
            <Disclosure as="div" defaultOpen={showTodayEvent}>
              <DisclosureButton
                className="group flex w-full items-center justify-between"
                onClick={handleTodayDisclosureBtn}
              >
                <p className="font-avenir-black text-primary">
                  Today ({todayEvents.length})
                </p>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-3 flex flex-col gap-3">
                {todayEvents.map((event, index) => (
                  <div key={index}>
                    {/* Added for modal */}
                    {/* <EventCard event={event} /> */}
                    <EventCard
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  </div>
                ))}
              </DisclosurePanel>
            </Disclosure>

            {/* Upcoming Events */}
            <Disclosure as="div" defaultOpen={showUpcomingEvent}>
              <DisclosureButton
                className="group my-3 flex w-full items-center justify-between"
                onClick={handleUpcomingDisclosureBtn}
              >
                <p className="font-avenir-black text-black">
                  Upcoming ({upcomingEvents.length})
                </p>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-3 flex flex-col gap-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index}>
                    {/* <EventCard event={event} />
                     */}
                    <EventCard
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  </div>
                ))}
              </DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      </section>
      {selectedEvent && (
        <Modal
          open={isEventDetailsModalOpen}
          onClose={() => setIsEventDetailsModalOpen(false)}
          BackdropProps={{
            onClick: () => setIsEventDetailsModalOpen(false),
            style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          }}
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
              {selectedEvent.gdriveLink ? (
                <a
                  href={selectedEvent.gdriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {selectedEvent.gdriveLink}
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
    </aside>
  );
};

export default EmployeeAside;
