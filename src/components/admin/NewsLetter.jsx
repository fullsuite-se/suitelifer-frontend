"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function NewsLetter() {
  const gridRef = useRef();

  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFilename, setImageFilename] = useState("");

  const [newsletterData, setNewsletterData] = useState([
    {
      id: "1",
      textPhrase: "Stay Updated",
      title: "New Features Released",
      article: "We just rolled out new updates...",
      imageUrl: "https://via.placeholder.com/150",
      created_at: "2023-08-10",
      created_by: "Admin",
    },
  ]);

  const [currentNews, setCurrentNews] = useState({
    id: "",
    textPhrase: "",
    title: "",
    article: "",
    imageUrl: "",
    created_by: "Admin",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploading(true);
      setImageFilename(file.name);
      setUploadProgress(0);

      let loadProgress = 0;
      const interval = setInterval(() => {
        loadProgress += 25;
        setUploadProgress(loadProgress);
        if (loadProgress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
            setCurrentNews((prev) => ({
              ...prev,
              imageUrl: reader.result,
            }));
          };
          reader.readAsDataURL(file);
          setUploading(false);
        }
      }, 200);
    }
  };

  const handleSave = () => {
    if (currentNews.id) {
      setNewsletterData((prev) =>
        prev.map((item) => (item.id === currentNews.id ? currentNews : item))
      );
    } else {
      const newEntry = {
        ...currentNews,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        imageUrl: currentNews.imageUrl || "https://via.placeholder.com/150",
      };
      setNewsletterData((prev) => [...prev, newEntry]);
    }

    setCurrentNews({
      id: "",
      textPhrase: "",
      title: "",
      article: "",
      imageUrl: "",
      created_by: "Admin",
    });
    setOpenDialog(false);
    setImageFilename("");
  };

  const handleEdit = (item) => {
    setCurrentNews(item);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setNewsletterData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setOpenDialog(true)}
          className="btn-primary mb-2"
        >
          <div className="flex items-center gap-1">
            <ControlPointIcon fontSize="small" />
            <span>Add Newsletter</span>
          </div>
        </button>
      </div>

      <div
        className="ag-theme-quartz"
        style={{ height: "600px", width: "100%" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={newsletterData}
          columnDefs={[
            {
              headerName: "Image",
              field: "imageUrl",
              flex: 1,
              cellRenderer: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="Newsletter"
                    className="w-[80px] h-[80px] rounded-md object-cover mx-auto"
                  />
                ) : (
                  "No Image"
                ),
            },
            { headerName: "Text Phrase", field: "textPhrase", flex: 1 },
            { headerName: "Title", field: "title", flex: 1.5 },
            { headerName: "Article", field: "article", flex: 2 },
            {
              headerName: "Created At",
              field: "created_at",
              flex: 1,
              valueGetter: (params) =>
                new Date(params.data.created_at).toLocaleString(),
            },
            { headerName: "Created By", field: "created_by", flex: 1 },
            {
              headerName: "Action",
              field: "action",
              flex: 1,
              cellRenderer: (params) => (
                <div className="flex gap-2">
                  <IconButton onClick={() => handleEdit(params.data)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(params.data.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ),
            },
          ]}
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
          }}
          pagination
          paginationPageSize={5}
        />
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentNews.id ? "Edit Newsletter" : "Add Newsletter"}
        </DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="btn-light"
            >
              Upload Image
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            {uploading && (
              <div className="mt-2 w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-primary h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {imageFilename && (
              <div className="mt-2 text-sm text-gray-600">
                Uploaded: {imageFilename}
              </div>
            )}
          </div>

          <input
            type="text"
            name="textPhrase"
            placeholder="Text Phrase"
            value={currentNews.textPhrase}
            onChange={(e) =>
              setCurrentNews({ ...currentNews, textPhrase: e.target.value })
            }
            className="input mb-4"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={currentNews.title}
            onChange={(e) =>
              setCurrentNews({ ...currentNews, title: e.target.value })
            }
            className="input mb-4"
          />
          <textarea
            name="article"
            rows={4}
            placeholder="Article"
            value={currentNews.article}
            onChange={(e) =>
              setCurrentNews({ ...currentNews, article: e.target.value })
            }
            className="input"
          />
        </DialogContent>
        <DialogActions>
          <button className="btn-light" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewsLetter;
