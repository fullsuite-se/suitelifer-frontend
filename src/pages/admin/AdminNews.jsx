import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { Outlet, useLocation } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import FileUploaderProvider from "../../components/admin/FileUploader";
import TextEditor from "../../components/TextEditor";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({ title: "", author: "", image: "" });
  const [rowNewsData, setRowNewsData] = useState([]);

  const addOrUpdateNews = () => {
    if (editingNews) {
      setRowNewsData((prevData) =>
        prevData.map((news) => (news.id === editingNews.id ? { ...editingNews } : news))
      );
    } else {
      const newEntry = {
        ...newNews,
        id: Date.now().toString(),
        datePublished: { seconds: Math.floor(Date.now() / 1000) },
        comments: 0,
        views: 0,
        image: newNews.image || "https://via.placeholder.com/150",
      };
      setRowNewsData((prevData) => [...prevData, newEntry]);
    }
    setShowModal(false);
    setEditingNews(null);
    setNewNews({ title: "", author: "", image: "" });
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRowNewsData(rowNewsData.filter((news) => news.id !== id));
  };

  return (
    <>
      {!location.pathname.includes("/news/details/") ? (
        <>
          <header className="container flex h-12 items-center justify-between flex-wrap">
            <div className="flex gap-4 items-center">
              <button className="sm:hidden">
                <AppsIcon sx={{ fontSize: "48px" }} />
              </button>
              <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Add News
            </button>
          </header>

          <div className="flex gap-4">
            <div className="ag-theme-quartz p-5 w-600" style={{ height: "800px" }}>
              <AgGridReact
                rowData={rowNewsData}
                columnDefs={[
                  { headerName: "Title", field: "title", flex: 2, filter: "agTextColumnFilter" },
                  { headerName: "Author", field: "author", flex: 1, filter: "agTextColumnFilter" },
                  {
                    headerName: "Date Published",
                    field: "datePublished",
                    flex: 1,
                    valueGetter: (params) =>
                      new Date(params.data.datePublished.seconds * 1000).toLocaleString(),
                  },
                  {
                    headerName: "Action",
                    field: "action",
                    flex: 1,
                    cellRenderer: (params) => (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button className="btn-update" onClick={() => handleEdit(params.data)}>
                          <EditIcon />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(params.data.id)}>
                          <DeleteIcon />
                        </button>
                      </div>
                    ),
                  },
                ]}
                defaultColDef={{ filter: "agTextColumnFilter", floatingFilter: true, sortable: true }}
                pagination
                paginationPageSize={15}
              />
            </div>

            <div className="w-full p-4 bg-white rounded-lg border-4 border-accent-2">
              <h2 className="text-lg font-semibold mb-4">Recent News</h2>
              <div className="overflow-y-auto" style={{ maxHeight: "700px", width: "400px" }}>
                {rowNewsData.slice(0, 20).map((news) => (
                  <div key={news.id} className="flex items-center gap-3 mb-4 p-3 bg-accent-2 rounded-lg shadow">
                    <img
                      src={news.image || "https://via.placeholder.com/150"}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-white font-avenir-black">{news.title}</h3>
                      <p className="text-xs text-secondary">by {news.author}</p>
                      <div className="text-xs text-black flex gap-2 mt-1">
                        <span>💬 {news.comments} comments</span>
                        <span>👁 {news.views} views</span>
                        <button className="font-avenir-black text-accent-1 text-xs" onClick={() => handleEdit(news)}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle>{editingNews ? "Edit News" : "Add New News"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Author"
                fullWidth
                margin="normal"
                value={editingNews?.author || newNews.author}
                onChange={(e) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, author: e.target.value })
                    : setNewNews({ ...newNews, author: e.target.value })
                }
              />
              <TextEditor titleChange={(value) => setNewNews({ ...newNews, title: value })} />
              <FileUploaderProvider onUpload={(fileUrl) => setNewNews({ ...newNews, image: fileUrl })} />
              <button className="btn-primary flex-end w-full" onClick={addOrUpdateNews}>
                {editingNews ? "Update" : "Add"}
              </button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default AdminNews;
