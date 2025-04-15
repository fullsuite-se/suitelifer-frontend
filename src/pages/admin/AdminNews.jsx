import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({
    title: "",
    author: "",
    image: "",
    isShown: "",
  });
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

  // const handleDelete = (id) => {
  //   setRowNewsData((prevData) => prevData.filter((news) => news.id !== id));
  // };

  const newsData = [
    {
      id: "1",
      title: "The Art of Code",
      author: "Alex Mercer",
      datePublished: { seconds: 1716161626 },
      comments: 321,
      views: 12567,
      likes: 876,
      isShown: 1,
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
          {/* <div className="flex my-3 w-fit ml-auto">
            <button
              className="hidden sm:block btn-primary"
              onClick={() => {
                navigate("/app/suitebite/new-suitebite");
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
          </div> */}

          <section className="flex gap-3 [&_*]:rounded-md [&_*]:bg-gray-100 [&_div]:border [&_div]:border-gray-200 [&_*]:flex-1">
            <div className="flex flex-col items-center py-3">
              <span className="text-sm text-center md:text-base">Bites</span>
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
                      headerName: "Visibility",
                      field: "isShown",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-gray-100",
                      valueFormatter: (params) =>
                        params.value === 1 ? "Shown" : "Hidden",
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
                          {/* <button
                            className="btn-delete"
                            onClick={() => handleDelete(params.data.id)}
                          >
                            <DeleteIcon />
                          </button> */}
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

          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "16px",
                padding: "20px",
                width: "600px",
              },
            }}
          >
            
            <DialogTitle className="w-full text-center">
              {editingNews ? "Edit Bite" : "Add Bite"}
            </DialogTitle>
            <DialogContent>
              <div className="text-md font-bold pt-4 font-avenir-black">
                Author
              </div>
              <input
                type="text"
                name="author"
                disabled
                value={editingNews?.author || newNews.author}
                onChange={(e) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, author: e.target.value })
                    : setNewNews({ ...newNews, author: e.target.value })
                }
                className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />

              <div className="text-md font-bold pt-4 font-avenir-black">
                Image
              </div>
              <input
                type="text"
                name="image"
                disabled
                value={editingNews?.image || newNews.image}
                onChange={(e) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, image: e.target.value })
                    : setNewNews({ ...newNews, image: e.target.value })
                }
                className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />
              {/* <ContentEditor
                title={(value) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, title: value })
                    : setNewNews({ ...newNews, title: value })
                }
                onClick={addOrUpdateNews}
              /> */}

              <label className="block text-gray-700 font-avenir-black mt-4">
                Visibility
              </label>
              <select
                name="is_shown"
                required
                value={editingNews?.isShown || newNews.isShown}
                onChange={(e) =>
                  editingNews
                    ? setEditingNews({
                        ...editingNews,
                        isShown: e.target.value,
                      })
                    : setNewNews({ ...newNews, isShown: e.target.value })
                }
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                <option value={1}>Shown</option>
                <option value={0}>Hidden</option>
              </select>

              {/* <FileUploaderProvider
                onUpload={(fileUrl) =>
                  editingNews
                    ? setEditingNews({ ...editingNews, image: fileUrl })
                    : setNewNews({ ...newNews, image: fileUrl })
                }
              /> */}

              <div className="flex gap-2 mt-4">
                <button
                  className="flex justify-center w-full mt-2 btn-light hover:bg-gray-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary flex-end w-full"
                  onClick={addOrUpdateNews}
                >
                  {editingNews ? "Update" : "Add"}
                </button>
              </div>
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
