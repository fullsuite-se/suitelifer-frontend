import React, { useState } from "react";
import PPC from "./PrivacyPolicyContent";
import TermsOfUseContent from "./TermsOfUseContent";

function TermsOfUse() {
  const [termsSections, setTermsSections] = useState([]);
  const [newTerms, setNewTerms] = useState({ term: "", content: "" });

  const handleAdd = () => {
    if (!newTerms.term || !newTerms.content) return;
    setTermsSections([...termsSections, { ...newTerms, id: Date.now() }]);
    setNewTerms({ term: "", content: "" });
  };

  const handleUpdate = (id, updated) => {
    setTermsSections((prev) =>
      prev.map((section) => (section.id === id ? updated : section))
    );
  };

  const handleDelete = (id) => {
    setTermsSections((prev) => prev.filter((section) => section.id !== id));
  };

  return (
    <div className="p-4 w-full mx-auto">
      <div className="mb-6">
        <div className="text-md font-bold pt-4 font-avenir-black">Term of Use Title <span>*</span></div>
        <input
          type="text"
          name="term"
          value={newTerms.term}
          onChange={(e) => setNewTerms({ ...newTerms, term: e.target.value })}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="text-md font-bold pt-4 font-avenir-black">Content <span>*</span></div>
        <textarea
          type="text"
          name="content"
          value={newTerms.content}
          onChange={(e) =>
            setNewTerms({ ...newTerms, content: e.target.value })
          }
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="btn-primary" onClick={handleAdd}>
          Add Term
        </button>
      </div>

      <TermsOfUseContent
        terms={termsSections}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TermsOfUse;
