import { useState, useRef, createContext, useContext } from "react";
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

function NewsArticle() {
  const gridRef = useRef();

  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFilename, setImageFilename] = useState("");
  const [newsletterData, setNewsletterData] = useState([
    {
      newsId: "1",
      title: "New Features Released",
      article: "We just rolled out new updates to our platform.",
      imageUrl:
        "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-15.jpg",
      createdAt: "2023-08-10",
      createdBy: "Melbraei Santiago",
    },
    {
      newsId: "2",
      title: "New Features Released",
      article: "We just rolled out new updates to our platform.",
      imageUrl:
        "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-15.jpg",
      createdAt: "2023-08-10",
      createdBy: "Melbraei Santiago",
    },
    {
      newsId: "3",
      title: "New Features Released",
      article: "We just rolled out new updates to our platform.",
      imageUrl:
        "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-15.jpg",
      createdAt: "2023-08-10",
      createdBy: "Melbraei Santiago",
    },
  ]);

  const [currentNews, setCurrentNews] = useState({
    newsId: "",
    title: "",
    article: "",
    imageUrl: "",
    createdBy: "Melbraei Santiago",
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
    if (currentNews.newsId) {
      setNewsletterData((prev) =>
        prev.map((item) =>
          item.newsId === currentNews.newsId ? currentNews : item
        )
      );
    } else {
      const newEntry = {
        ...currentNews,
        newsId: Date.now().toString(),
        createdAt: new Date().toISOString(),
        imageUrl: currentNews.imageUrl || "https://via.placeholder.com/150",
      };
      setNewsletterData((prev) => [...prev, newEntry]);
    }

    setCurrentNews({
      newsId: "",
      title: "",
      article: "",
      imageUrl: "",
      createdBy: "Admin",
    });
    setOpenDialog(false);
    setImageFilename("");
  };

  const handleEdit = (item) => {
    setCurrentNews(item);
    setOpenDialog(true);
  };

  const handleDelete = (newsId) => {
    setNewsletterData((prev) => prev.filter((item) => item.newsId !== newsId));
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
            <span>News Article</span>
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
              flex: 2,
              filter: "agTextColumnFilter",
              cellRenderer: (params) =>
                params.value ? (
                  <img
                    src={params.value}
                    alt="NewsImage"
                    className="w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] rounded-md object-cover mx-auto p-2"
                  />
                ) : (
                  <span>No Image</span>
                ),
            },

            { headerName: "Title", field: "title", flex: 1.5 },
            { headerName: "Article", field: "article", flex: 2 },
            {
              headerName: "Created At",
              field: "createdAt",
              flex: 1,
              valueGetter: (params) =>
                new Date(params.data.createdAt).toLocaleString(),
            },
            { headerName: "Created By", field: "createdBy", flex: 1 },
            {
              headerName: "Action",
              field: "action",
              flex: 1,
              cellRenderer: (params) => (
                <div className="flex gap-2">
                  <IconButton onClick={() => handleEdit(params.data)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(params.data.newsId)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ),
            },
          ]}
          defaultColDef={{
            filter: "agTextColumnFilter",
            floatingFilter: true,
            sortable: true,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            },
          }}  
          domLayout="autoHeight"
          rowHeight={
            window.innerWidth < 640 ? 60 : window.innerWidth < 768 ? 70 : 80
          }
          pagination
          paginationPageSize={10}
          paginationPageSizeSelectors={[5, 10, 20]}
          enableBrowserTooltips={true}
          tooltipShowDelay={0}
        />
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentNews.newsId ? "Edit News Article" : "Add News Article"}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center">
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

            <div className="text-md font-bold pt-4 font-avenir-black">
              Title
            </div>
            <input
              name="title"
              value={currentNews.title}
              onChange={(e) =>
                setCurrentNews({ ...currentNews, title: e.target.value })
              }
              rows={2}
              className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary "
            ></input>
            <div className="text-md font-bold pt-4 font-avenir-black">
              Article
            </div>
            <textarea
              name="article"
              value={currentNews.article}
              onChange={(e) =>
                setCurrentNews({ ...currentNews, article: e.target.value })
              }
              rows={8}
              className="w-full p-3 resize-y border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
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

export default NewsArticle;
