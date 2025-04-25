import { useState } from "react";

const YearFilterDropDown = ({
  label,
  showYear = true,
  startYear = 2000,
  endYear = new Date().getFullYear(),
  selectedYear,
  onYearChange,
}) => {
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleYearChange = (e) => {
    const value = Number(e.target.value);
    onYearChange?.(value);
  };

  return (
    <div className="flex items-center gap-2 font-avenir-black text-primary">
      <div>
        {label && <label>{label}</label>}
        {showYear && (
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="rounded-md border-none outline-none p-2"
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


export default YearFilterDropDown;
