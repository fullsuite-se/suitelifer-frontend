import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useStore } from "../../store/authStore";
import { ModalLogout } from "../modals/ModalLogout";
import fullsuitelogo from "../../assets/logos/logo-fs-full.svg";
import {
  NewspaperIcon,
  CalendarIcon,
  Bars3BottomLeftIcon,
  ArrowRightCircleIcon,
  Square2StackIcon,
  WrenchScrewdriverIcon,
  ClipboardIcon,
  ArrowPathRoundedSquareIcon,
  ChevronDownIcon,
  BookOpenIcon,
  FaceSmileIcon,
  UsersIcon,
  ArrowDownOnSquareIcon,
  TableCellsIcon
} from "@heroicons/react/20/solid";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import SidebarCollapse from "../../assets/icons/SidebarCollapse";
import { useEffect } from "react";

const regularFeatures = [
  { feature_name: "Blogs Feed", path: "blogs-feed", icon: NewspaperIcon },
  { feature_name: "My Blogs", path: "my-blogs", icon: ClipboardIcon },
  {
    feature_name: "Threads",
    path: "threads",
    icon: ArrowPathRoundedSquareIcon,
  },
  { feature_name: "Events", path: "company-events", icon: CalendarIcon },
  { feature_name: "Workshops", path: "workshops", icon: WrenchScrewdriverIcon },
  {
    feature_name: "Personality Test",
    path: "personality-test",
    icon: FaceSmileIcon,
  },
];

const adminFeatures = [
  { feature_name: "Content", path: "contents", icon: Bars3BottomLeftIcon },
  { feature_name: "Events", path: "events", icon: CalendarIcon },
  { feature_name: "Suitebite", path: "suitebite", icon: NewspaperIcon },
  { feature_name: "Courses", path: "courses", icon: BookOpenIcon },
  {
    feature_name: "Personality Test",
    path: "personality-test",
    icon: FaceSmileIcon,
  },
  {
    feature_name: "Audit Logs",
    path: "audit-logs",
    icon: TableCellsIcon,
  },
];

const superAdminFeatures = [
  {
    feature_name: "Accounts",
    path: "super/accounts-management",
    icon: UsersIcon,
  },
];

