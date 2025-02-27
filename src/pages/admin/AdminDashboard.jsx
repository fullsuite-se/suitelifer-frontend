import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import moment from "moment";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import "../../css/animation/animation.css";
import "../../css/base/theme.css";

const applicationData = [
  { month: 0, applications: 2400 },
  { month: 1, applications: 2500 },
  { month: 2, applications: 2400 },
  { month: 3, applications: 2600 },
  { month: 4, applications: 2500 },
  { month: 5, applications: 2400 },
  { month: 6, applications: 2300 },
  { month: 7, applications: 2500 },
  { month: 8, applications: 2700 },
  { month: 9, applications: 2800 },
  { month: 10, applications: 2900 },
  { month: 11, applications: 2800 },
];

const employeeData = [
  { month: 0, employees: 50 },
  { month: 1, employees: 52 },
  { month: 2, employees: 54 },
  { month: 3, employees: 56 },
  { month: 4, employees: 58 },
  { month: 5, employees: 60 },
  { month: 6, employees: 62 },
  { month: 7, employees: 64 },
  { month: 8, employees: 66 },
  { month: 9, employees: 68 },
  { month: 10, employees: 70 },
  { month: 11, employees: 72 },
];

const jobListingsData = [
  { month: 0, open: 10, closed: 5 },
  { month: 1, open: 12, closed: 6 },
  { month: 2, open: 14, closed: 7 },
  { month: 3, open: 16, closed: 8 },
  { month: 4, open: 18, closed: 9 },
  { month: 5, open: 20, closed: 10 },
  { month: 6, open: 22, closed: 11 },
  { month: 7, open: 24, closed: 12 },
  { month: 8, open: 26, closed: 13 },
  { month: 9, open: 28, closed: 14 },
  { month: 10, open: 30, closed: 15 },
  { month: 11, open: 32, closed: 16 },
];

const initialEvents = {
  February: [{ date: 19, title: "New Interns' Onboarding" }],
  March: [{ date: 19, title: "New Interns' Onboarding" }],
};

const stats = {
  employees: 52,
  applications: 917,
  jobListings: {
    total: 19,
    open: 14,
    closed: 5,
  },
};

