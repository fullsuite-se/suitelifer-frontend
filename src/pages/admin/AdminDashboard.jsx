import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import AppsIcon from "@mui/icons-material/Apps";
import logofsfull from "../../assets/logos/logo-fs-full.svg";

// Separate datasets
const applicationsData = [
  { month: 0, value: 2400 },
  { month: 1, value: 2500 },
  { month: 2, value: 2400 },
  { month: 3, value: 2600 },
  { month: 4, value: 2500 },
  { month: 5, value: 2400 },
  { month: 6, value: 2300 },
  { month: 7, value: 2500 },
  { month: 8, value: 2700 },
  { month: 9, value: 2800 },
  { month: 10, value: 2900 },
  { month: 11, value: 2800 },
];

const employeesData = [
  { month: 0, value: 50 },
  { month: 1, value: 52 },
  { month: 2, value: 54 },
  { month: 3, value: 56 },
  { month: 4, value: 58 },
  { month: 5, value: 60 },
  { month: 6, value: 62 },
  { month: 7, value: 64 },
  { month: 8, value: 66 },
  { month: 9, value: 68 },
  { month: 10, value: 70 },
  { month: 11, value: 72 },
];

const openJobsData = [
  { month: 0, value: 10 },
  { month: 1, value: 12 },
  { month: 2, value: 14 },
  { month: 3, value: 16 },
  { month: 4, value: 18 },
  { month: 5, value: 20 },
  { month: 6, value: 22 },
  { month: 7, value: 24 },
  { month: 8, value: 26 },
  { month: 9, value: 28 },
  { month: 10, value: 30 },
  { month: 11, value: 32 },
];

const closedJobsData = [
  { month: 0, value: 5 },
  { month: 1, value: 6 },
  { month: 2, value: 7 },
  { month: 3, value: 8 },
  { month: 4, value: 9 },
  { month: 5, value: 10 },
  { month: 6, value: 11 },
  { month: 7, value: 12 },
  { month: 8, value: 13 },
  { month: 9, value: 14 },
  { month: 10, value: 15 },
  { month: 11, value: 16 },
];

const AdminDashboard = () => {
  const [selectedData, setSelectedData] = useState(applicationsData);
  const [selectedLabel, setSelectedLabel] = useState("Total Applications");
  const [selectedColor, setSelectedColor] = useState("#82ca9d");

  const handleDataChange = (data, label, color) => {
    setSelectedData(data);
    setSelectedLabel(label);
    setSelectedColor(color);
  };

  return (
    <div className="max-h-100vh bg-white p-4">
      {/* Header */}
      <header className="container flex h-12 items-center justify-between flex-wrap">
        <div className="flex gap-4 items-center">
          <button className="sm:hidden">
            <AppsIcon sx={{ fontSize: "48px" }} />
          </button>
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary">
            <span className="mr-2">+</span> JOB LISTING
          </button>
          <button className="btn-primary">
            <span className="mr-2">+</span> INDUSTRY
          </button>
        </div>
      </header>

      <div className="border-primary p-4 rounded-2xl shadow-md justify-between gap-4 mx-auto mb-6 text-center bg-primary flex h-30">
        <button
          className="p-4 rounded-lg shadow text-black text-xl font-semibold bg-white w-100"
          onClick={() =>
            handleDataChange(
              employeesData,
              "Total Employee Accounts",
              "#8884d8"
            )
          }
        >
          <span className="text-3xl">52</span>
          <div className="text-sm text-gray-500">Total Employee Accounts</div>
        </button>

        <button
          className="p-4 rounded-lg shadow text-black text-xl font-semibold bg-white w-100"
          onClick={() =>
            handleDataChange(applicationsData, "Total Applications", "#82ca9d")
          }
        >
          <span className="text-3xl">917</span>
          <div className="text-sm text-gray-500">Total Applications</div>
        </button>
        
    
       
         
          
            <button
              className="bg-secondary p-4 rounded-lg text-black-700 text-lg font-semibold w-45"
              onClick={() =>
                handleDataChange(openJobsData, "Open Job Listings", "#ffc658")
              }
            >
              <span className="text-2xl">14</span>
              <div className="text-sm">Open Job</div>
            </button>

            <button
              className="bg-accent-2 p-4 rounded-lg text-white text-lg font-semibold w-45"
              onClick={() =>
                handleDataChange(
                  closedJobsData,
                  "Closed Job Listings",
                  "#ff7300"
                )
              }
            >
              <span className="text-2xl">5</span>
              <div className="text-sm">Closed Job</div>
            </button>

      </div>

      {/* Chart Display */}
      <div className="border p-4 rounded shadow h-140">
        <h2 className="text-lg font-medium">{selectedLabel}</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value + 1}`}
              />
              <YAxis tickLine={false} axisLine={false} tickCount={8} />
              <Tooltip />
              <Legend />
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
