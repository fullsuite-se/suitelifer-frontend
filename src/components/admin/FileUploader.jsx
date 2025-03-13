import { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const FileUploader = () => {
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleDelete = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ margin: "16px 0" }}
      />
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
                    maxWidth: "100%",
                    height: "120px",
                    borderRadius: "8px",
                    padding: "5px",
                    display: "flex",
                    justifyContent: "space-between",
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
          <button
            className="btn-light"
            variant="contained"
            onClick={() => setShowModal(true)}
          >
            See More
          </button>
        </div>
      )}
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
              <button classname="btn-light" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploader;
