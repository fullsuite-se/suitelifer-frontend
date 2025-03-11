import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useStore } from "../../store/authStore";

const AdminDynamicRoutes = () => {
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
        {services.map(({ feature_name }) => {
          if (!feature_name) return null;

          const path = feature_name.toLowerCase().replace(" ", "");
          const componentName =
            "Admin" +
            feature_name
              .replace(/\s+/g, "")
              .replace(/^\w/, (c) => c.toUpperCase());

          const Component = lazy(() =>
            import(`../../pages/admin/${componentName}.jsx`)
          );

          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </Suspense>
  );
};

export default AdminDynamicRoutes;
