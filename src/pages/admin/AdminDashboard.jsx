import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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
  const [openJobs, setOpenJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);

  const fetchTotalApplications = async () => {
    try {
      const response = await atsAPI.get("/analytic/metrics/fs-applicant-count");

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

      <section className="mt-3 mb-4 grid grid-cols-4 grid-rows-[7rem] [&>*]:bg-gray-100 [&>*]:border [&>*]:border-gray-200 gap-4">
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          // onClick={() =>
          //   handleDataChange(
          //     employeesData,
          //     "Total Employee Accounts",
          //     "#0097b2"
          //   )
          // }
        >
          <span className="text-3xl text-center">52</span>
          <div className="text-sm text-gray-500 text-center">
            Active Employee
          </div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          // onClick={() =>
          //   handleDataChange(applicationsData, "Total Applications", "#0097b2")
          // }
        >
          <span className="text-3xl text-center">{totalApplications}</span>
          <div className="text-sm text-gray-500 text-center">Applications</div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          // onClick={() =>
          //   handleDataChange(openJobsData, "Open Job Listings", "#0097b2")
          // }
        >
          <span className="text-2xl text-center">{openJobs}</span>
          <div className="text-sm text-gray-500 text-center">Open Jobs</div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer"
          // onClick={() =>
          //   handleDataChange(closedJobsData, "Closed Job Listings", "#0097b2")
          // }
        >
          <span className="text-2xl text-center">{closedJobs}</span>
          <div className="text-sm text-gray-500 text-center">Closed Jobs</div>
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
