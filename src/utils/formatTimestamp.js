const formatTimestamp = (dateString) => {
  const dateObj = new Date(dateString);

  // Get day of the week
  const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  // Get full date in the format "Month Day, Year"
  const fullDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get time in 12-hour format with AM/PM
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { day, fullDate, time };

  // Example usage
  // const timeStamp = "2025-03-04 12:32:04";
  // const { day, fullDate, time } = formatDateTime(timeStamp);

  // console.log(day); // e.g., "Tuesday"
  // console.log(fullDate); // e.g., "March 4, 2025"
  // console.log(time); // e.g., "12:32 PM"
};

export default formatTimestamp;
