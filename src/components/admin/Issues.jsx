import React, { useState } from "react";

const months = [
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

const Issues = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    
      <div className="flex flex-end w-full gap-4">

        {/* <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(String(e.target.value))}
          className="rounded-md p-2 bg-accent-2! border-none outline-none text-white"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select> */}

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md p-2 bg-accent-2! border-none outline-none text-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    
  );
};

export default Issues;
