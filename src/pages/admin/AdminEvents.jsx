import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CalendarIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import EventCalendar from "./../../components/admin/EventCalendar";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import EventIcon from "@mui/icons-material/Event";

const AdminEvents = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: "",
  });

  const handleSelectSlot = ({ start }) => {
    if (
      new Date(start).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      setOpenDialog(true);
      return;
    }
    setIsEditing(false);
    setNewEvent({
      title: "",
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000),
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddEvent = () => {
    if (isEditing) {
      // Update the existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.start === selectedEvent.start ? newEvent : event
        )
      );
      setIsEditing(false);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }
    setIsAddModalOpen(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "",
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleEditEvent = () => {
    setNewEvent(selectedEvent);
    setIsEditing(true);
    setIsEventDetailsModalOpen(false);
    setIsAddModalOpen(true);
  };

  return (
    <div className="bg-white p-2">
      <header className="container flex h-12 items-center justify-between flex-wrap">
        <div className="flex">
          {/* Button for desktop */}
          <button
            className="hidden cursor-pointer sm:block px-3 py-2 rounded-md border border-gray-200 bg-gray-100"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Event
          </button>

          {/* Icon Button for Mobile */}
        </div>
      </header>

      <TextField
        label="Search Events"
        fullWidth
        margin="normal"
        className="border border-gray-200"
      />

      <div className="flex gap-8 mt-4 h-full">
        <div className="bg-white border border-gray-200 rounded-md p-4 w-full">
          <EventCalendar
            events={events}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
            eventPropGetter={(event) => ({
              className: "custom-event",
            })}
            dayPropGetter={(date) => {
              const today = new Date();
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return isToday ? { className: "custom-today" } : {};
            }}
            // style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>

      {/* Invalid Date Selection Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invalid Date Selection</DialogTitle>
        <DialogContent>
          You can only add events from today onwards.
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenDialog(false)} className="btn-primary">
            OK
          </button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Event Modal */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
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
            width: "450px",
          }}
        >
          <Typography variant="h5" mb={2} className="text-center font-bold">
            {isEditing ? "Edit Event" : "Add New Event"}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Start Date"
            type="datetime-local"
            value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: new Date(e.target.value) })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="End Date"
            type="datetime-local"
            value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) =>
              setNewEvent({ ...newEvent, end: new Date(e.target.value) })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn-light"
            >
              Cancel
            </button>
            <button onClick={handleAddEvent} className="btn-primary">
              {isEditing ? "Update Event" : "Add Event"}
            </button>
          </Box>
        </Box>
      </Modal>

      {/* Event Details Modal */}
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
          {selectedEvent && (
            <>
              <div className="flex flex-col gap-y-4 items-start">
                <Typography
                  variant="h5"
                  align="center"
                  fontWeight="bold"
                  color="#0097b2"
                >
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
              </div>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <button
                  onClick={() => setIsEventDetailsModalOpen(false)}
                  className="btn-light"
                >
                  Close
                </button>
                <button onClick={handleEditEvent} className="btn-primary mr-2">
                  Edit
                </button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminEvents;
