import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "@mui/material/Button";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import "../../css/animation/animation.css";
import "../../components/admin/AdminDashboard.css";
import { SidebarContext } from "./AdminLayout";
import AppsIcon from "@mui/icons-material/Apps";

const localizer = momentLocalizer(moment);

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

const initialEvents = [
  {
    title: "New Interns' Onboarding",
    start: new Date(2025, 1, 19),
    end: new Date(2025, 1, 19),
  },
  {
    title: "New Interns' Onboarding",
    start: new Date(2025, 2, 19),
    end: new Date(2025, 2, 19),
  },
];

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
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventEndDate, setEventStartDate] = useState("");
  const [eventStartDate, setEventEndDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState(initialEvents);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedChart, setSelectedChart] = useState("applications");
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [isUpcomingEventModalOpen, setIsUpcomingEventModalOpen] =
    useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: "",
  });
  const [editableEvent, setEditableEvent] = useState(null);
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventDescription("");
    setEditEvent(null);
    setOpen(false);
  };

  const handleAddEvent = () => {
    if (eventTitle && eventStartDate) {
      const newEvent = {
        title: eventTitle,
        start: new Date(eventStartDate),
        end: new Date(eventEndDate),
        description: eventDescription,
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
      handleClose();
    }
  };

  const handleSelectSlot = ({ start }) => {
    setEventStartDate(start);
    handleOpen();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowUpcomingEvents(true);
  };

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

  const sortedUpcomingEvents = events
    .map((event) => ({
      ...event,
      dateObj: new Date(event.start),
    }))
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 5);

  const handleAddEventButtonClick = () => {
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddEventModal = () => {
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "",
    });
  };

  const handleEditEvent = () => {
    setEvents(
      events.map((event) => (event === selectedEvent ? editableEvent : event))
    );
    setIsEventDetailsModalOpen(false);
    setSelectedEvent(null);
    setEditableEvent(null);
  };

  const handleUpcomingEventClick = (event) => {
    setSelectedUpcomingEvent(event);
    setIsUpcomingEventModalOpen(true);
  };

  return (
    <div className="max-h-100vh bg-white p-1">
      {/* Header */}
      <header className="container flex h-12 items-center justify-between flex-wrap">
        <div className="flex gap-4 items-center">
          <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            <AppsIcon sx={{ fontSize: "48px" }} />
          </button>
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary">
            <span className="mr-2">+</span> JOB LISTING
          </button>
          <button className="btn-primary">
            <span className="mr-2">+</span> INDUSTRY
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-2">
        <div
          // className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"

          className="flex flex-col xl:flex-row gap-5"
        >
          <div className="flex-1">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-4 md:grid-cols-2">
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
                      <p className="text-lg text-center justify-center uppercase ">
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
                      className="rounded bg-secondary p-2 text-center text-white cursor-pointer"
                      onClick={() => setSelectedChart("jobListingsOpen")}
                    >
                      <div className="text-xl font-bold">
                        {stats.jobListings.open}
                      </div>
                      <div className="text-md">Open</div>
                    </div>
                    <div
                      className="rounded bg-accent-2 p-2 text-dark text-center cursor-pointer"
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
              <div className="border p-4 rounded shadow h-140">
                <div>
                  <h2 className="text-lg font-medium">JOB APPLICATIONS</h2>
                </div>
                <div className="h-[400px]">
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
          <div className="space-y-6 flex">
            {/* Calendar */}
            <div className="border bg-accent-1 p-2 rounded shadow">
              <div className="flex flex-row items-center justify-center">
                <div className="h-[500px] w-120">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    style={{ height: 500 }}
                    dayPropGetter={(date) => {
                      const day = date.getDay();
                      if (day === 0 || day === 6) {
                        return {
                          style: {
                            backgroundColor: "#ffcccc",
                            fontStyle: "italic",
                          },
                        };
                      }
                      return {};
                    }}
                    view={view}
                    onView={(newView) => setView(newView)}
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                  />
                </div>
              </div>

              <h2 className="text-lg font-medium">Upcoming Events</h2>
              <div className="space-y-6">
                {sortedUpcomingEvents.slice(0, 3).map((event, index) => (
                  <div key={index}>
                    {index === 0 ||
                    sortedUpcomingEvents[index - 1].month !== event.month ? (
                      <h3 className="mb-2 font-medium">
                        {moment(event.start).format("MMMM")}
                      </h3>
                    ) : null}
                    <ul className="space-y-2">
                      <li className="flex gap-2 no-underline">
                        <span className="text-gray-500">•</span>
                        <span className="no-underline">
                          {moment(event.start).format("D")} - {event.title}
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
                          <h3 className="mb-2 font-medium">
                            {moment(event.start).format("MMMM")}
                          </h3>
                        ) : null}
                        <ul className="space-y-2">
                          <li className="flex gap-2 no-underline">
                            <span className="text-gray-500">•</span>
                            <span className="no-underline">
                              {moment(event.start).format("D")} - {event.title}
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

      {/* Modal for adding events */}
      {open && (
        <div className="fixed inset-0 bg-primary bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">Add Event</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Start-Date
              </label>
              <input
                type="start-date"
                className="w-full border rounded p-2"
                value={moment(eventStartDate).format("YYYY-MM-DD")}
                onChange={(e) => setEventStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End-Date</label>
              <input
                type="end-date"
                className="w-full border rounded p-2"
                value={moment(eventEndDate).format("YYYY-MM-DD")}
                onChange={(e) => setEventEndDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEvent}
              >
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
