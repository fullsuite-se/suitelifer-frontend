import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, onSelectSlot, onSelectEvent }) => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className=" flex justify-between items-center p-2">
      {/* Left Navigation Buttons */}
      <div className="flex items-center space-x-2 ">
        <button className="btn-light" onClick={() => onNavigate("PREV")}>
          ◀ Back
        </button>
        <span className="font-bold text-xl">{label}</span>
        <button className="btn-light" onClick={() => onNavigate("NEXT")}>
          Next ▶
        </button>
      </div>

      {/* View Selection Buttons */}
      <div className="space-x-2">
        <button className="btn-light" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button className="btn-light" onClick={() => onView(Views.MONTH)}>
          Month
        </button>
        <button className="btn-light" onClick={() => onView(Views.WEEK)}>
          Week
        </button>
        <button className="btn-light" onClick={() => onView(Views.DAY)}>
          Day
        </button>
        <button className="btn-light" onClick={() => onView(Views.AGENDA)}>
          Agenda
        </button>
      </div>
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