const CMSNavigation = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const user = useStore((state) => state.user);
  const [isCollapse, setCollapse] = useState(
    JSON.parse(localStorage.getItem("isCollapsed")) ?? false
  );
  const [showTool, setShowTool] = useState(
    JSON.parse(localStorage.getItem("showTools")) ?? true
  );
  const [isLoading, setIsLoading] = useState(true);
  // For PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    try {
      setIsLoading(true);
      const isCollaped =
        JSON.parse(localStorage.getItem("isCollapsed")) ?? false;
      const showTools = JSON.parse(localStorage.getItem("showTools")) ?? true;
      setCollapse(isCollaped);
      setShowTool(showTools);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleCollapseBtn = () => {
    localStorage.setItem("isCollapsed", !isCollapse);
    setCollapse((prev) => !prev);
  };

  const handleDisclosureBtn = () => {
    const updatedShowTool = !showTool;
    localStorage.setItem("showTools", updatedShowTool);
    setShowTool(updatedShowTool);
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted PWA install");
        } else {
          console.log("User dismissed PWA install");
        }
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  const displayFeatures = (features, prefixPath) => {
    return features.map((service, index) => (
      <li key={index}>
        <NavLink
          to={`${prefixPath}/${service.path}`}
          className={({ isActive }) =>
            isActive
              ? `bg-primary text-white transition-none p-3 rounded-lg flex items-center gap-3 no-underline ${
                  !isCollapse ? "w-full" : "w-min"
                }`
              : `bg-white text-primary transition-none p-3 rounded-lg flex items-center gap-3 no-underline hover:bg-blue-50 ${
                  !isCollapse ? "w-full" : "w-min"
                }`
          }
        >
          {service ? (
            <service.icon className="size-4 group-hover:hidden" />
          ) : (
            <Square2StackIcon className="size-4 group-hover:hidden" />
          )}
          {!isCollapse && (
            <span className="no-underline! truncate font-avenir-black">
              {service.feature_name}
            </span>
          )}
        </NavLink>
      </li>
    ));
  };

  if (isLoading) return null;

  return (
    <section>
      <nav className={`${isCollapse && "w-min"} h-dvh flex flex-col`}>
        <ModalLogout
          isOpen={isOpenModal}
          handleClose={() => setIsOpenModal(false)}
        />
        <section className={`relative ${isCollapse ? "pt-8" : "py-5"}`}>
          <section
            className={`${
              isCollapse ? "flex justify-center" : "absolute top-8 right-0"
            }`}
            onClick={handleCollapseBtn}
          >
            <SidebarCollapse direction={"left"} />
          </section>
          <div
            className={`size-20 mx-auto mb-3 ${isCollapse ? "mt-3" : "mb-3"}`}
          >
            <img
              src="http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg"
              alt="Hernani"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {!isCollapse && (
            <>
              <p className="font-avenir-black text-center truncate">
                {`${user?.first_name ?? "Unknown"} ${
                  user?.last_name ?? "User"
                }`}
              </p>
              <p className="text-sm text-center text-primary">
                {`@${user?.first_name?.trim()?.toLowerCase() ?? "unknown"}.${
                  user?.last_name?.trim()?.toLowerCase() ?? "user"
                }`}
              </p>
            </>
          )}
        </section>
        <section className=" flex-1 ">
          <ul className="list-none!">
            {displayFeatures(regularFeatures, "/app")}
            {user.role === "ADMIN" && (
              <Disclosure as="div" defaultOpen={showTool}>
                <DisclosureButton
                  className="group cursor-pointer flex w-full items-center justify-between"
                  onClick={handleDisclosureBtn}
                >
                  {!isCollapse && (
                    <p className="font-avenir-black text-primary p-3">
                      Admin Tools
                    </p>
                  )}
                  <ChevronDownIcon className="size-5 text-primary  group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel
                  className={`${!isCollapse && "ml-5"} mt-1 flex flex-col`}
                >
                  {displayFeatures(adminFeatures, "/app/admin-tools")}
                </DisclosurePanel>
              </Disclosure>
            )}
            {user.role === "SUPER ADMIN" && (
              <Disclosure as="div" defaultOpen={showTool}>
                <DisclosureButton
                  className="group cursor-pointer flex w-full items-center justify-between"
                  onClick={handleDisclosureBtn}
                >
                  {!isCollapse && (
                    <p className="font-avenir-black text-primary p-3">
                      Admin Tools
                    </p>
                  )}
                  <ChevronDownIcon className="size-5 text-primary  group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel
                  className={`${!isCollapse && "ml-5"} mt-1 flex flex-col`}
                >
                  {displayFeatures(
                    [...superAdminFeatures, ...adminFeatures],
                    "/app/admin-tools"
                  )}
                </DisclosurePanel>
              </Disclosure>
            )}
          </ul>
        </section>

        <section className="p-5 py-7 flex flex-col gap-4">
          <div className="flex justify-between">
            {!isCollapse && (
              <img
                src={fullsuitelogo}
                alt="fullsuitelogo"
                className="w-20 h-auto"
              />
            )}
            <div className="flex items-start justify-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => setIsOpenModal(true)}
              >
                <ArrowRightCircleIcon className="w-6 h-7 text-primary" />
              </button>
              {showInstallPrompt && (
                <button className="cursor-pointer" onClick={handleInstallClick}>
                  <ArrowDownOnSquareIcon className="w-6 h-6 text-primary" />
                </button>
              )}
            </div>
          </div>
        </section>
      </nav>
    </section>
  );
};

export default CMSNavigation;
