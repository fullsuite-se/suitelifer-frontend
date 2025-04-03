import { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Button } from "@/components/ui/button";

const CareerImage = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      setFilename(file.name);
      setProgress(0);

      let loadProgress = 0;
      const interval = setInterval(() => {
        loadProgress += 20;
        setProgress(loadProgress);
        if (loadProgress >= 100) {
          clearInterval(interval);
          setImage(file);
          setLoading(false);
          if (onUpload) {
            onUpload(URL.createObjectURL(file));
          }
        }
      }, 200);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setFilename(file.name);
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 border p-4 rounded-lg">
        Upload Image
      </label>
      {filename && (
        <div className="relative mt-2 border p-2 rounded-lg cursor-pointer group">
          <div className="flex items-center justify-between">
            <span>{filename}</span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => handleOpenModal("view")} variant="outline">View</Button>
              <Button onClick={() => handleOpenModal("edit")} variant="outline">Edit</Button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{modalType === "view" ? "View Image" : "Edit Image"}</DialogTitle>
        <DialogContent>
          {modalType === "view" && image && (
            <div className="rounded-2xl">
              <img src={URL.createObjectURL(image)} alt="Uploaded Preview" style={{ maxWidth: "100%", borderRadius: "24px" }} />
            </div>
          )}
          {modalType === "edit" && (
            <input type="file" accept="image/*" onChange={handleEditFileChange} style={{ width: "100%" }} />
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerImage;
