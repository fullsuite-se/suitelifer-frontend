import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, onSelectSlot, onSelectEvent }) => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <>
      Navigation Controls
      <div className="flex w-full flex-wrap justify-between items-center gap-2">
        <button
          className="btn-light p-2 flex w-full md:w-auto text-center justify-center"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>

        <div className="flex w-full md:w-auto items-center justify-center gap-2">
          <button
            className="btn-light flex px-3 py-2"
            onClick={() => onNavigate("PREV")}
          >
            ◀
          </button>

          <span className="font-avenir-black text-primary font-bold text-lg md:text-2xl truncate text-center">
            {label}
          </span>

          <button
            className="btn-light flex px-3 py-2"
            onClick={() => onNavigate("NEXT")}
          >
            ▶
          </button>
        </div>

        <select
          className="btn-light w-full md:w-auto text-center"
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
    </>
  );

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor={(event) => moment.utc(event.start).local().toDate()}
      endAccessor={(event) => moment.utc(event.end).local().toDate()}
      titleAccessor="title"
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      style={{ height: 600, width: "100%" }}
      eventPropGetter={(event) => {
        const eventDate = new Date(event.start).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        const isWeekend =
          new Date(event.start).getDay() === 0 ||
          new Date(event.start).getDay() === 6;
        const isToday = eventDate === today;

        return {
          style: {
            backgroundColor: isToday
              ? "#30ABC1"
              : isWeekend
              ? "#bfd1a0"
              : "#007a8e",
            color: isToday ? "#ffffff" : isWeekend ? "#000000" : "#000000",
            border: "none",
          },
        };
      }}
      dayPropGetter={(date) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const isToday = date.setHours(0, 0, 0, 0) === today;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        return {
          style: {
            backgroundColor: isToday ? "#007a8e" : "inherit",
            color: isToday ? "white" : isWeekend ? "#0097b2" : "inherit",
          },
        };
      }}
      components={{ toolbar: CustomToolbar }}
      view={view}
      onView={setView}
      date={date}
      onNavigate={setDate}
    />
  );
};

export default EventCalendar;
