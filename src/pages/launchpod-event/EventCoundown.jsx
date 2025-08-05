import { useEffect, useState } from "react";

export default function EventCountdown() {
  const [countdown, setCountdown] = useState("00d 00h 00m 00s");

  useEffect(() => {
    const targetTime = new Date("2025-08-27T16:00:00").getTime();

    function updateCountDown() {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setCountdown("00d 00h 00m 00s");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(
        `${String(days).padStart(2, "0")}d ` +
          `${String(hours).padStart(2, "0")}h ` +
          `${String(minutes).padStart(2, "0")}m ` +
          `${String(seconds).padStart(2, "0")}s`
      );
    }

    updateCountDown();

    const interval = setInterval(updateCountDown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1
        className="!text-[8vw] !m-0 !font-[CoreSansBold] !pointer-events-none !select-none !tracking-[0]"
        style={{
          background: "linear-gradient(181.5deg, #ffffff 25%, #999999 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {countdown}
      </h1>
     
    </div>
  );
}
