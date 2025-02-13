import { Navigate, Outlet } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

const EmployeeProtectedRoute = () => {
  const user = { role: "employee" }; // useAuthStore();

  return user?.role === "employee" ? <Outlet /> : <Navigate to="/" />;
};

export default EmployeeProtectedRoute;
