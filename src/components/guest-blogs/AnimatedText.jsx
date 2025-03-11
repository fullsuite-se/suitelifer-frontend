import { useState, useEffect } from "react";

const AnimatedText = ({ text, color }) => {
  const [isPrimary, setIsPrimary] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPrimary(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={`relative z-10 mr-4 text-4xl md:text-7xl mb-3 transition-colors duration-1000 font-sansita-black ${
        isPrimary ?   "text-primary":`text-${color}`
      }`}
    >
      {text}
    </span>
  );
};

export default AnimatedText;
