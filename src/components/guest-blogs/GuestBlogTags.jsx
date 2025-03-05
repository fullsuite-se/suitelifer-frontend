import { useState } from "react";

const categories = ["All", "Business", "Employees", "Startups", "Finance"];

const GuestBlogTags = () => {
  const [activeTag, setActiveTag] = useState("All");

  return (
    <div className="flex gap-4 align-middle justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveTag(category)}
          className={`px-10 py-1 rounded-full border-1 border-primary text-primary transition-all duration-300 ${
            activeTag === category
              ? "bg-primary text-white font-bold"
              : "hover:bg-primary hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default GuestBlogTags;
