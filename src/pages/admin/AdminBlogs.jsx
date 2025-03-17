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
import { motion } from "framer-motion";
import PreviewIcon from "@mui/icons-material/Preview";

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
      title: "Company Growth Strategies for 2025",
      author: "CEO John Doe",
      datePublished: { seconds: 1616161616 },
      comments: 325,
      views: 9456,
      likes: 3455,
      flex: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "Sustainability Initiatives in Our Business",
      author: "Jane Smith",
      datePublished: { seconds: 1616161626 },
      comments: 54545,
      views: 95853453,
      likes: 94,
      flex: 1,
      image: "https://i.mydramalist.com/eJ8Dd_5c.jpg",
    },
    {
      title: "The Future of AI in Business Operations",
      author: "Michael Lee",
      datePublished: { seconds: 1616161636 },
      comments: 1200,
      views: 123456,
      likes: 23904,
      flex: 2,
      image: "https://i.mydramalist.com/jBq4b_5f.jpg",
    },
    {
      title: "Remote Work: The New Normal?",
      author: "Sophia Chen",
      datePublished: { seconds: 1616161646 },
      comments: 875,
      views: 65432,
      likes: 82394,
      image:
        "https://od2-image-api.abs-cbn.com/prod/editorImage/1735922206940SHOWTIME-JM-On-Unforgettable-Firsts-Main.jpg",
    },
    {
      title: "Marketing Trends to Watch in 2025",
      author: "David Brown",
      datePublished: { seconds: 1616161656 },
      comments: 2345,
      views: 789654,
      likes: 904,
      image:
        "https://cdn-images.dzcdn.net/images/artist/53df60edbde3b362ebe1b6f8936a5545/1900x1900-000000-80-0-0.jpg",
    },
    {
      title: "Employee Well-being and Productivity",
      author: "Olivia Martinez",
      datePublished: { seconds: 1616161676 },
      comments: 432,
      views: 98765,
      likes: 982,
      image:
        "https://www.vivaartistsagency.ph/wp-content/uploads/2020/01/ANNE-CURTIS.jpg",
    },
  ];

  const employeeBlogData = [
    {
      title: "How I Learned React in 3 Months",
      author: "Alice Johnson",
      datePublished: { seconds: 1616161636 },
      comments: 35123,
      views: 156,
      likes: 4,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "Work-Life Balance Tips from a Remote Worker",
      author: "Bob Williams",
      datePublished: { seconds: 1616161646 },
      comments: 6912334,
      views: 480,
      likes: 3904,
      image: "https://i.mydramalist.com/eJ8Dd_5c.jpg",
    },
    {
      title: "Mastering Time Management as a Developer",
      author: "Chris Evans",
      datePublished: { seconds: 1616161656 },
      comments: 872,
      views: 12000,
      likes: 9823904,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "Overcoming Imposter Syndrome in Tech",
      author: "Jessica Smith",
      datePublished: { seconds: 1616161666 },
      comments: 1456,
      views: 65432,
      likes: 493090,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "The Power of Networking for Career Growth",
      author: "Daniel White",
      datePublished: { seconds: 1616161676 },
      comments: 678,
      views: 7654,
      likes: 8548,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "Lessons from My First Year as a Software Engineer",
      author: "Megan Taylor",
      datePublished: { seconds: 1616161686 },
      comments: 2345,
      views: 98765,
      likes: 89435,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
    },
    {
      title: "How to Stay Motivated While Working Remotely",
      author: "Ethan Harris",
      datePublished: { seconds: 1616161696 },
      comments: 453,
      views: 5432,
      likes: 33,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtp0yBOpspCBHdj3aWQOrpZuC7K9fzfmNImA&s",
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

  const totalBlogs = rowBlogData.length;
  const totalComments = rowBlogData.reduce(
    (sum, blog) => sum + (blog.comments || 0),
    0
  );
  const totalViews = rowBlogData.reduce(
    (sum, blog) => sum + (blog.views || 0),
    0
  );
  const totalLikes = rowBlogData.reduce(
    (sum, blog) => sum + (blog.likes || 0),
    0
  );
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

          <div className="flex gap-4 p-4 bg-white shadow-md rounded-lg mb-4">
            <div className="p-4 bg-gray-200 rounded-lg w-80 h-10 items-center justify-between flex">
              <span className="text-lg font-bold">Total Blogs</span>
              <span className="text-2xl">{formatNumber(totalBlogs)}</span>
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
            {/* Blog Table */}
            <div
              className="ag-theme-quartz p-5 w-600"
              style={{ height: "700px" }}
            >
              <AgGridReact
                rowData={rowBlogData}
                columnDefs={[
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
                            width: "100px",
                            height: "100px",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      );
                    },
                  },
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
                    headerName: "Views",
                    field: "views",
                    flex: 1,
                    filter: "agTextColumnFilter",
                    valueGetter: (params) => formatNumber(params.data.views),
                    headerClass: "text-primary font-bold bg-tertiary",
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
                    flex: 2,
                    filter: "agTextColumnFilter",
                    headerClass: "text-primary font-bold bg-tertiary",
                    valueGetter: (params) => formatNumber(params.data.comments),
                  },
                  {
                    headerName: "Action",
                    field: "action",
                    flex: 1,
                    headerClass:
                      "text-primary font-bold bg-tertiary flex items-center justify-center text-center w-full h-full",

                    cellRenderer: (params) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                          alignItems: "center",
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
                        <button
                          className=""
                          onClick={() => {
                            navigate(`details/${blogId}`);
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

            {/* Recent Blogs Panel */}
            {/* <div className="w-full p-2 bg-white rounded-lg border-1 border-secondary h-full">
              <div className="p-2 text-center w-full flex justify-end">
                <motion.span
                  initial={{ x: -200 }}
                  animate={{ x: 55 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full text-4xl font-bold font-avenir-black mb-4 text-primary inline-block"
                >
                  Blog
                </motion.span>
                <motion.span
                  initial={{ x: 200 }}
                  animate={{ x: -55 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full text-4xl font-bold font-avenir-black mb-4 inline-block "
                >
                  Spot
                </motion.span>
              </div>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "620px", width: "400px" }}
              >
                {rowBlogData.slice(0, 10).map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow border-1 border-secondary"
                  >
                    <img
                      src={blog.image}
                      className="w-16 h-16 object-cover rounded-lg border-1 "
                      alt={blog.title}
                    />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-black">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-black">by {blog.author}</p>
                      <div className="text-xs text-black flex gap-2 mt-1">
                        <span>💬 {formatNumber(blog.comments)}</span>
                        <span>👁 {formatNumber(blog.views)}</span>
                        <span>❤️ {formatNumber(blog.likes)}</span>
                        <button
                          className="text-accent-2 text-xs"
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
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
