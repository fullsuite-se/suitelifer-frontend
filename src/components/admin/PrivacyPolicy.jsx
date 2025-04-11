import React, { useState } from "react";
import PPC from "./PrivacyPolicyContent";

function PrivacyPolicy() {
  const [policySections, setPolicySections] = useState([
  ]);

  const [newSection, setNewSection] = useState({ title: "", content: "" });

  const handleAdd = () => {
    if (!newSection.title || !newSection.content) return;
    setPolicySections([...policySections, { ...newSection, id: Date.now() }]);
    setNewSection({ title: "", content: "" });
  };

  const handleUpdate = (id, updated) => {
    setPolicySections((prev) =>
      prev.map((section) => (section.id === id ? updated : section))
    );
  };

  const handleDelete = (id) => {
    setPolicySections((prev) => prev.filter((section) => section.id !== id));
  };

  return (
    <div className="p-4 w-full mx-auto">
      <div className="mb-6">
        <div className="text-md font-bold pt-4 font-avenir-black">Title</div>
        <input
          type="text"
          name="title"
          value={newSection.title}
          onChange={(e) =>
            setNewSection({ ...newSection, title: e.target.value })
          }
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="text-md font-bold pt-4 font-avenir-black">Content</div>
        <textarea
          type="text"
          name="content"
          value={newSection.content}
          onChange={(e) =>
            setNewSection({ ...newSection, content: e.target.value })
          }
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="btn-primary" onClick={handleAdd}>
          Add Policy
        </button>
      </div>

      <PPC
        policySections={policySections}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PrivacyPolicy;
