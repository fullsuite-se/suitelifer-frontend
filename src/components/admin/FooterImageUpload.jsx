import React, { useState } from "react";
import api from "../../utils/axios";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const FooterImageUpload = ({
  isOpen,
  onClose,
  onSave,
  certificationDetails,
  setCertificationDetails,
}) => {
  const [inputMethod, setInputMethod] = useState("url");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      setFile(uploadedFile);
      const previewUrl = URL.createObjectURL(uploadedFile);
      setCertificationDetails((prev) => ({
        ...prev,
        certImageUrl: previewUrl,
        previewFile: previewUrl,
      }));
    }
  };

  const handleRadioChange = (e) => {
    const method = e.target.value;
    setInputMethod(method);
    setFile(null);
    setCertificationDetails((prev) => ({
      ...prev,
      certImageUrl: "",
      previewFile: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputMethod === "upload" && file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post(
          "/api/upload-image/certifications",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const imageUrl = response.data.imageUrl;

        const updated = {
          ...certificationDetails,
          certImageUrl: imageUrl,
          previewFile: imageUrl,
        };

        setCertificationDetails(updated);
        onSave(updated);
      } catch (error) {
        console.error("Error uploading image to server", error);
      }
    } else if (inputMethod === "url") {
      onSave(certificationDetails);
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
                  setCertificationDetails((prev) => ({
                    ...prev,
                    certImageUrl: e.target.value,
                    previewFile: e.target.value,
                  }))
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
                onChange={handleFileChange}
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

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>
          {modalType === "view" ? "View Image" : "Edit Image"}
        </DialogTitle>
        <DialogContent>
          {modalType === "view" && certificationDetails.previewFile && (
            <img
              src={certificationDetails.previewFile}
              alt="Uploaded Preview"
              style={{ maxWidth: "100%", borderRadius: "24px", border: "none" }}
            />
          )}
          {modalType === "edit" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FooterImageUpload;
