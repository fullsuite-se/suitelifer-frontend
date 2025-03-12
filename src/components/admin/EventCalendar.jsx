import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, onSelectSlot, onSelectEvent }) => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="p-2 w-full bg-primary flex gap-5">
      {/* Left Navigation Buttons */}
      <div className="flex space-x-2 justify-between w-250 items-center">
        <div className="flex">
          <button className="btn-light" onClick={() => onNavigate("TODAY")}>
            Today
          </button>
        </div>
        <div className="flex justify-between w-full">
          <button className="btn-light" onClick={() => onNavigate("PREV")}>
            ◀ Prev
          </button>
          <span className="font-avenir-black text-4xl items-center">
            {label}
          </span>
          <button className="btn-light" onClick={() => onNavigate("NEXT")}>
            Next ▶
          </button>
        </div>
      </div>

      {/* View Selection Dropdown */}
      <select
        className="btn-light"
        value={view}
        onChange={(e) => {
          const newView = e.target.value;
          setView(newView); 
          onView(newView);
        }}
      >
        <option value={Views.MONTH}>Month</option>
        <option value={Views.WEEK}>Week</option>
        <option value={Views.DAY}>Day</option>
        <option value={Views.AGENDA}>Agenda</option>
      </select>
    </div>
  );

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      style={{ height: 680, width: "100%" }}
      dayPropGetter={(date) => ({
        style:
          date.getDay() === 0 || date.getDay() === 6
            ? { backgroundColor: "#ffcccc" }
            : {},
      })}
      components={{ toolbar: CustomToolbar }}
      view={view}
      onView={setView}
      date={date}
      onNavigate={setDate}
    />
  );
};

export default EventCalendar;
