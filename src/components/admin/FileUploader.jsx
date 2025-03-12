import { useState } from "react";

const FileUploader = () => {
  const [attachments, setAttachments] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  return (
    <div className="">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ margin: "16px 0" }}
      />

      {attachments.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {attachments
              .slice(0, showAll ? attachments.length : 3)
              .map((file, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded Preview ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        height: "150px",
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
      )}

      {attachments.length > 2 && (
        <div className="items-center justify-center flex">
          <button onClick={() => setShowAll(!showAll)} className="btn-light">
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
