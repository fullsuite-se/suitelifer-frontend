import { useState } from "react";

const Filter = ({
  label,
  showMonth = true,
  showYear = true,
  onMonthChange,
  onYearChange,
}) => {
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    onMonthChange?.(value);
  };

  const handleYearChange = (e) => {
    const value = Number(e.target.value);
    setSelectedYear(value);
    onYearChange?.(value);
  };

  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="items-center w-full justify-center ">
          {label && <label className="text-white">{label}</label>}
        </div>

        {showMonth && (
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-primary rounded-md border-none outline-none p-2 text-white"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        {showYear && (
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-primary rounded-md border-none outline-none p-2 text-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Filter;
