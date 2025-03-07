import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Guest Pages
import Home from "./pages/guest/Home";
import AboutUs from "./pages/guest/AboutUs";
import Careers from "./pages/guest/Careers";
import News from "./pages/guest/News";
import Contact from "./pages/guest/Contact";
import Blog from "./pages/guest/Blog";
import TermsOfUse from "./pages/guest/TermsOfUse";
import PrivacyPolicy from "./pages/guest/PrivacyPolicy";
import BlogDetails from "./pages/guest/BlogDetails";
import NewsDetails from "./pages/guest/NewsDetails";


// Admin Pages
import AdminProtectedRoute from "./utils/protectedRoutes/AdminProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import JobListing from "./pages/admin/JobListing";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminNews from "./pages/admin/AdminNews";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminContents from "./pages/admin/AdminContents";

// Employee Pages
import EmployeeProtectedRoute from "./utils/protectedRoutes/EmployeeProtectedRoute";
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeBlogsFeed from "./pages/employee/EmployeeBlogsFeed";
import EmployeeMyBlogs from "./pages/employee/EmployeeMyBlogs";
import BlogView from "./components/blog/BlogView";
import EmployeeThreads from "./pages/employee/EmployeeThreads";
import EmployeeEvents from "./pages/employee/EmployeeEvents";
import EmployeeWorkshops from "./pages/employee/EmployeeWorkshops";
import EmployeePersonalityTest from "./pages/employee/EmployeePersonalityTest";
import BlogCreate from "./components/blog/BlogCreate";
import BlogDetails from "./components/guest-blogs/GuestBlogDetails";
import CareersJobDetails from "./pages/guest/CareersJobDetails";
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
          <Route path="/careers/:id" element={<CareersJobDetails />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id/:slug" element={<NewsDetails/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id/:slug" element={<BlogDetails/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />

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
              <Route index element={<Navigate to="blogs-feed" replace />} />
              <Route path="blogs-feed" element={<EmployeeBlogsFeed />} />
              <Route path="blogs-feed/blog/:id/:slug" element={<BlogView />} />

              <Route path="my-blogs" element={<EmployeeMyBlogs />} />
              <Route path="my-blogs/blog/:id/:slug" element={<BlogView />} />
              <Route path="my-blogs/new-blog" element={<BlogCreate />} />

              <Route path="threads" element={<EmployeeThreads />} />
              <Route path="events" element={<EmployeeEvents />} />
              <Route path="workshops" element={<EmployeeWorkshops />} />
              <Route
                path="personality-test"
                element={<EmployeePersonalityTest />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
