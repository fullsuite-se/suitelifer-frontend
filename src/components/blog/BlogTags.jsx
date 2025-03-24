import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function BlogTags({ onChange }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/api/all-tags");
        setTags(response.data.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const toggleTagSelection = (tag) => {
    setSelectedTags((prevSelected) => {
      const isSelected = prevSelected.some((t) => t.tagId === tag.tagId);
      const newSelected = isSelected
        ? prevSelected.filter((t) => t.tagId !== tag.tagId)
        : [...prevSelected, tag];

      onChange(newSelected.map((t) => t.tagId));
      return newSelected;
    });
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-300">
      {tags.length > 0 ? (
        <div className="space-y-2">
          {tags.map((tag) => (
            <label
              key={tag.tagId}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTags.some((t) => t.tagId === tag.tagId)}
                onChange={() => toggleTagSelection(tag)}
                className="size-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
              />
              <span className="text-gray-900 text-sm">{tag.tagName}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No tags found.</p>
      )}
    </div>
  );
}
