import { useState, createContext, useContext } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const FileUploadContext = createContext();

export const useFileUpload = () => useContext(FileUploadContext);

const FileUploaderProvider = ({ onUpload, children }) => {
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file)); 

    setAttachments([...attachments, ...files]);

    if (onUpload) {
      onUpload(fileURLs[0]); 
    }
  };

  const handleDelete = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <FileUploadContext.Provider value={{ attachments }}>
      {children}
      <div>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />


        <div className="flex mt-4">
          <label
            htmlFor="file-upload"
            className="btn-light w-full text-center cursor-pointer"
          >
            Upload File
          </label>
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div className="flex w-180 justify-between items-center">
            {attachments.slice(0, 4).map((file, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded Preview ${index + 1}`}
                    style={{
                      maxWidth: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      padding: "5px",
                    }}
                  />
                ) : (
                  <p>
                    <strong>File:</strong> {file.name}{" "}
                    <a
                      href={URL.createObjectURL(file)}
                      download={file.name}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      (Download)
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {attachments.length > 4 && (
          <div className="items-center justify-center flex">
            <button className="btn-light" onClick={() => setShowModal(true)}>
              See More
            </button>
          </div>
        )}

        {/* View All Attachments */}
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>All Attachments</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {attachments.map((file, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded Preview ${index + 1}`}
                      style={{
                        maxWidth: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        padding: "5px",
                      }}
                    />
                  ) : (
                    <p>{file.name}</p>
                  )}
                  <button
                    className="btn-light"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div className="btn-light h-10 flex flex-end w-full items-center justify-center">
                <button
                  className="btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </FileUploadContext.Provider>
  );
};

export default FileUploaderProvider;
