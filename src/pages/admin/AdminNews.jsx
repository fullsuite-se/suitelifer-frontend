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
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import FileUploaderProvider from "../../components/admin/FileUploader";
import ContentEditor from "../../components/ContentEditor";
import PreviewIcon from "@mui/icons-material/Preview";
import formatTimestamp from "../../components/TimestampFormatter";
import FeedIcon from "@mui/icons-material/Feed";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
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
        prevData.map((news) =>
          news.id === editingNews.id ? { ...editingNews } : news
        )
      );
    } else {
      const newEntry = {
        ...newNews,
        id: Date.now().toString(),
        datePublished: { seconds: Math.floor(Date.now() / 1000) },
        comments: 0,
        views: 0,
        image:
          newNews.image ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREPVIcCkWNGNzUzt3wUfZhY-I09Z0Rn-jc4g&s",
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

  const newsData = [
    {
      id: "1",
      title: "The Art of Code",
      author: "Alex Mercer",
      datePublished: { seconds: 1716161626 },
      comments: 321,
      views: 12567,
      likes: 876,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREPVIcCkWNGNzUzt3wUfZhY-I09Z0Rn-jc4g&s",
    },
  ];

  const [rowNewsData, setRowNewsData] = useState(newsData);

  const totalNews = rowNewsData.length;
  const totalComments = rowNewsData.reduce(
    (sum, news) => sum + (news.comments || 0),
    0
  );
  const totalViews = rowNewsData.reduce(
    (sum, news) => sum + (news.views || 0),
    0
  );
  const totalLikes = rowNewsData.reduce(
    (sum, news) => sum + (news.likes || 0),
    0
  );

  return (
    <>
      {!location.pathname.includes("/news/details/") ? (
        <>
          <div className="flex my-3 w-fit ml-auto">
            <button
              className="hidden sm:block btn-primary"
              onClick={() => {
                navigate("/app/news/new-news");
              }}
            >
              + Add News
            </button>

            <button
              className="sm:hidden p-2 btn-primary"
              onClick={() => setShowModal(true)}
            >
              <span>+</span> <FeedIcon />
            </button>
          </div>

          <section className="flex gap-3 [&_*]:rounded-md [&_*]:bg-gray-100 [&_div]:border [&_div]:border-gray-200 [&_*]:flex-1">
            <div className="flex flex-col items-center py-3">
              <span className="text-sm text-center md:text-base">News</span>
              <span className="text-sm text-center md:text-base">
                {formatNumber(totalNews)}
              </span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-sm text-center md:text-base">
                Total Comments
              </span>
              <span className="text-sm text-center md:text-base">
                {formatNumber(totalComments)}
              </span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-sm text-center md:text-base">
                Total Views
              </span>
              <span className="text-sm text-center md:text-base">
                {formatNumber(totalViews)}
              </span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-sm text-center md:text-base">
                Total Likes
              </span>
              <span className="text-sm text-center md:text-base">
                {formatNumber(totalNews)}
              </span>
            </div>
          </section>

          <div className="flex gap-4 mt-3">
            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz min-w-[600px] lg:w-full"
                style={{ height: "auto" }}
              >
                <AgGridReact
                  rowData={rowNewsData}
                  columnDefs={[
                    {
                      headerName: "Image",
                      field: "image",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      cellRenderer: (params) =>
                        params.value ? (
                          <img
                            src={params.value}
                            alt="News"
                            className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-md object-cover mx-auto"
                          />
                        ) : (
                          <span>No Image</span>
                        ),
                    },
                    {
                      headerName: "Title",
                      field: "title",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueGetter: (params) =>
                        params.data.title.replace(/<[^>]*>/g, ""),
                    },
                    {
                      headerName: "Author",
                      field: "author",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      hide: window.innerWidth < 640,
                    },
                    {
                      headerName: "Date Published",
                      field: "datePublished",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueGetter: (params) =>
                        new Date(
                          params.data.datePublished.seconds * 1000
                        ).toLocaleString(),
                      hide: window.innerWidth < 768,
                    },
                    {
                      headerName: "Views",
                      field: "views",
                      flex: 1,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueGetter: (params) => formatNumber(params.data.views),
                    },
                    {
                      headerName: "Likes",
                      field: "likes",
                      flex: 1,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueGetter: (params) => formatNumber(params.data.likes),
                    },
                    {
                      headerName: "Comments",
                      field: "comments",
                      flex: 1,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueGetter: (params) =>
                        formatNumber(params.data.comments),
                      hide: window.innerWidth < 768,
                    },
                    {
                      headerName: "Action",
                      field: "action",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-gray-100",
                      cellRenderer: (params) => (
                        <div className="flex gap-2">
                          <button
                            className="btn-update"
                            onClick={() => handleEdit(params.data)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(params.data.id)}
                          >
                            <DeleteIcon />
                          </button>
                          <button
                            className="btn-preview"
                            onClick={() =>
                              navigate(`details/${params.data.id}`)
                            }
                          >
                            <PreviewIcon />
                          </button>
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
                    window.innerWidth < 640
                      ? 60
                      : window.innerWidth < 768
                      ? 70
                      : 80
                  }
                  pagination
                  paginationPageSize={5}
                  paginationPageSizeSelector={[5, 10, 20, 50]}
                />
              </div>
            </div>
          </div>

          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <div className="relative p-6">
              {" "}
              <button
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <DialogTitle className="w-full text-center">
              {editingNews ? "Edit News" : "Add News"}
            </DialogTitle>
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

              <button
                className="btn-primary flex-end w-full"
                onClick={addOrUpdateNews}
              >
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
