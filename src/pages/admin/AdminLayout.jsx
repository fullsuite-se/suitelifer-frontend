import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Sidebar from "../../components/AdminSidebar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Line } from "react-chartjs-2";
import { Link, Outlet } from "react-router-dom";
import image_02 from "../../assets/images/image_02.svg";

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

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Applications",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
