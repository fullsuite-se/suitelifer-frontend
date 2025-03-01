import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const events = {
  "2025-02-13": true,
  "2025-02-25": true,
  "2025-02-27": true,
  "2025-02-28": true,
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));


  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-600"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600"
        >
          &gt;
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-center font-medium text-gray-600">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 text-center">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          return (
            <div
              key={day}
              className={`py-2 relative ${
                isCurrentMonth ? "text-black" : "text-gray-400"
              }`}
            >
              {format(day, "d")}
              {events[format(day, "yyyy-MM-dd")] && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-cyan-600 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
