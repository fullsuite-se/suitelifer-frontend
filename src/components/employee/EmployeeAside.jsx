import React from "react";
import Calendar from "../Calendar";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import EventCard from "../events/EventCard";

const events = [
  {
    title: "Annual Sports Fest 2025",
    description:
      "Join us for a day of fun and competition! Various sports activities, games, and team-building events await. Don't miss out on the excitement!",
    time: "7:00 AM - 6:00 PM",
  },
  {
    title: "Tech Conference 2025",
    description:
      "A gathering of the brightest minds in technology, discussing the latest trends in AI, cloud computing, and cybersecurity.",
    time: "9:00 AM - 4:00 PM",
  },
];

const EmployeeAside = () => {
  return (
    <aside className="w-52 md:w-64 lg:w-72 h-dvh flex flex-col p-2 xl:p-3">
      <h2 className="font-avenir-black">Events</h2>
      <Calendar />
      <section>
        <div className="w-full">
          <div className="">
            <Disclosure as="div" defaultOpen={true}>
              <DisclosureButton className="group flex w-full items-center justify-between">
                <h3 className="font-avenir-black text-primary">
                  Today <span className="text-sm font-avenir-roman">(5)</span>
                </h3>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-1 flex flex-col gap-3">
                {events.map((event, index) => (
                  <div key={index}>
                    <EventCard event={event} />
                  </div>
                ))}
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" defaultOpen={true}>
              <DisclosureButton className="group flex w-full items-center justify-between">
                <h3 className="font-avenir-black text-black">Upcoming</h3>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-1">No.</DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default EmployeeAside;
