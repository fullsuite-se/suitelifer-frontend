import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import { SidebarContext } from "./AdminLayout";
import AppsIcon from "@mui/icons-material/Apps";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EventCalendar from "./../../components/admin/EventCalendar";
import moment from "moment";

const AdminEvents = () => {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    description: "",
  });

  useEffect(() => {
    setUpcomingEvents(
      events.filter((event) => new Date(event.start) >= new Date())
    );
  }, [events]);

  const handleSelectSlot = ({ start }) => {
    if (
      new Date(start).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      setOpenDialog(true);
      return;
    }
    setNewEvent({
      ...newEvent,
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000),
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

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  return (
    <div className="bg-white p-2">
      <header className="flex justify-between items-center h-16">
        <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
          <AppsIcon sx={{ fontSize: "48px" }} />
        </button>
        <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + EVENT
        </button>
      </header>

      <TextField label="Search Events" fullWidth margin="normal" />

      <div className="flex gap-8">
        <div className="bg-white shadow-lg rounded-lg p-4 w-300">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <EventCalendar
              events={events}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
              onAddEvent={() => setIsAddModalOpen(true)}
            />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mt-6">
          <Typography variant="h4">Upcoming Events</Typography>
          <List>
            {upcomingEvents
              .sort((a, b) => new Date(a.start) - new Date(b.start))
              .slice(0, 5)
              .map((event, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleEventClick(event)}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={moment(event.start).format(
                      "MMMM Do YYYY, h:mm a"
                    )}
                  />
                </ListItem>
              ))}
            {upcomingEvents.length === 0 && (
              <Typography>No upcoming events.</Typography>
            )}
          </List>
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

      {/* Add Event Modal */}
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
            width:"300px"
          }}
        >
          <Typography variant="h5" mb={2} className="text-center text-primary font-bold">
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
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn-light"
            >
              Cancel
            </button>
            <button onClick={handleAddEvent} className="btn-primary">
              Add Event
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
            minWidth: 300,
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6" className="font-bold text-primary">
                Event Details
              </Typography>
              <Typography variant="body1" className="mt-3">
                <strong>Title:</strong> {selectedEvent.title}
              </Typography>
              <Typography variant="body1">
                <strong>Date & Time:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")} -{" "}
                {moment(selectedEvent.end).format("h:mm a")}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong>{" "}
                {selectedEvent.description || "No description provided."}
              </Typography>
              <div className="flex flex-end justify-end">
                <button
                  onClick={() => setIsEventDetailsModalOpen(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminEvents;
