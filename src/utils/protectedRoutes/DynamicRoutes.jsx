import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useStore } from "../../store/authStore";
import AdminNewsCreate from "../../pages/admin/AdminNewsCreate.jsx";
import AdminBlog from "../../pages/admin/AdminBlogs.jsx";
import AdminNews from "../../pages/admin/AdminNews.jsx";
import AdminBlogCreate from "../../pages/admin/AdminBlogCreate";

const DynamicRoutes = () => {
  const services = useStore((state) => state.services) || [];

  return (
    <Suspense
      fallback={
        <div className="h-dvh w-dvw grid place-content-center">
          <p>Loading...</p>
        </div>
      }
    >
      <Routes>
        {services.map(({ feature_name }, index) => {
          if (!feature_name) return null;

          const path = feature_name.toLowerCase().replace(/\s+/g, "");
          const componentName =
            "Admin" +
            feature_name
              .replace(/\s+/g, "")
              .replace(/^\w/, (c) => c.toUpperCase());

          if (feature_name === "Blogs") {
            return (
              <React.Fragment key={path}>
                <Route path={path} element={<AdminBlog />} />
                <Route
                  path={`${path}/new-company-blog`}
                  element={<AdminBlogCreate />}
                />
              </React.Fragment>
            );
          }

          if (feature_name === "News") {
            return (
              <React.Fragment key={path}>
                <Route path={path} element={<AdminNews />} />
                <Route
                  path={`${path}/new-news`}
                  element={<AdminNewsCreate />}
                />
              </React.Fragment>
            );
          }

          const Component = lazy(() =>
            import(`../../pages/admin/${componentName}.jsx`)
          );

          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </Suspense>
  );
};

export default DynamicRoutes;
