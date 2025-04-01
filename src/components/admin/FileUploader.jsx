import { useState, createContext, useContext } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const FileUploadContext = createContext();

export const useFileUpload = () => useContext(FileUploadContext);

const FileUploaderProvider = ({ onUpload, children }) => {
  const [heroImage, setHeroImage] = useState(null);
  const [storyImage, setStoryImage] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [heroFilename, setHeroFilename] = useState("");
  const [storyFilename, setStoryFilename] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImageType, setEditImageType] = useState(""); // To determine if we're editing hero or story image

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

  const handleViewImage = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleEditImage = (imageType) => {
    setEditImageType(imageType);
    setShowEditModal(true); 
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

  return (
    <FileUploadContext.Provider value={{ heroImage, storyImage }}>
      {children}
      <div className="grid grid-cols-2 gap-4 ">        
        <div className="items-center justify-center w-full">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setHeroImage, setHeroFilename, setHeroLoading, setHeroProgress)}
            style={{ display: "none" }}
            id="hero-upload"
          />
          <label htmlFor="hero-upload" className="btn-light w-full text-center cursor-pointer justify-center items-center">
            Upload Hero Image
          </label>
          {heroFilename && (
            <div className="relative mt-2 border-1 text-center w-full p-1 rounded-lg cursor-pointer group h-15 flex items-center justify-center">
            <div className="flex text-center w-full items-center justify-center group-hover:blur-sm">{heroFilename}</div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <button className="btn-light mx-2 bg-primary" onClick={() => handleViewImage(heroImage)}>View</button>
              <button className="btn-light mx-2" onClick={() => handleEditImage("story")}>Edit</button>
            </div>
          </div>
          )}
          {heroLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${heroProgress}%` }}></div>
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setStoryImage, setStoryFilename, setStoryLoading, setStoryProgress)}
            style={{ display: "none" }}
            id="story-upload"
          />
          <label htmlFor="story-upload" className="btn-light w-full text-center cursor-pointer">
            Upload Story Image
          </label>
          {storyFilename && (
            <div className="relative mt-2 border-1 text-center w-full p-1 rounded-lg cursor-pointer group h-15 flex items-center justify-center">
              <div className="flex text-center w-full items-center justify-center group-hover:blur-sm">{storyFilename}</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <button className="btn-light mx-2 bg-primary" onClick={() => handleViewImage(storyImage)}>View</button>
                <button className="btn-light mx-2" onClick={() => handleEditImage("story")}>Edit</button>
              </div>
            </div>
          )}
          {storyLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${storyProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>View Image</DialogTitle>
        <DialogContent>
          {modalImage && (
            <div className="rounded-2xl">
              <img
                src={URL.createObjectURL(modalImage)}
                alt="Uploaded Preview"
                style={{ maxWidth: "100%", borderRadius: "24px" }}
              />
            </div>
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <button className="btn-light" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Image Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleEditFileChange}
            style={{ width: "100%" }}
          />
          <div className="flex justify-center mt-4 space-x-4">
            <button className="btn-light" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button className="btn-light" onClick={() => setShowEditModal(false)}>
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </FileUploadContext.Provider>
  );
};

export default FileUploaderProvider;
