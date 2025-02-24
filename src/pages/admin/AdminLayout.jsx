import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Sidebar from "../../components/Sidebar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEventTitle("");
    setEventDate("");
    setEditEvent(null);
    setOpen(false);
  };

  const handleAddEvent = () => {
    if (eventTitle && eventDate) {
      if (editEvent) {
        setEvents(
          events.map((event) =>
            event.id === editEvent.id
              ? { ...event, title: eventTitle, date: eventDate }
              : event
          )
        );
      } else {
        setEvents([
          ...events,
          { id: Date.now(), title: eventTitle, date: eventDate },
        ]);
      }
      handleClose();
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
    });
  };

  return (
    <div className="flex w-full h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-10"></header>

        <div className="flex w-full bg-white">
          <button className="btn-primary w-40 h-10" onClick={handleOpen}>
            + Event
          </button>
          {/* Calendar Section */}
          <section className="bg-white p-8 rounded-lg shadow-md w-full lg:w-1/2 mx-auto">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
            />
          </section>

          {/* Selected Event Info */}
          {selectedEvent && (
            <section className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold">Upcoming Event</h3>
              <p className="text-md mt-2">
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p className="text-md">
                <strong>Date:</strong> {selectedEvent.date}
              </p>
            </section>
          )}
        </div>

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
    </div>
  );
};

export default AdminLayout;
