import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const FileUploader = () => {
  const [attachments, setAttachments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleDelete = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const saveEdit = () => {
    if (editingFileIndex !== null) {
      const updatedFiles = [...attachments];
      updatedFiles[editingFileIndex] = new File(
        [attachments[editingFileIndex]],
        newFileName,
        {
          type: attachments[editingFileIndex].type,
        }
      );
      setAttachments(updatedFiles);
      setEditingFileIndex(null);
      setNewFileName("");
    }
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
      {attachments.length > 3 && (
        <div className="items-center justify-center flex">
          <Button variant="contained" onClick={() => setShowModal(true)}>
            See More
          </Button>
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
                <Button variant="outlined" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
          {editingFileIndex !== null && (
            <div>
              <TextField
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                label="New File Name"
                fullWidth
              />
              <DialogActions>
                <Button onClick={() => setEditingFileIndex(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit} variant="contained">
                  Save
                </Button>
              </DialogActions>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploader;
