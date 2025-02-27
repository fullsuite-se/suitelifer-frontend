import { useState, useEffect } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Modal,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

const employeeBlogData = [
  {
    id: 1,
    title: "Clever Ways to Celebrate Christmas...",
    author: "Lance Salcedo",
    date: "September 17, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 2,
    title: "Setting Intentions Instead...",
    author: "Hernani Domingo",
    date: "November 11, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 3,
    title: "Physical Development A...",
    author: "Dan Hebron Galano",
    date: "December 4, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 4,
    title: "Liki Trike - A Compact Tr...",
    author: "Kateki",
    date: "December 8, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 5,
    title: "How Doona and Liki Ma...",
    author: "Boss Kenns",
    date: "December 14, 2024",
    views: 0,
    comments: [],
  },
];

const companyBlogData = [
  {
    id: 1,
    title: "Company Growth Strategies...",
    author: "John Doe",
    date: "January 10, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 2,
    title: "New Product Launch...",
    author: "Jane Smith",
    date: "March 15, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 3,
    title: "Annual Financial Report...",
    author: "Michael Johnson",
    date: "June 20, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 4,
    title: "Corporate Social Responsibility...",
    author: "Emily Davis",
    date: "August 25, 2024",
    views: 0,
    comments: [],
  },
  {
    id: 5,
    title: "Employee Wellness Programs...",
    author: "Chris Lee",
    date: "October 30, 2024",
    views: 0,
    comments: [],
  },
];

const AdminBlogs = () => {
  const [activeTab, setActiveTab] = useState("EMPLOYEE BLOGS");
  const [blogs, setBlogs] = useState(employeeBlogData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddBlog = (newBlog, blogType) => {
    if (blogType === "EMPLOYEE BLOGS") {
      setBlogs([...blogs, newBlog]);
    } else {
      setBlogs([...blogs, newBlog]);
    }
  };

  const handleEditBlog = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const handleDeleteBlog = () => {
    setBlogs(blogs.filter((blog) => blog.id !== selectedBlog.id));
    setIsDeleteModalOpen(false);
  };

  const handleTabChange = (event) => {
    const selectedTab = event.target.value;
    setActiveTab(selectedTab);

    if (selectedTab === "ALL BLOGS") {
      setBlogs([...employeeBlogData, ...companyBlogData]);
    } else if (selectedTab === "EMPLOYEE BLOGS") {
      setBlogs(employeeBlogData);
    } else {
      setBlogs(companyBlogData);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="container flex h-16 items-center justify-between">
        <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        <div className="flex gap-2">
          <Button
            variant="outlined"
            sx={{ bgcolor: "#0097b2", color: "#ffffff" }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="mr-2">+</span> ADD BLOG
          </Button>
        </div>
      </header>
      <div className="p-4">
        <Box
          sx={{
            borderBottom: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Blog Type</InputLabel>
            <Select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              label="Blog Type"
            >
              <MenuItem value="ALL BLOGS">ALL BLOGS</MenuItem>
              <MenuItem value="EMPLOYEE BLOGS">EMPLOYEE BLOGS</MenuItem>
              <MenuItem value="COMPANY BLOGS">COMPANY BLOGS</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">Blog Posts</Typography>
              <Typography variant="h4">777</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">Total Comments</Typography>
              <Typography variant="h4">4.5k</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">Total Likes</Typography>
              <Typography variant="h4">7k</Typography>
            </Box>
          </Box>
        </Box>
        <div className="relative max-w-md mx-auto mb-6">
          <TextField
            fullWidth
            placeholder="Search for blogs..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-7/12">
            <BlogTable
              blogs={filteredBlogs}
              onEdit={(blog) => {
                setSelectedBlog(blog);
                setIsEditModalOpen(true);
              }}
              onDelete={(blog) => {
                setSelectedBlog(blog);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
          <div className="lg:w-5/12">
            <RecentBlogsPanel
              blogs={blogs}
              onEdit={(blog) => {
                setSelectedBlog(blog);
                setIsEditModalOpen(true);
              }}
              onDelete={(blog) => {
                setSelectedBlog(blog);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>
      <AddBlogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBlog={handleAddBlog}
        blogType={activeTab}
      />
      {selectedBlog && (
        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          blog={selectedBlog}
          onEditBlog={handleEditBlog}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteConfirm={handleDeleteBlog}
      />
    </main>
  );
};

const BlogTable = ({ blogs, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Author</TableCell>
          <TableCell>Date Published</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {blog.title}
            </TableCell>
            <TableCell>{blog.author}</TableCell>
            <TableCell>{blog.date}</TableCell>
            <TableCell>
              <Button sx={{ color: "black" }} onClick={() => onEdit(blog)}>
                <EditIcon />
              </Button>
              <Button sx={{ color: "black" }} onClick={() => onDelete(blog)}>
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const AddBlogModal = ({ isOpen, onClose, onAddBlog, blogType }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleAddBlog = () => {
    const newBlog = {
      id: Date.now(),
      title,
      author: author || "New Author",
      date: new Date().toLocaleDateString(),
      content,
      attachment,
      views: 0,
      comments: [],
    };
    onAddBlog(newBlog, blogType);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 1,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          Add New {blogType === "EMPLOYEE BLOGS" ? "Employee" : "Company"} Blog
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setTitle(e.target.value);
            }
          }}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          margin="normal"
        />
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
          style={{ margin: "16px 0" }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleAddBlog} variant="contained" color="primary">
            Add Blog
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const EditBlogModal = ({ isOpen, onClose, blog, onEditBlog }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [author, setAuthor] = useState(blog.author);
  const [attachment, setAttachment] = useState(blog.attachment);

  const handleEditBlog = () => {
    const updatedBlog = {
      ...blog,
      title,
      content,
      author,
      attachment,
    };
    onEditBlog(updatedBlog);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 1,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          Edit Blog
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setTitle(e.target.value);
            }
          }}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          margin="normal"
        />
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files[0])}
          style={{ margin: "16px 0" }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleEditBlog} variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onDeleteConfirm }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 1,
        boxShadow: 24,
      }}
    >
      <Typography variant="h6" mb={2}>
        Confirm Deletion
      </Typography>
      <Typography mb={4}>
        Are you sure you want to delete this blog post?
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button onClick={onDeleteConfirm} variant="contained" color="primary">
          Delete
        </Button>
      </Box>
    </Box>
  </Modal>
);

const RecentBlogsPanel = ({ blogs, onEdit, onDelete }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 700,
      bgcolor: "#bfd1a0",
      display: "flex",
      flexDirection: "column",
      p: 1,
      borderRadius: 4,
      height: "60vh",
      overflowY: "auto",
    }}
  >
    <Typography variant="h6" mb={2}>
      Recent Blogs
    </Typography>
    <List sx={{ width: "100%", gap: 2, padding: 2 }}>
      {blogs.slice(0, 4).map((blog) => (
        <ListItem
          key={blog.id}
          alignItems="flex-start"
          sx={{ padding: 2, width: "100%" }}
        >
          <ListItemAvatar>
            <Avatar
              alt={blog.title}
              src={blog.attachment ? URL.createObjectURL(blog.attachment) : ""}
              sx={{ width: 100, height: 56, borderRadius: 4 }}
            />
          </ListItemAvatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <ListItemText
              primary={blog.title}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {blog.author} - {blog.date}
                  </Typography>
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    Views: {blog.views} | Comments: {blog.comments.length}
                  </Typography>
                  <Button
                    aria-label="edit"
                    onClick={() => onEdit(blog)}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      fontSize: "0.8rem",
                    }}
                  >
                    <EditIcon /> Edit
                  </Button>
                </>
              }
            />
          </Box>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default AdminBlogs;