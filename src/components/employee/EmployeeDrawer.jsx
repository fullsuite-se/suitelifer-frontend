import React, { useState } from "react";
import logoFull from "../../assets/logos/logo-fs-full.svg";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  NewspaperIcon,
  CalendarIcon,
  Bars3BottomLeftIcon,
  ArrowRightCircleIcon,
  BriefcaseIcon,
  Square2StackIcon,
  WrenchScrewdriverIcon,
  ClipboardIcon,
  UserIcon,
  ArrowPathRoundedSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useStore } from "../../store/authStore";
import { ModalLogout } from "../modals/ModalLogout";

const iconMap = {
  dashboard: { default: ChartBarIcon },
  joblistings: { default: BriefcaseIcon },
  blogs: { default: ChatBubbleBottomCenterTextIcon },
  news: { default: NewspaperIcon },
  events: { default: CalendarIcon },
  contents: { default: Bars3BottomLeftIcon },
};

const regularServices = [
  { feature_name: "Blogs Feed", path: "blogs-feed", icon: NewspaperIcon },
  { feature_name: "My Blogs", path: "my-blogs", icon: ClipboardIcon },
  {
    feature_name: "Threads",
    path: "threads",
    icon: ArrowPathRoundedSquareIcon,
  },
  { feature_name: "Events", path: "company-events", icon: CalendarIcon },
  { feature_name: "Workshops", path: "worshops", icon: WrenchScrewdriverIcon },
  {
    feature_name: "Personality Test",
    path: "personality-test",
    icon: UserIcon,
  },
];

const EmployeeDrawer = ({ onClose }) => {
  const services = useStore((state) => state.services) || [];
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose("-100%");
    }
  };

  return (
    <nav className="lg:hidden relative pb-10">
      <ModalLogout
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
      />
      <section className="flex justify-between pt-5">
        <div className="w-20 h-auto">
          <img src={logoFull} alt="fullsuite" className="w-full h-full" />
        </div>
        <XMarkIcon className="w-9 h-9 rounded-full p-1" onClick={handleClose} />
      </section>
      <section className="">
        <section className=" flex-1 ">
          <ul className="list-none!">
            {regularServices.map((service, index) => {
              return (
                <li key={index}>
                  <NavLink
                    to={`/app/${service.path}`}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-white transition-none! p-3 rounded-lg flex items-center gap-3 no-underline!"
                        : "bg-white text-primary transition-none! p-3 rounded-lg flex items-center gap-3 no-underline! hover:bg-blue-50"
                    }
                    onClick={handleClose}
                  >
                    {service ? (
                      <service.icon className="size-4 group-hover:hidden" />
                    ) : (
                      <Square2StackIcon className="size-4 group-hover:hidden" />
                    )}
                    <span className="no-underline! font-avenir-black">
                      {service.feature_name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
            {services.length !== 0 && (
              <Disclosure as="div" defaultOpen={true}>
                <DisclosureButton className="group cursor-pointer flex w-full items-center justify-between">
                  <p className="font-avenir-black text-primary p-3">
                    Admin Tools
                  </p>
                  <ChevronDownIcon className="size-5 text-primary  group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-1 ml-5 flex flex-col">
                  {services.map(({ feature_name }, index) => {
                    if (!feature_name) return null;
                    const path = feature_name.toLowerCase().replace(" ", "");
                    const iconKey = feature_name
                      .toLowerCase()
                      .replace(/\s+/g, "");
                    const icons = iconMap[iconKey] || null;
                    return (
                      <li key={index}>
                        <NavLink
                          key={path}
                          to={`/app/${path}`}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-primary text-white p-3 transition-none! rounded-lg flex items-center gap-3 no-underline!"
                              : "bg-white text-primary p-3 transition-none! rounded-lg flex items-center gap-3 no-underline! hover:bg-blue-50"
                          }
                          onClick={handleClose}
                        >
                          {icons ? (
                            <icons.default className="size-4 group-hover:hidden" />
                          ) : (
                            <Square2StackIcon className="size-4 group-hover:hidden" />
                          )}
                          <span className="no-underline! font-avenir-black">
                            {feature_name}
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </DisclosurePanel>
              </Disclosure>
            )}
          </ul>
        </section>
        <section
          className="mt-5 mx-auto cursor-pointer text-sm flex justify-center items-center gap-2 w-min"
          onClick={() => {
            setIsOpenModal(true);
            handleClose();
          }}
        >
          <span className="text-primary font-avenir-black">Logout</span>
          <button className=" cursor-pointer">
            <ArrowRightCircleIcon className="w-6 h-6 text-primary" />
          </button>
        </section>
      </section>
    </nav>
  );
};

export default EmployeeDrawer;
