import React from "react";
import { ListBulletIcon, ClockIcon } from "@heroicons/react/24/outline";

const EventCard = ({ event }) => {
  return (
    <section className="border border-gray-300 p-3 rounded-lg">
      <span className="text-black text-base font-avenir-roman">
        {event.title}
      </span>
      <div className="flex items-start gap-3 mt-2">
        <ListBulletIcon className="size-5 text-primary flex-shrink-0" />
        <p className="line-clamp-2 text-sm overflow-hidden text-gray-400">
          {event.description}
        </p>
      </div>
      <div className="flex items-start gap-3">
        <ClockIcon className="size-5 text-primary flex-shrink-0" />
        <p className="line-clamp-2 text-sm overflow-hidden font-avenir-black text-gray-400">
          {event.time}
        </p>
      </div>
    </section>
  );
};

export default EventCard;
