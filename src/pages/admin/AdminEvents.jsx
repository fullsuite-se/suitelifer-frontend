import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [isUpcomingEventModalOpen, setIsUpcomingEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editableEvent, setEditableEvent] = useState(null);
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start,
      end,
    });
    setIsAddModalOpen(true);
  };

  const handleAddEventButtonClick = () => {
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "",
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditableEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleEditEvent = () => {
    setEvents(events.map(event => event === selectedEvent ? editableEvent : event));
    setIsEventDetailsModalOpen(false);
    setSelectedEvent(null);
    setEditableEvent(null);
  };

  const handleNavigate = (action) => {
    const newDate = Calendar.momentLocalizer(moment).navigate(date, action);
    setDate(newDate);
  };

  const handleUpcomingEventClick = (event) => {
    setSelectedUpcomingEvent(event);
    setIsUpcomingEventModalOpen(true);
  };

  return (
    <div className="bg-white p-2">
      <header className="container flex h-16 items-center justify-between">
        <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        <div className="flex gap-2">
          <Button
            variant="outlined"
            sx={{ bgcolor: "#0097b2", color: "#ffffff" }}
            onClick={handleAddEventButtonClick}
          >
            <span className="mr-2">+</span> EVENT
          </Button>
        </div>
      </header>
      <div className="p-4">
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
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New Event
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
            <Button onClick={() => setIsAddModalOpen(false)} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              variant="contained"
              color="primary"
            >
              Add Event
            </Button>
          </Box>
        </Box>
      </Modal>
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
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          {editableEvent && (
            <>
              <Typography variant="h6" mb={2}>
                Edit Event
              </Typography>
              <TextField
                fullWidth
                label="Title"
                value={editableEvent.title}
                onChange={(e) =>
                  setEditableEvent({ ...editableEvent, title: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={moment(editableEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setEditableEvent({ ...editableEvent, start: new Date(e.target.value) })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={moment(editableEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setEditableEvent({ ...editableEvent, end: new Date(e.target.value) })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editableEvent.description}
                onChange={(e) =>
                  setEditableEvent({ ...editableEvent, description: e.target.value })
                }
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => setIsEventDetailsModalOpen(false)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditEvent}
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={isUpcomingEventModalOpen}
        onClose={() => setIsUpcomingEventModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          {selectedUpcomingEvent && (
            <>
              <Typography variant="h6" mb={2}>
                Upcoming Event Details
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>Title:</strong> {selectedUpcomingEvent.title}
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>Start:</strong> {moment(selectedUpcomingEvent.start).format("MMMM Do YYYY, h:mm a")}
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>End:</strong> {moment(selectedUpcomingEvent.end).format("MMMM Do YYYY, h:mm a")}
              </Typography>
              <Typography variant="body1" mb={2}>
                <strong>Description:</strong> {selectedUpcomingEvent.description}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => setIsUpcomingEventModalOpen(false)}
                  variant="contained"
                  color="primary"
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <div className="p-4">
        <Typography variant="h6">Upcoming Events</Typography>
        <List>
          {events
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 4)
            .map((event, index) => (
              <ListItem button key={index} onClick={() => handleUpcomingEventClick(event)}>
                <ListItemText
                  primary={event.title}
                  secondary={`${moment(event.start).format(
                    "MMMM Do YYYY, h:mm a"
                  )} - ${moment(event.end).format("MMMM Do YYYY, h:mm a")}`}
                />
              </ListItem>
            ))}
        </List>
      </div>
    </div>
  );
};

export default AdminEvents;