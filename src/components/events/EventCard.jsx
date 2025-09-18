import React from "react";
import { ListBulletIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
//added yung onClick
const EventCard = ({ event, onClick }) => {
  const dayAbbreviation = format(new Date(event.start), "EEE");
  const dayOfMonth = format(new Date(event.start), "d");

  return (
    <section
      //added to have click function
      onClick={onClick}
      className={
        "border border-gray-200 p-4 rounded-lg flex gap-4 items-center"
      }
    >
      <div
        className={`flex-col items-center justify-center border-r pr-3 border-gray-300 flex`}
      >
        <span className="text-black text-base">{dayAbbreviation}</span>
        <h1 className="font-avenir-black my-0! text-primary">{dayOfMonth}</h1>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-black text-base block truncate">
          {event.title}
        </span>
        {event.description !== "" && event.description && (
          <div className="flex items-start gap-3 mt-2">
            <ListBulletIcon className="size-5 text-primary flex-shrink-0" />
            <p className="line-clamp-2 text-sm overflow-hidden text-gray-400">
              {event.description}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3">
          <ClockIcon className="size-5 text-primary flex-shrink-0" />
          <div className="flex flex-col">
            <p className="line-clamp-2 text-sm overflow-hidden font-avenir-black text-gray-400">
              {format(event.start, "MMM dd yyyy")}
            </p>
            <p className="line-clamp-2 text-sm overflow-hidden font-avenir-black text-gray-400">
              {format(event.start, "h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCard;
