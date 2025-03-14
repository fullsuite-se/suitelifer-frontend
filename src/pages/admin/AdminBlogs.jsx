import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import FileUploaderProvider from "../../components/admin/FileUploader";
import TextEditor from "../../components/TextEditor";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", image: "" });

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

  const addOrUpdateBlog = () => {
    if (editingBlog) {
      setRowBlogData((prevData) =>
        prevData.map((blog) =>
          blog.id === editingBlog.id ? { ...editingBlog } : blog
        )
      );
    } else {
      const newEntry = {
        ...newBlog,
        id: Date.now().toString(),
        datePublished: { seconds: Math.floor(Date.now() / 1000) },
        comments: 0,
        views: 0,
        image: newBlog.image || "https://via.placeholder.com/150",
      };

      setRowBlogData((prevData) => [...prevData, newEntry]);
    }

    setShowModal(false);
    setEditingBlog(null);
    setNewBlog({ title: "", author: "", image: "" });
  };

  const companyBlogData = [
    {
      id: "1",
      title: "Company Growth Strategies for 2025",
      author: "CEO John Doe",
      datePublished: { seconds: 1616161616 },
      comments: 325,
      views: 9456,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "2",
      title: "Sustainability Initiatives in Our Business",
      author: "Jane Smith",
      datePublished: { seconds: 1616161626 },
      comments: 54545,
      views: 95853453,
      image: "https://i.mydramalist.com/eJ8Dd_5c.jpg",
    },
    {
      id: "3",
      title: "The Future of AI in Business Operations",
      author: "Michael Lee",
      datePublished: { seconds: 1616161636 },
      comments: 1200,
      views: 123456,
      image: "https://i.mydramalist.com/jBq4b_5f.jpg",
    },
    {
      id: "4",
      title: "Remote Work: The New Normal?",
      author: "Sophia Chen",
      datePublished: { seconds: 1616161646 },
      comments: 875,
      views: 65432,
      image:
        "https://od2-image-api.abs-cbn.com/prod/editorImage/1735922206940SHOWTIME-JM-On-Unforgettable-Firsts-Main.jpg",
    },
    {
      id: "5",
      title: "Marketing Trends to Watch in 2025",
      author: "David Brown",
      datePublished: { seconds: 1616161656 },
      comments: 2345,
      views: 789654,
      image:
        "https://cdn-images.dzcdn.net/images/artist/53df60edbde3b362ebe1b6f8936a5545/1900x1900-000000-80-0-0.jpg",
    },
    {
      id: "7",
      title: "Employee Well-being and Productivity",
      author: "Olivia Martinez",
      datePublished: { seconds: 1616161676 },
      comments: 432,
      views: 98765,
      image:
        "https://www.vivaartistsagency.ph/wp-content/uploads/2020/01/ANNE-CURTIS.jpg",
    },
  ];

  const employeeBlogData = [
    {
      id: "3",
      title: "How I Learned React in 3 Months",
      author: "Alice Johnson",
      datePublished: { seconds: 1616161636 },
      comments: 35123,
      views: 156,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "4",
      title: "Work-Life Balance Tips from a Remote Worker",
      author: "Bob Williams",
      datePublished: { seconds: 1616161646 },
      comments: 6912334,
      views: 480,
      image: "https://i.mydramalist.com/eJ8Dd_5c.jpg",
    },
    {
      id: "5",
      title: "Mastering Time Management as a Developer",
      author: "Chris Evans",
      datePublished: { seconds: 1616161656 },
      comments: 872,
      views: 12000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "6",
      title: "Overcoming Imposter Syndrome in Tech",
      author: "Jessica Smith",
      datePublished: { seconds: 1616161666 },
      comments: 1456,
      views: 65432,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "7",
      title: "The Power of Networking for Career Growth",
      author: "Daniel White",
      datePublished: { seconds: 1616161676 },
      comments: 678,
      views: 7654,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "8",
      title: "Lessons from My First Year as a Software Engineer",
      author: "Megan Taylor",
      datePublished: { seconds: 1616161686 },
      comments: 2345,
      views: 98765,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      id: "9",
      title: "How to Stay Motivated While Working Remotely",
      author: "Ethan Harris",
      datePublished: { seconds: 1616161696 },
      comments: 453,
      views: 5432,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
  ];

  const [selectedBlog, setSelectedBlog] = useState("company");
  const [rowBlogData, setRowBlogData] = useState(companyBlogData);

  const toggleBlogData = () => {
    setSelectedBlog(selectedBlog === "company" ? "employee" : "company");
    setRowBlogData(
      selectedBlog === "company" ? employeeBlogData : companyBlogData
    );
    console.log("Blog Data:", rowBlogData);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRowBlogData(rowBlogData.filter((blog) => blog.id !== id));
  };

  return (
    <>
      {!location.pathname.includes("/blog/details/") ? (
        <>
          <header className="container flex h-12 items-center justify-between flex-wrap">
            <div className="flex gap-4 items-center">
              <button className="sm:hidden">
                <AppsIcon sx={{ fontSize: "48px" }} />
              </button>
              <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={toggleBlogData}>
                {selectedBlog === "company" ? "Employee Blog" : "Company Blog"}
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingBlog(null);
                  setNewBlog({ title: "", author: "" });
                  setShowModal(true);
                }}
              >
                + Add Blog
              </button>
            </div>
          </header>

          <div className="flex gap-4">
            {/* Blog Table */}
            <div
              className="ag-theme-quartz p-5 w-600"
              style={{ height: "800px" }}
            >
              <AgGridReact
                rowData={rowBlogData}
                columnDefs={[
                  {
                    headerName: "Title",
                    field: "title",
                    flex: 2,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
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
                    headerName: "Action",
                    field: "action",
                    flex: 1,
                    headerClass: "text-primary font-bold bg-tertiary",
                    cellRenderer: (params) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
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
                      </div>
                    ),
                  },
                ]}
                defaultColDef={{
                  filter: "agTextColumnFilter",
                  floatingFilter: true,
                  sortable: true,
                }}
                gridOptions={{
                  getRowStyle: (params) => {
                    if (params.node.rowIndex % 2 === 0) {
                      return { background: "#ECF1E3", color: "black" };
                    } else {
                      return { background: "white", color: "black" };
                    }
                  },
                }}
                pagination
                paginationPageSize={15}
              />
            </div>

            {/* Recent Blogs Panel */}
            <div className="w-full p-4 bg-white rounded-lg border-4 border-accent-2">
              <h2 className="text-lg font-semibold mb-4">Blogs</h2>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "700px", width: "400px" }}
              >
                {rowBlogData.slice(0, 20).map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-3 mb-4 p-3 bg-accent-2 rounded-lg shadow"
                  >
                    <img
                      src={blog.image || "https://via.placeholder.com/150"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-white font-avenir-black">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-secondary">by {blog.author}</p>
                      <div className="text-xs text-black flex gap-2 mt-1">
                        <span>💬 {formatNumber(blog.comments)} comments</span>
                        <span>👁 {formatNumber(blog.views)} views</span>

                        <button
                          className="font-avenir-black text-accent-1 text-xs"
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add/Edit Blog Modal */}
          <Dialog open={showModal} onClose={() => setShowModal(false)}>
            <DialogTitle>
              {editingBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Author"
                fullWidth
                margin="normal"
                value={editingBlog?.author || newBlog.author}
                onChange={(e) =>
                  editingBlog
                    ? setEditingBlog({ ...editingBlog, author: e.target.value })
                    : setNewBlog({ ...newBlog, author: e.target.value })
                }
              />
              <TextEditor
                titleChange={(value) => {
                  const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
                  editingBlog
                    ? setEditingBlog({ ...editingBlog, title: plainText })
                    : setNewBlog({ ...newBlog, title: plainText });
                }}
              />

              <FileUploaderProvider
                onUpload={(fileUrl) => {
                  console.log("File uploaded:", fileUrl);
                  if (editingBlog) {
                    setEditingBlog((prev) => ({ ...prev, image: fileUrl }));
                  } else {
                    setNewBlog((prev) => ({ ...prev, image: fileUrl }));
                  }
                }}
              />

              <button
                className="btn-primary flex-end w-full"
                onClick={addOrUpdateBlog}
              >
                {editingBlog ? "Update" : "Add"}
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

export default AdminBlog;
