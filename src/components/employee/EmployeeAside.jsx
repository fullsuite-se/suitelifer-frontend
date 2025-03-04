import React, { useEffect, useState } from "react";
import Calendar from "../Calendar";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import EventCard from "../events/EventCard";
import config from "../../config";
import axios from "axios";
import { format } from "date-fns";

const EmployeeAside = () => {
  const [events, setEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/all-events`);
        setEvents(response.data);

        const dates = response.data.reduce((acc, current) => {
          const formattedDate = format(
            new Date(current.date_time),
            "yyyy-MM-dd"
          );
          acc.push(formattedDate);
          return acc;
        }, []);
        setEventDates(dates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <aside className="w-52 md:w-64 lg:w-72 h-dvh flex flex-col p-2 xl:p-3">
      <h2 className="font-avenir-black">Events</h2>
      <Calendar eventDates={eventDates} />
      <section className="mt-5">
        <div className="w-full">
          <div className="">
            <Disclosure as="div" defaultOpen={true}>
              <DisclosureButton className="group flex w-full items-center justify-between">
                <p className="font-avenir-black text-primary">Today</p>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-3 flex flex-col gap-3">
                {events.map((event, index) => (
                  <div key={index}>
                    <EventCard event={event} />
                  </div>
                ))}
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" defaultOpen={true}>
              <DisclosureButton className="group my-3 flex w-full items-center justify-between">
                <p className="font-avenir-black text-black">Upcoming</p>
                <ChevronDownIcon className="size-5 text-primary cursor-pointer group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-3 flex flex-col gap-3">
                {events.map((event, index) => (
                  <div key={index}>
                    <EventCard event={event} isUpcoming={true} />
                  </div>
                ))}
              </DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default EmployeeAside;
