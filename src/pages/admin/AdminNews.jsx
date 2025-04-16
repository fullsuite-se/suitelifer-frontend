import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../utils/axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminNews = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newNews, setNewNews] = useState({
    title: "",
    description: "",
    image: "",
    isShown: null,
    createdAt: "",
    createdBy: "",
  });

  const addOrUpdateNews = async () => {
    try {
      const payload = {
        ...editingNews,
        ...newNews,
        is_shown: parseInt((editingNews?.isShown ?? newNews.isShown) || 0),
      };

      const response = await api.post("/api/employee-blog", payload);
      const result = response.data;

      if (response.status === 200) {
        const newEntry = {
          ...payload,
          id: result.eblog_id || editingNews?.id || Date.now(),
          datePublished: { seconds: Math.floor(Date.now() / 1000) },
          image:
            payload.image ||
            "https://t4.ftcdn.net/jpg/05/17/53/57/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg",
        };

        if (editingNews) {
          setRowNewsData((prev) =>
            prev.map((news) => (news.id === editingNews.id ? newEntry : news))
          );
        } else {
          setRowNewsData((prev) => [...prev, newEntry]);
        }

        setShowModal(false);
        setEditingNews(null);
        setNewNews({
          title: "",
          author: "",
          image: "",
          isShown: null,
        });
      } else {
        alert("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("An unexpected error occurred.");
    }
  };

  const [rowNewsData, setRowNewsData] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/employee-allblog");
        const result = response.data;

        if (response.status === 200) {
          const formatted = result.map((blog) => ({
            ...blog,
            id: blog.eblogId,
            title: blog.title || "Untitled",
            image:
              blog.images?.[0] ||
              "https://t4.ftcdn.net/jpg/05/17/53/57/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg",
            author: `${blog.firstName} ${blog.middleName || ""} ${
              blog.lastName
            }`.trim(),
            datePublished: blog.createdAt
              ? {
                  seconds: Math.floor(
                    new Date(blog.createdAt).getTime() / 1000
                  ),
                }
              : { seconds: Math.floor(Date.now() / 1000) },
            isShown: blog.is_shown,
          }));

          setRowNewsData(formatted);
        } else {
          console.error("Failed to fetch blogs:", result.error);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
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
                  headerName: "Description",
                  field: "description",
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
                  field: "createdAt",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    new Date(
                      params.data.datePublished.seconds * 1000
                    ).toLocaleString(),
                  hide: window.innerWidth < 768,
                },
                {
                  headerName: "Author",
                  field: "createdBy",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: () => (
                    <div className="flex gap-3">
                      <button>
                        <PencilIcon
                          onClick={setShowModal}
                          className="size-5 text-black"
                        />
                      </button>
                      <button>
                        <TrashIcon className="size-5 text-black" />
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
                window.innerWidth < 640 ? 60 : window.innerWidth < 768 ? 70 : 80
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
          <div className="gap-2 flex flex-col">
            <div className="text-md border-none p-2 rounded-md bg-primary/10 flex">
              <span className="mr-2 font-bold font-avenir-black">Author: </span>{" "}
              <p className="w-full">
                {editingNews
                  ? editingNews.createdBy
                  : newNews.createdBy || "N/A"}
              </p>
            </div>

            <div className="text-md border-none p-2 rounded-md bg-primary/10 flex">
              <span className="mr-2 font-bold font-avenir-black">Title: </span>{" "}
              <p className="w-full">
                {editingNews ? editingNews.title : newNews.title || "N/A"}
              </p>
            </div>
            <div className="text-md border-none p-2 rounded-md bg-primary/10 flex">
              <span className="mr-2 font-bold font-avenir-black">Image: </span>{" "}
              <p className="w-full">
                {editingNews ? editingNews.image : newNews.image || "N/A"}
              </p>
            </div>
            <div className="text-md border-none p-2 rounded-md bg-primary/10 flex">
              <span className="mr-2 font-bold font-avenir-black">
                Article:{" "}
              </span>{" "}
              <p className="w-full">
                {editingNews ? editingNews.article : newNews.article || "N/A"}
              </p>
            </div>
          </div>

          <label className="block text-gray-700 font-avenir-black mt-4">
            Visibility
          </label>
          <select
            name="isShown"
            required
            value={
              editingNews
                ? editingNews.isShown?.toString()
                : newNews.isShown?.toString()
            }
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              editingNews
                ? setEditingNews({ ...editingNews, isShown: value })
                : setNewNews({ ...newNews, isShown: value });
            }}
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            <option value={1}>Shown</option>
            <option value={0}>Hidden</option>
          </select>

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
  );
};

export default AdminNews;
