import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
