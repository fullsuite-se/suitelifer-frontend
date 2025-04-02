import { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const ImageUploader = ({ onUpload }) => {
  const [heroLoading, setHeroLoading] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [heroFilename, setHeroFilename] = useState("");
  const [storyFilename, setStoryFilename] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [storyImage, setStoryImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImageType, setEditImageType] = useState("");

  const handleFileChange = (e, setImage, setFilename, setLoading, setProgress) => {
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
      if (editImageType === "hero") {
        setHeroImage(file);
        setHeroFilename(file.name);
      } else if (editImageType === "story") {
        setStoryImage(file);
        setStoryFilename(file.name);
      }
    }
  };

  const handleViewImage = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleEditImage = (imageType) => {
    setEditImageType(imageType);
    setShowEditModal(true);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {[["hero", heroFilename, heroImage, setHeroImage, setHeroFilename, heroLoading, setHeroLoading, heroProgress, setHeroProgress],
        ["story", storyFilename, storyImage, setStoryImage, setStoryFilename, storyLoading, setStoryLoading, storyProgress, setStoryProgress]
      ].map(([type, filename, image, setImage, setFilename, loading, setLoading, progress, setProgress]) => (
        <div key={type} className="items-center justify-center w-full">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setImage, setFilename, setLoading, setProgress)}
            style={{ display: "none" }}
            id={`${type}-upload`}
          />
          <label htmlFor={`${type}-upload`} className="btn-light w-full text-center cursor-pointer justify-center items-center">
            Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image
          </label>
          {filename && (
            <div className="relative mt-2 border-1 text-center w-full p-1 rounded-lg cursor-pointer group h-15 flex items-center justify-center">
              <div className="flex text-center w-full items-center justify-center group-hover:blur-sm">{filename}</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <button className="btn-light mx-2 bg-primary" onClick={() => handleViewImage(image)}>View</button>
                <button className="btn-light mx-2" onClick={() => handleEditImage(type)}>Edit</button>
              </div>
            </div>
          )}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      ))}

      {/* View Image Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>View Image</DialogTitle>
        <DialogContent>
          {modalImage && (
            <div className="rounded-2xl">
              <img src={URL.createObjectURL(modalImage)} alt="Uploaded Preview" style={{ maxWidth: "100%", borderRadius: "24px" }} />
            </div>
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <button className="btn-light" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Image Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleEditFileChange} style={{ width: "100%" }} />
          <div className="flex justify-center mt-4 space-x-4">
            <button className="btn-light" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn-light" onClick={() => setShowEditModal(false)}>Done</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
