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
  isSameDay,
} from "date-fns";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const events = {
  "2025-02-13": true,
  "2025-02-25": true,
  "2025-02-27": true,
  "2025-02-28": true,
  "2025-03-01": true,
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="w-full max-w-md mx-auto rounded-lg">
      <div className="flex justify-between items-center mb-4 px-5">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-600 cursor-pointer"
        >
          <ChevronLeftIcon className="text-gray-500 w-5 h-5" />
        </button>
        <span className="text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600 cursor-pointer"
        >
          <ChevronRightIcon className="text-gray-500 w-5 h-5" />
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
              className={`grid place-items-center w-9 h-9 relative rounded-full ${
                isCurrentMonth ? "text-black" : "text-gray-300"
              } ${isSameDay(day, new Date()) && "bg-primary text-white"}
              `}
            >
              {format(day, "d")}
              {events[format(day, "yyyy-MM-dd")] && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
              )}
              {isSameDay(day, new Date()) &&
                events[format(day, "yyyy-MM-dd")] && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
