import { useState, useEffect } from "react";

const BlogText = () => {
  const [isPrimary, setIsPrimary] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPrimary(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={`relative z-10 mr-3 text-4xl md:text-7xl transition-colors duration-1000 font-avenir-black  ${
        isPrimary ? "text-primary" : "text-white"
      }`}
    >blog
    </span>
  );
};

export default BlogText;