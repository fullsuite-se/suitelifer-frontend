import React, { useState } from "react";
import ContentButtons from "./ContentButtons";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";

const handlePublishChanges = async () => {
  try {
    Object.entries(files).forEach(([key, value]) => {
      console.log(key, value);
    });

    return;

    const response = await api.post("/api/add-content", {
      ...contentDetails,
      user_id: user.id,
    });

    toast.success(response.data.message);

    setDataUpdated(!dataUpdated);
  } catch (err) {
    console.log(err.response);
    toast.error(
      "Encountered an error while publishing changes. Try again in a few minutes..."
    );
  }
};

function TermsOfUseContent({ terms, onUpdate, onDelete }) {
  return (
    <>
      <div className="mb-2">
        {terms.map((terms) => (
          <EditableSection
            key={terms.id}
            terms={terms}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 mb-20">
        <ContentButtons
          icon={<EyeIcon className="size-5" />}
          text="Preview Changes"
          handleClick={null}
        />

        <ContentButtons
          icon={<BookmarkSquareIcon className="size-5" />}
          text="Publish Changes"
          handleClick={handlePublishChanges}
        />
      </div>
    </>
  );
}

function EditableSection({ terms, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(terms);

  const handleSave = () => {
    onUpdate(terms.id, edited);
    setIsEditing(false);
  };

  return (
    <>
      <div className="border p-4 rounded-md mb-5">
        {isEditing ? (
          <>
            <input
              className="block w-full font-bold border text-xl p-2 mb-2"
              value={edited.title}
              onChange={(e) => setEdited({ ...edited, title: e.target.value })}
            />
            <textarea
              className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              value={edited.content}
              rows={10}
              onChange={(e) =>
                setEdited({ ...edited, content: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button className="btn-light" onClick={() => setIsEditing(false)}>
                Cancel
              </button>

              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{terms.title}</h3>
            <p className="text-gray-700 mb-2">{terms.content}</p>
            <button
              className="btn-light mr-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button className="btn-primary" onClick={() => onDelete(terms.id)}>
              Delete
            </button>
          </>
        )}
      </div>
      <div />
    </>
  );
}

export default TermsOfUseContent;
