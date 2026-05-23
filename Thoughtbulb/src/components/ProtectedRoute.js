const { Outlet, Navigate, useLocation } = require("react-router");

const useAuth = () => {
  return localStorage.getItem("authenticated");
};

const ProtectedRoute = () => {
  // const location = useLocation()
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