const AdminDashboard = () => {
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState(initialEvents);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedChart, setSelectedChart] = useState("applications");
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEventTitle("");
    setEventDate("");
    setEventDescription("");
    setEditEvent(null);
    setOpen(false);
  };

  const handleAddEvent = () => {
    if (eventTitle && eventDate) {
      const eventMonth = moment(eventDate).format("MMMM");
      const eventDay = moment(eventDate).date();
      const newEvent = { date: eventDay, title: eventTitle, description: eventDescription };

      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        if (updatedEvents[eventMonth]) {
          const isDuplicate = updatedEvents[eventMonth].some(
            (event) => event.date === eventDay && event.title === eventTitle
          );
          if (!isDuplicate) {
            updatedEvents[eventMonth].push(newEvent);
          }
        } else {
          updatedEvents[eventMonth] = [newEvent];
        }
        return updatedEvents;
      });

      handleClose();
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      description: clickInfo.event.extendedProps.description,
    });
    setShowUpcomingEvents(true);
  };

  const calendarEvents = Object.entries(events).flatMap(
    ([month, monthEvents]) =>
      monthEvents.map((event) => ({
        title: event.title,
        date: moment(`${month} ${event.date}, 2025`).format("YYYY-MM-DD"),
        description: event.description,
      }))
  );

  const getChartData = () => {
    switch (selectedChart) {
      case "employees":
        return employeeData;
      case "jobListingsOpen":
        return jobListingsData.map((data) => ({
          month: data.month,
          value: data.open,
        }));
      case "jobListingsClosed":
        return jobListingsData.map((data) => ({
          month: data.month,
          value: data.closed,
        }));
      default:
        return applicationData;
    }
  };

  const sortedUpcomingEvents = Object.entries(events)
    .flatMap(([month, monthEvents]) =>
      monthEvents.map((event) => ({
        ...event,
        month,
        dateObj: moment(`${month} ${event.date}, 2025`).toDate(),
      }))
    )
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 5);

  return (
    <div className="max-h-screen bg-white p-2">
      {/* Header */}
      <header className="">
        <div className="container flex h-16 items-center justify-between">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
          <div className="flex gap-2">
            <button className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded">
              <span className="mr-2">+</span> JOB LISTING
            </button>
            <button className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded">
              <span className="mr-2">+</span> INDUSTRY
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-2">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column - Stats and Chart */}
          <div className="col-span-2">
            <div className="grid gap-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Employee Stats */}
                  <div
                    className="border p-4 rounded-2xl shadow cursor-pointer bg-primary text-white"
                    onClick={() => setSelectedChart("employees")}
                  >
                    <div className="pb-2">
                      <h2 className="text-4xl text-center font-bold">
                        {stats.employees}
                      </h2>
                    </div>
                    <div>
                      <p className="text-lg text-center uppercase">
                        TOTAL EMPLOYEE ACCOUNTS
                      </p>
                    </div>
                  </div>

                  {/* Applications Stats */}
                  <div
                    className="border p-4 rounded-2xl shadow cursor-pointer bg-primary text-white"
                    onClick={() => setSelectedChart("applications")}
                  >
                    <div className="pb-2">
                      <h2 className="text-4xl text-center font-bold">
                        {stats.applications}
                      </h2>
                    </div>
                    <div>
                      <p className="text-lg text-center uppercase">
                        TOTAL APPLICATIONS
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Listings Stats */}
                <div
                  className="border p-4 rounded-2xl shadow cursor-pointer bg-primary text-white"
                  onClick={() => setSelectedChart("jobListingsOpen")}
                >
                  <div className="pb-2">
                    <h2 className="text-2xl text-center font-bold">
                      {stats.jobListings.total}
                    </h2>
                    <p className="text-lg text-center uppercase">
                      TOTAL JOB LISTINGS
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded bg-green-200 p-2 text-center text-black cursor-pointer"
                      onClick={() => setSelectedChart("jobListingsOpen")}
                    >
                      <div className="text-xl font-bold">
                        {stats.jobListings.open}
                      </div>
                      <div className="text-md">Open</div>
                    </div>
                    <div
                      className="rounded bg-gray-400 p-2 text-black text-center cursor-pointer"
                      onClick={() => setSelectedChart("jobListingsClosed")}
                    >
                      <div className="text-xl font-bold">
                        {stats.jobListings.closed}
                      </div>
                      <div className="text-md">Closed</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Applications Chart */}
              <div className="border p-4 rounded shadow ">
                <div>
                  <h2 className="text-lg font-medium">JOB APPLICATIONS</h2>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData()}>
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value + 1}`}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickCount={8}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Area
                        type="monotone"
                        dataKey={
                          selectedChart === "applications"
                            ? "applications"
                            : "value"
                        }
                        stroke="rgb(165, 184, 145)"
                        fill="rgb(165, 184, 145)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar and Events */}
          <div className="space-y-6 relative">
            {/* Calendar */}
            <div className="border p-4 rounded shadow h-full">
              <div className="flex flex-row items-center justify-center">
                <div className="h-[500px] w-120 overflow-hidden">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    views={{
                      dayGridMonth: {
                        buttonText: "Month",
                        dayMaxEventRows: 6,
                      },
                    }}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth",
                    }}
                    height="100%"
                    events={calendarEvents}
                    eventClick={handleEventClick}
                    dateClick={(info) => {
                      setEventDate(info.dateStr);
                      handleOpen();
                    }}
                    dayCellClassNames={(date) => {
                      const day = date.date.getDay();
                      let classNames = "no-underline text-center";
                      if (day === 0) classNames += " sunday";
                      if (day === 6) classNames += " saturday";
                      return classNames;
                    }}
                  />
                </div>
              </div>

              <h2 className="text-lg font-medium">Upcoming Events</h2>
              <div className="space-y-6">
                {sortedUpcomingEvents.slice(0, 3).map((event, index) => (
                  <div key={index}>
                    {index === 0 ||
                    sortedUpcomingEvents[index - 1].month !== event.month ? (
                      <h3 className="mb-2 font-medium">{event.month}</h3>
                    ) : null}
                    <ul className="space-y-2">
                      <li className="flex gap-2 no-underline">
                        <span className="text-gray-500">•</span>
                        <span className="no-underline">
                          {event.date} - {event.title}
                        </span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Overlay */}
            {showUpcomingEvents && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center animate-slideInRight z-50">
                <div className="border p-4 rounded shadow w-96">
                  <div>
                    <h2 className="text-lg font-medium">Upcoming Events</h2>
                  </div>
                  <div className="space-y-2">
                    {sortedUpcomingEvents.map((event, index) => (
                      <div key={index}>
                        {index === 0 ||
                        sortedUpcomingEvents[index - 1].month !==
                          event.month ? (
                          <h3 className="mb-2 font-medium">{event.month}</h3>
                        ) : null}
                        <ul className="space-y-2">
                          <li className="flex gap-2 no-underline">
                            <span className="text-gray-500">•</span>
                            <span className="no-underline">
                              {event.date} - {event.title}
                            </span>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowUpcomingEvents(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Adding or Editing Events */}
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-container p-6 bg-white rounded-lg w-full sm:w-96 mx-auto mt-24">
          <h2 className="font-semibold mb-4 text-lg text-center bg-primary">
            {editEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <TextField
            label="Event Title"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <TextField
            type="date"
            fullWidth
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-2"
          />
          <TextField
            label="Description"
            fullWidth
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="mt-2"
          />
          <div className="mt-6 flex justify-between">
            <Button onClick={handleClose} className="btn-light">
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              variant="contained"
              color="primary"
              className="btn-primary"
            >
              {editEvent ? "Save Changes" : "Add Event"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminDashboard;