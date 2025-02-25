import { BrowserRouter, Routes, Route } from "react-router-dom";

// Guest Pages
import Home from "./pages/guest/Home";
import AboutUs from "./pages/guest/AboutUs";
import Careers from "./pages/guest/Careers";
import News from "./pages/guest/News";
import Contact from "./pages/guest/Contact";
import Blog from "./pages/guest/Blog";
import Legal from "./pages/guest/Legal";

// Admin Pages
import AdminProtectedRoute from "./utils/protectedRoutes/AdminProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import JobListing from "./pages/admin/JobListing";

// Employee Pages
import EmployeeProtectedRoute from "./utils/protectedRoutes/EmployeeProtectedRoute";
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminNews from "./pages/admin/AdminNews";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminContents from "./pages/admin/AdminContents";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Routes that are publicly avaialable (guest) */}
          <Route path="/" element={<Home />} />
          <Route path="/login-employee" element={<EmployeeLogin />} />
          <Route path="/login-admin" element={<AdminLogin />} />

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/legal" element={<Legal />} />

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="joblisting" element={<JobListing />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="contents" element={<AdminContents />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route element={<EmployeeProtectedRoute />}>
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
