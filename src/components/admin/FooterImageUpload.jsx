import React from "react";

const FooterImageUpload = ({
  isOpen,
  onClose,
  onSave,
  certificationDetails,
  setCertificationDetails,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {certificationDetails.certId === null
              ? "Add Certification"
              : "Edit Certification"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <input
            type="text"
            name="certImageUrl"
            value={certificationDetails.certImageUrl}
            onChange={(e) =>
              setCertificationDetails({
                ...certificationDetails,
                [e.target.name]: e.target.value,
              })
            }
            placeholder="Enter Certification Image URL"
            className="w-full p-3 border rounded-md"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-light" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {certificationDetails.certId === null ? "Add" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FooterImageUpload;
