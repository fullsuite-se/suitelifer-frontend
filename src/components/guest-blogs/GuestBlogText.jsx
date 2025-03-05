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
      className={`transition-colors duration-1000 ${
        isPrimary ? "text-primary" : "text-white"
      }`}
    >
      blog
    </span>
  );
};

export default BlogText;
