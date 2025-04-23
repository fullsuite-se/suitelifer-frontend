import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromCookie, refreshToken } from "../utils/cookie";
import { useStore } from "../store/authStore";
import OnLoadLayoutAnimation from "../components/layout/OnLoadLayoutAnimation";

const ProtectedRoutes = () => {
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
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="w-dvw h-dvh">
        <OnLoadLayoutAnimation />
      </section>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
