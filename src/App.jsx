import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Guest Pages
import Home from "./pages/guest/Home";
import AboutUs from "./pages/guest/AboutUs";
import Careers from "./pages/guest/Careers";
import CareersAll from "./pages/guest/CareersAll";
import Newsletter from "./pages/guest/Newsletter";
import NewsletterDetails from "./components/newsletter/NewsLetterDetails";
import Contact from "./pages/guest/Contact";
import Podcast from "./pages/guest/Podcast";
import TermsOfUse from "./pages/guest/TermsOfUse";
import PrivacyPolicy from "./pages/guest/PrivacyPolicy";
import ApplicationForm from "./pages/guest/ApplicationForm";
import CongratsApplicationForm from "./pages/guest/CongratsApplicationForm";
import PageNotFound from "./pages/guest/PageNotFound";
import CareersJobDetails from "./pages/guest/CareersJobDetails";

// Regular Pages
import EmployeeBlogsFeed from "./pages/employee/EmployeeBlogsFeed";
import EmployeeMyBlogs from "./pages/employee/EmployeeMyBlogs";
import BlogView from "./components/blog/BlogView";
import EmployeeThreads from "./pages/employee/EmployeeThreads";
import EmployeeEvents from "./pages/employee/EmployeeEvents";
// import EmployeeWorkshops from "./pages/employee/EmployeeWorkshops";
import EmployeePersonalityTest from "./pages/employee/EmployeePersonalityTest";
import BlogCreate from "./components/blog/BlogCreate";
import EmployeeCheerPage from "./pages/employee/EmployeeCheerPage";
import EmployeePointsDashboard from "./pages/employee/EmployeePointsDashboard";

// Points Shop Pages
// import PointsShopDashboard from "./pages/employee/PointsShopDashboard";
// import CheerAPeerPage from "./pages/employee/CheerAPeerPage";
// import PointsPage from "./pages/employee/PointsPage";
// import ShopPage from "./pages/employee/ShopPage";
import MoodPage from "./pages/employee/MoodPage";
import SuitebiteHome from "./pages/employee/SuitebiteHome";
import SuitebiteShop from "./pages/employee/SuitebiteShop";
import SuitebiteLeaderboard from "./pages/employee/SuitebiteLeaderboard";

// Points Shop Admin Pages
// import AdminPointsDashboard from "./pages/admin/AdminPointsDashboard";
// import AdminPointsUsers from "./pages/admin/AdminPointsUsers";
// import AdminPointsProducts from "./pages/admin/AdminPointsProducts";
// import AdminPointsOrders from "./pages/admin/AdminPointsOrders";

// Super/Admin Pages
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminNews from "./pages/admin/AdminNews";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminContents from "./pages/admin/AdminContents";
import AdminNewsCreate from "./pages/admin/AdminNewsCreate";
import SuperAdminAccountManagement from "./pages/superadmin/SuperAdminAccountManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import AdmimJobCourse from "./components/admin/AdmimJobCourse";
import AdminPersonalityTest from "./components/admin/AdminPersonalityTest";
import AdminSuitebite from "./pages/admin/AdminSuitebite";
import SuperAdminSuitebite from "./pages/admin/SuperAdminSuitebite";

// Route Management
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminProtectedRoutes from "./routes/AdminProtectedRoutes";
import SuperAdminProtectedRoutes from "./routes/SuperAdminProtectedRoutes";
import DeactivatedPage from "./pages/auth/Deactivated";

// Layout
import RootLayout from "./components/layout/RootLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import PasswordReset from "./pages/auth/PasswordReset";
import Register from "./pages/auth/Register";

// Others
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/buttons/ScrollToTop";
import VerifyAccount from "./pages/auth/VerifyAccount";
import DevelopersPage from "./pages/guest/Developers";

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
          <Route path="/careers/:slug" element={<CareersJobDetails />} />
          <Route path="/careers-all" element={<CareersAll />} />
          <Route
            path="careers/application-form/:id/:jobPosition"
            element={<ApplicationForm />}
          />
          <Route
            path="/congrats-application-form"
            element={<CongratsApplicationForm />}
          />

          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/developer" element={<Navigate to="/developers"/>} />
          <Route path="/dev" element={<Navigate to="/developers"/>} />
          <Route path="/d" element={<Navigate to="/developers"/>} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/newsletter/:slug" element={<NewsletterDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/account-deactivated" element={<DeactivatedPage />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />

          {/* Routes that are avaialable to admins and employees (guest) */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/app" element={<RootLayout />}>
              <Route index element={<Navigate to="blogs-feed" replace />} />
              <Route path="blogs-feed" element={<EmployeeBlogsFeed />} />
              <Route path="blogs-feed/blog/:id/:slug" element={<BlogView />} />
              <Route path="my-blogs" element={<EmployeeMyBlogs />} />
              <Route path="my-blogs/blog/:id/:slug" element={<BlogView />} />
              <Route path="my-blogs/new-blog" element={<BlogCreate />} />

              <Route path="threads" element={<EmployeeThreads />} />
              <Route path="company-events" element={<EmployeeEvents />} />
              {/* <Route path="courses" element={<EmployeeWorkshops />} /> */}
              <Route
                path="personality-test"
                element={<EmployeePersonalityTest />}
              />
              
              {/* Suitebite Employee Routes */}
              <Route path="suitebite" element={<SuitebiteHome />} />
              <Route path="suitebite/cheer" element={<SuitebiteHome />} />
              <Route path="suitebite/shop" element={<SuitebiteShop />} />
              <Route path="suitebite/leaderboard" element={<SuitebiteLeaderboard />} />

              {/* Points Shop/Mood/Cheer/PointsDashboard Routes */}
              <Route path="mood" element={<MoodPage />} />
              <Route path="cheer" element={<EmployeeCheerPage />} />
              <Route path="points-dashboard" element={<EmployeePointsDashboard />} />

              {/* Admin Protected Routes */}
              <Route path="admin-tools" element={<AdminProtectedRoutes />}>
                <Route index element={<Navigate to="suitebite" replace />} />
                <Route path="suitebite" element={<AdminSuitebite />} />
                <Route
                  path="suitebite/new-suitebite"
                  element={<AdminNewsCreate />}
                />
                
                <Route path="events" element={<AdminEvents />} />
                <Route path="contents" element={<AdminContents />} />
                <Route path="courses" element={<AdmimJobCourse />} />
                <Route
                  path="personality-test"
                  element={<AdminPersonalityTest />}
                />
                <Route path="audit-logs" element={<AuditLogs />} />

                {/* Super Admin Protected Routes */}
                <Route path="super" element={<SuperAdminProtectedRoutes />}>
                  <Route
                    path="accounts-management"
                    element={<SuperAdminAccountManagement />}
                  />
                  <Route
                    path="suitebite"
                    element={<SuperAdminSuitebite />}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
