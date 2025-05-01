import React, { useState } from "react";

const FooterImageUpload = ({
  isOpen,
  onClose,
  onSave,
  certificationDetails,
  setCertificationDetails,
}) => {
  const [inputMethod, setInputMethod] = useState("url");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMethod === "upload" && file) {
      const fileURL = URL.createObjectURL(file);
      setCertificationDetails({
        ...certificationDetails,
        certImageUrl: fileURL,
      });
    }

    onSave();
  };

  const handleRadioChange = (e) => {
    setInputMethod(e.target.value);
    if (e.target.value === "url") {
      setFile(null);
    } else {
      setCertificationDetails({
        ...certificationDetails,
        certImageUrl: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
      setCertificationDetails({
        ...certificationDetails,
        certImageUrl: URL.createObjectURL(uploadedFile),
      });
    }
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
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="url"
                checked={inputMethod === "url"}
                onChange={handleRadioChange}
              />
              Image URL
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="upload"
                checked={inputMethod === "upload"}
                onChange={handleRadioChange}
              />
              Upload Image
            </label>
          </div>

          {inputMethod === "url" ? (
            <>
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
              {certificationDetails.certImageUrl && (
                <img
                  src={certificationDetails.certImageUrl}
                  alt="Preview"
                  className="max-h-60 object-contain border rounded"
                />
              )}
            </>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e);
                  const file = e.target.files[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setCertificationDetails((prev) => ({
                      ...prev,
                      previewFile: previewUrl,
                    }));
                  }
                }}
                className="w-full"
                required
              />
              {certificationDetails.previewFile && (
                <img
                  src={certificationDetails.previewFile}
                  alt="Preview"
                  className="max-h-60 object-contain border rounded"
                />
              )}
            </>
          )}

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
