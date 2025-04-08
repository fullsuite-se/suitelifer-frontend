//TODO: MADE A SPECIFIC TEMPORARY PAGE FOR 404 PAGES

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Guest Pages
import Home from "./pages/guest/Home";
import AboutUs from "./pages/guest/AboutUs";
import Careers from "./pages/guest/Careers";
import CareersAll from "./pages/guest/CareersAll";
import News from "./pages/guest/News";
import Contact from "./pages/guest/Contact";
import Blog from "./pages/guest/Blog";
import TermsOfUse from "./pages/guest/TermsOfUse";
import PrivacyPolicy from "./pages/guest/PrivacyPolicy";
import BlogDetails from "./pages/guest/BlogDetails";
import NewsDetails from "./pages/guest/NewsDetails";
import ApplicationForm from "./pages/guest/ApplicationForm";
import CongratsApplicationForm from "./pages/guest/CongratsApplicationForm";

// Regular Pages
import EmployeeBlogsFeed from "./pages/employee/EmployeeBlogsFeed";
import EmployeeMyBlogs from "./pages/employee/EmployeeMyBlogs";
import BlogView from "./components/blog/BlogView";
import EmployeeThreads from "./pages/employee/EmployeeThreads";
import EmployeeEvents from "./pages/employee/EmployeeEvents";
import EmployeeWorkshops from "./pages/employee/EmployeeWorkshops";
import EmployeePersonalityTest from "./pages/employee/EmployeePersonalityTest";
import BlogCreate from "./components/blog/BlogCreate";
import CareersJobDetails from "./pages/guest/CareersJobDetails";

// Route Management
import DynamicRoutes from "./utils/protectedRoutes/DynamicRoutes";
import ProtectedRoutes from "./utils/protectedRoutes/ProtectedRoutes";

// Layout
import RootLayout from "./components/layout/RootLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import PasswordReset from "./pages/auth/PasswordReset";
import Register from "./pages/auth/Register";

// Others
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import VerifyAccount from "./pages/auth/VerifyAccount";
import JobCourse from "./components/admin/JobCourse";
import PersonalityTest from "./components/admin/PersonalityTest";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Routes that are publicly available (guest) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers-all" element={<CareersAll />} />
          <Route
            path="careers/application-form/:id/:jobPosition"
            element={<ApplicationForm />}
          />
          <Route
            path="/congrats-application-form"
            element={<CongratsApplicationForm />}
          />
          <Route path="/careers/:slug" element={<CareersJobDetails />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/reset-password" element={<PasswordReset />} />

          {/* Routes that are avaialable to admins and employees (guest) */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/app" element={<RootLayout />}>
            
              <Route path="*" element={<DynamicRoutes />} />
              <Route index element={<Navigate to="blogs-feed" replace />} />
              <Route path="blogs-feed" element={<EmployeeBlogsFeed />} />
              <Route path="blogs-feed/blog/:id/:slug" element={<BlogView />} />

              {/* Paki lagay sa tamang lagayan kasi di mahanap kung san belong tong mga routes na to nani desu ka */}
              <Route path="courses" element={<JobCourse />} />
              <Route path="personalitytest" element={<PersonalityTest/>}/>

              <Route path="my-blogs" element={<EmployeeMyBlogs />} />
              <Route path="my-blogs/blog/:id/:slug" element={<BlogView />} />
              <Route path="my-blogs/new-blog" element={<BlogCreate />} />

              <Route path="threads" element={<EmployeeThreads />} />
              <Route path="company-events" element={<EmployeeEvents />} />
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