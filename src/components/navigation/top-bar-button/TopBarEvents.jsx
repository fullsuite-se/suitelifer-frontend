import React from "react";

const TopBarEvents = () => {
  return (
    <button
      className="flex gap-2 cursor-pointer sm:hidden px-3 py-2 rounded-md border border-gray-200 bg-gray-100"
      onClick={() => setIsAddModalOpen(true)}
    >
      <span>+</span> <CalendarIcon className="size-5" />
    </button>
  );
};

export default TopBarEvents;
