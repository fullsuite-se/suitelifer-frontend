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
import PreviewIcon from "@mui/icons-material/Preview";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({ title: "", author: "", image: "" });

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
          news.id === editingNews.id ? { ...news, ...editingNews } : news
        )
      );
    } else {
      const newEntry = {
        ...newNews,
        id: Date.now().toString(),
        datePublished: { seconds: Math.floor(Date.now() / 1000) },
        comments: 0,
        views: 0,
        likes: 0,
        image: newNews.image || "https://via.placeholder.com/150",
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
      id: "",
      title: "Marvin Bautista Wanted for Estafa",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161616 },
      comments: 1023,
      views: 25489,
      likes: 4567,
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQGic1L2sEBlGg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707479304553?e=1747267200&v=beta&t=ZjrI_w18mjT_NlZpz34dVSolaLog44oyvCmcaSiqMZk",
    },
    {
      id: "",
      title: "Marvin Bautista Adonis Hunk",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161626 },
      comments: 874,
      views: 65823,
      likes: 2398,
      image:
        "https://img.mensxp.com/media/content/2020/Sep/Male-Celebrities-Who-Have-Dabbled-With-Some-Really-Outlandish-1_5f62130740f8d.jpeg?w=780&h=524&cc=1",
    },
    {
      id: "",
      title: "Viva Film Hunk ",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161636 },
      comments: 567,
      views: 34876,
      likes: 9873,
      image: "https://i.mydramalist.com/jBq4b_5f.jpg",
    },
    {
      id: "",
      title: "Daddy Daddy, Yes Papa",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161646 },
      comments: 1345,
      views: 89234,
      likes: 13567,
      image:
        "https://od2-image-api.abs-cbn.com/prod/editorImage/1735922206940SHOWTIME-JM-On-Unforgettable-Firsts-Main.jpg",
    },
    {
      id: "",
      title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161656 },
      comments: 432,
      views: 54321,
      likes: 6789,
      image:
        "https://www.vivaartistsagency.ph/wp-content/uploads/2020/01/ANNE-CURTIS.jpg",
    },
    {
      id: "",
      title: "The Evolution of Smart Homes and IoT Devices",
      author: "Melbraei Santiago",
      datePublished: { seconds: 1716161676 },
      comments: 789,
      views: 74256,
      likes: 5432,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
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

          <div className="flex gap-4 p-4 bg-white shadow-md rounded-lg mb-4">
            <div className="p-4 bg-gray-200 rounded-lg w-80 h-10 items-center justify-between flex">
              <span className="text-lg font-bold">News</span>
              <span className="text-2xl">{formatNumber(totalNews)}</span>
            </div>
            <div className="p-4 bg-gray-200 rounded-lg w-80 h-10 items-center justify-between flex">
              <span className="text-lg font-bold">Total Comments</span>
              <span className="text-2xl">{formatNumber(totalComments)}</span>
            </div>
            <div className="p-4 bg-gray-200 rounded-lg w-80 h-10 items-center justify-between flex">
              <span className="text-lg font-bold">Total Views</span>
              <span className="text-2xl">{formatNumber(totalViews)}</span>
            </div>
            <div className="p-4 bg-gray-200 rounded-lg w-80 h-10 items-center justify-between flex">
              <span className="text-lg font-bold">Total Likes</span>
              <span className="text-2xl">{formatNumber(totalLikes)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div
              className="ag-theme-quartz p-5 w-600"
              style={{ height: "800px" }}
            >
              <AgGridReact
                rowData={rowNewsData}
                columnDefs={[
                  {
                    headerName: "Title",
                    field: "title",
                    flex: 2,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) =>
                      params.data.title.replace(/<[^>]*>/g, ""),
                  },
                  {
                    headerName: "Author",
                    field: "author",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                  },
                  {
                    headerName: "Date Published",
                    field: "datePublished",
                    flex: 1,
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) =>
                      new Date(
                        params.data.datePublished.seconds * 1000
                      ).toLocaleString(),
                  },
                  {
                    headerName: "Views",
                    field: "views",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) => formatNumber(params.data.views),
                  },
                  {
                    headerName: "Likes",
                    field: "likes",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) => formatNumber(params.data.likes),
                  },
                  {
                    headerName: "Comments",
                    field: "comments",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) => formatNumber(params.data.comments),
                  },
                  {
                    headerName: "Image",
                    field: "image",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    cellRenderer: (params) => {
                      if (!params.value) {
                        return <span>No Image</span>;
                      }
                      return (
                        <img
                          src={params.value}
                          alt="News"
                          style={{
                            width: "100%",
                            maxWidth: "1000px", 
                            height: "auto", 
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      );
                    },
                  },

                  {
                    headerName: "Action",
                    field: "action",
                    flex: 1,
                    headerClass: "text-primary font-bold bg-tertiary",
                    cellRenderer: (params) => (
                      <div style={{ display: "flex", gap: "10px" }}>
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
                          className=""
                          onClick={() => {
                            navigate(`details/${params.data.id}`);
                          }}
                        >
                          <span className="text-sm">
                            <PreviewIcon />
                          </span>
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
                rowHeight={100}
                gridOptions={{
                  getRowStyle: () => ({
                    height: "100px",
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "center",
                  }),
                }}
                pagination
                paginationPageSize={6}
              />
            </div>
          </div>

          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle>
              {editingNews ? "Edit News" : "Add New News"}
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
              <TextEditor
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
