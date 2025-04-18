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
  const [selectedLabel, setSelectedLabel] = useState("Total Applications");
  const [selectedColor, setSelectedColor] = useState("#0097b2");

  const [totalApplications, setTotalApplications] = useState(0);
  const [applicationTrend, setApplicationTrend] = useState([]);

  const [openJobs, setOpenJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);

  const fetchApplicationData = async () => {
    try {
      const response = await atsAPI.get("/analytic/graphs/application-trend");

      setTotalApplications(response.data.data.total);

      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const data = response.data.data.trend;

      const dataMap = new Map(data.map((item) => [item.month, item.count]));

      const filledData = monthOrder.map((month) => ({
        month,
        count: dataMap.get(month) || 0,
      }));

      setApplicationTrend(filledData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDataChange = (data, label, color) => {
    setSelectedLabel(label);
    setSelectedColor(color);
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
    fetchApplicationData();
    fetchOpenJobs();
    fetchClosedJobs();
  }, []);

  return (
    <div className="max-h-100vh">
      {/* Header */}

     

      {/* Chart Display */}

      <div className="border border-gray-200 p-4 rounded h-140">
        <h4 className="text-gray-500">{selectedLabel}</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={applicationTrend}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
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
