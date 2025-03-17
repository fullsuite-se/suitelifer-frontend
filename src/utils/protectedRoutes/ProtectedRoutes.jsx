import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../../store/authStore";
import {
  getServicesFromCookie,
  refreshToken,
  getUserFromCookie,
} from "../cookie";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";

const ProtectedRoutes = () => {
  const setServices = useStore((state) => state.setServices);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      let user = await getUserFromCookie();

      if (!user) {
        const newToken = await refreshToken();
        if (newToken) {
          user = await getUserFromCookie();
        }
      }

      if (user) {
        setUser(user);
        const services = await getServicesFromCookie(user.id);
        setServices(services);
      } else {
        setUser(null);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <OnLoadLayoutAnimation />;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
