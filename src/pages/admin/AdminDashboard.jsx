import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import api from "../../utils/axios";
import atsAPI from "../../utils/atsAPI";

const applicationsData = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 123 },
  { month: "Mar", value: 554 },
  { month: "Apr", value: 167 },
  { month: "May", value: 518 },
  { month: "Jun", value: 20 },
  { month: "Jul", value: 2002 },
  { month: "Aug", value: 664 },
  { month: "Sep", value: 26 },
  { month: "Oct", value: 888 },
  { month: "Nov", value: 30 },
  { month: "Dec", value: 72 },
];

const employeesData = [
  { month: "Jan", value: 7 },
  { month: "Feb", value: 10 },
  { month: "Mar", value: 8 },
  { month: "Apr", value: 3 },
  { month: "May", value: 2 },
  { month: "Jun", value: 6 },
  { month: "Jul", value: 8 },
  { month: "Aug", value: 1 },
  { month: "Sep", value: 5 },
  { month: "Oct", value: 7 },
  { month: "Nov", value: 2 },
  { month: "Dec", value: 4 },
];

const openJobsData = [
  { month: "Jan", value: 1 },
  { month: "Feb", value: 12 },
  { month: "Mar", value: 4 },
  { month: "Apr", value: 1 },
  { month: "May", value: 1 },
  { month: "Jun", value: 5 },
  { month: "Jul", value: 2 },
  { month: "Aug", value: 2 },
  { month: "Sep", value: 26 },
  { month: "Oct", value: 8 },
  { month: "Nov", value: 3 },
  { month: "Dec", value: 2 },
];

const closedJobsData = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 1 },
  { month: "Mar", value: 14 },
  { month: "Apr", value: 6 },
  { month: "May", value: 8 },
  { month: "Jun", value: 20 },
  { month: "Jul", value: 2 },
  { month: "Aug", value: 24 },
  { month: "Sep", value: 6 },
  { month: "Oct", value: 8 },
  { month: "Nov", value: 3 },
  { month: "Dec", value: 2 },
];

const AdminDashboard = () => {
  const [selectedData, setSelectedData] = useState(applicationsData);
  const [selectedLabel, setSelectedLabel] = useState("Total Applications");
  const [selectedColor, setSelectedColor] = useState("#0097b2");

  const handleDataChange = (data, label, color) => {
    setSelectedData(data);
    setSelectedLabel(label);
    setSelectedColor(color);
  };

  const [totalApplications, setTotalApplications] = useState(0);
  const [openJobs, setOpenJobs] = useState(null);
  const [closedJobs, setClosedJobs] = useState(null);

  const fetchTotalApplications = async () => {
    try {
      const response = await atsAPI.get("/fs-applicant-count");

      setTotalApplications((ta) => response.data.fs_count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOpenJobs = async () => {
    try {
      const response = await api.get("api/get-open-jobs-count");

      setOpenJobs((oj) => response.data.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClosedJobs = async () => {
    try {
      const response = await api.get("api/get-closed-jobs-count");

      setClosedJobs((cj) => response.data.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTotalApplications();
    fetchOpenJobs();
    fetchClosedJobs();
  }, []);

  return (
    <div className="max-h-100vh">
      {/* Header */}
      <header className="container flex h-12 items-center justify-end flex-wrap">
        {/* <div className="hidden lg:flex md-flex gap-4 items-center ">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div> */}

        <div className="flex gap-3">
          {/* Button for desktop */}
          <button className="text-gray-500 hidden sm:block border border-gray-200 bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            + Job Listing
          </button>
          <button className="text-gray-500 hidden sm:block border border-gray-200 bg-gray-100 px-3 py-2 rounded-md cursor-pointer">
            + Industry
          </button>

          {/* Icon Button for Mobile */}
          <button className="sm:hidden p-2 btn-primary flex items-center gap-1">
            <span>+</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
              />
            </svg>
          </button>
          <button className="sm:hidden p-2 btn-primary flex items-center gap-1">
            <span>+</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </button>
        </div>
      </header>

      <section className="mt-3 mb-4 grid grid-cols-4 grid-rows-[7rem] [&>*]:bg-gray-100 [&>*]:border [&>*]:border-gray-200 gap-4">
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          onClick={() =>
            handleDataChange(
              employeesData,
              "Total Employee Accounts",
              "#0097b2"
            )
          }
        >
          <span className="text-3xl text-center">52</span>
          <div className="text-sm text-gray-500 ">
            Total Active Employee Accounts
          </div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          onClick={() =>
            handleDataChange(applicationsData, "Total Applications", "#0097b2")
          }
        >
          <span className="text-3xl">{totalApplications}</span>
          <div className="text-sm text-gray-500">Total Applications</div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          onClick={() =>
            handleDataChange(openJobsData, "Open Job Listings", "#0097b2")
          }
        >
          <span className="text-2xl text-center">{openJobs}</span>
          <div className="text-sm text-gray-500">Open Jobs</div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          onClick={() =>
            handleDataChange(closedJobsData, "Closed Job Listings", "#0097b2")
          }
        >
          <span className="text-2xl text-center">{closedJobs}</span>
          <div className="text-sm text-gray-500 ">Closed Jobs</div>
        </div>
      </section>

      {/* Chart Display */}

      <div className="border border-gray-200 p-4 rounded h-140">
        <h4 className="text-gray-500">{selectedLabel}</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedData}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={selectedColor}
                fill={selectedColor}
                fillOpacity={0.2}
                name={selectedLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
