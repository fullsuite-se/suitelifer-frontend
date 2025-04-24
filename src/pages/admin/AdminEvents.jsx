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
import moment from "moment";
import EventCalendar from "../../components/admin/EventCalendar";
import ContentButtons from "../../components/admin/ContentButtons";
import ComingSoon from "./ComingSoon";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";

const AdminEvents = () => {
  const user = useStore((state) => state.user);

  const [isComingSoon, setComingSoon] = useState(false); // Set to true if still in development
  const [openDialog, setOpenDialog] = useState(false);

  const [events, setEvents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const defaultEventDetails = {
    eventId: null,
    title: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    description: "",
  };

  const [eventDetails, setEventDetails] = useState(defaultEventDetails);

  const handleEventChange = (e, isDate) => {
    setEventDetails((ne) => ({
      ...ne,
      [e.target.name]: isDate ? new Date(e.target.value) : e.target.value,
    }));
    console.log(eventDetails);
  };

  useEffect(() => {
    // Example fetch on mount
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/events");

        console.log("events:", response.data.events);

        setEvents(response.data.events);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start }) => {
    console.log("clicked");
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const selected = new Date(start);
    selected.setHours(0, 0, 0, 0);
  
    if (selected < today) {
      setOpenDialog(true);
      return;
    }
  
    const eventStart = new Date(start);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
  
    setEventDetails({
      title: "",
      start: eventStart,
      end: eventEnd,
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddEditEvent = async () => {
    try {
      if (!eventDetails.eventId) {
        const response = await api.post("/api/events/", {
          ...eventDetails,
          userId: user.id,
        });

        if (response.data.success) {
          toast.success(response.data.message);
        }
      } else {
        const response = await api.put(`/api/events/${selectedEvent.id}`, {
          ...eventDetails,
          userId: user.id,
        });

        if (response.data.success) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      toast.error(`Encountered a problem while ${eventDetails.eventId ? "updating" : "adding"} the event.`)
      console.error("Error saving event:", error);
    } finally {
      setIsAddModalOpen(false);
      setEventDetails(defaultEventDetails);
    }
  };

  const handleEventClick = (event) => {
    setEventDetails(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleEditEvent = () => {
    setEventDetails(selectedEvent);
    setIsEditing(true);
    setIsEventDetailsModalOpen(false);
    setIsAddModalOpen(true);
  };

  if (isComingSoon) return <ComingSoon />;

  return (
    <div className="bg-white p-2">
      <div className="flex justify-end gap-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Event"
          handleClick={() => {
            setEventDetails({
              title: "",
              start: new Date(),
              end: new Date(new Date().getTime() + 60 * 60 * 1000),
              description: "",
            });
            setIsEditing(false);
            setIsAddModalOpen(true);
          }}
        />
      </div>

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
          />
        </div>
      </div>

      {/* Invalid Date Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invalid Date Selection</DialogTitle>
        <DialogContent>
          You can only add events from today onward.
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenDialog(false)} className="btn-primary">
            OK
          </button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Modal */}
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
            name="title"
            value={eventDetails.title}
            onChange={(e) => handleEventChange(e, false)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Start Date"
            type="datetime-local"
            value={moment(eventDetails.start).format("YYYY-MM-DDTHH:mm")}
            name="start"
            onChange={(e) => handleEventChange(e, true)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="End Date"
            type="datetime-local"
            value={moment(eventDetails.end).format("YYYY-MM-DDTHH:mm")}
            name="end"
            onChange={(e) => handleEventChange(e, true)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={eventDetails.description}
            name="description"
            onChange={(e) => handleEventChange(e, false)}
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn-light"
            >
              Cancel
            </button>
            <button onClick={handleAddEditEvent} className="btn-primary">
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
                <Typography variant="h5" className="text-primary font-bold">
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 1,
                }}
              >
                <button
                  onClick={() => setIsEventDetailsModalOpen(false)}
                  className="btn-light"
                >
                  Close
                </button>
                <button onClick={handleEditEvent} className="btn-primary">
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
