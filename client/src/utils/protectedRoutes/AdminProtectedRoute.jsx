import { Navigate, Outlet } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

const AdminProtectedRoute = () => {
  const user = { role: "admin" }; // useAuthStore();

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoute;
