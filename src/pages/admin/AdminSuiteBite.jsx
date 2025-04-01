import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import logofsfull from "../../assets/logos/logo-suitebite.svg";
import FileUploaderProvider from "../../components/admin/FileUploader";
import ContentEditor from "../../components/ContentEditor";
import PreviewIcon from "@mui/icons-material/Preview";
import formatTimestamp from "../../components/TimestampFormatter";
import FeedIcon from "@mui/icons-material/Feed";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminSuiteBite = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({ title: "", author: "", image: "" });
  const navigate = useNavigate();

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

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
        image:
          newNews.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREPVIcCkWNGNzUzt3wUfZhY-I09Z0Rn-jc4g&s",
      };
      setRowNewsData((prevData) => [...prevData, newEntry]);
    }

    setShowModal(false);
    setEditingNews(null);
    setNewNews({ title: "", author: "", image: "" });
  };

  const handleEdit = (news) => {
    setEditingNews({ ...news });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRowNewsData((prevData) => prevData.filter((news) => news.id !== id));
  };

  const [rowNewsData, setRowNewsData] = useState([]);

  return (
    <>
      {!location.pathname.includes("/news/details/") ? (
        <>
          <header className="container flex h-12 items-center justify-between flex-wrap">
            <div className="hidden lg:flex md-flex gap-4 items-center ">
              <img src={logofsfull} alt="SuiteBite Logo" className="h-8" />
            </div>
            <div className="flex">
              <button className="hidden sm:block btn-primary" onClick={() => navigate("/app/news/new-news")}>
                + Add News
              </button>
              <button className="sm:hidden p-2 btn-primary" onClick={() => setShowModal(true)}>
                <span>+</span> <FeedIcon />
              </button>
            </div>
          </header>

          <div className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full" style={{ height: "auto" }}>
            <AgGridReact
              rowData={rowNewsData}
              columnDefs={[]}
              defaultColDef={{ filter: "agTextColumnFilter", floatingFilter: true, sortable: true }}
              domLayout="autoHeight"
              pagination
              paginationPageSize={5}
            />
          </div>

          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle className="w-full text-center">{editingNews ? "Edit News" : "Add News"}</DialogTitle>
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
              <ContentEditor
                titleChange={(value) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, title: value })
                    : setNewNews({ ...newNews, title: value })
                }
              />
              <FileUploaderProvider
                onUpload={(fileUrl) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, image: fileUrl })
                    : setNewNews({ ...newNews, image: fileUrl })
                }
              />
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

export default AdminSuiteBite;
