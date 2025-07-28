import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permission";

const ProtectedRoute = ({ children, resource, action, scope }) => {
  const { isLoggedIn, loading, permissions } = useSelector((state) => state.auth);
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (resource && action && !hasPermission(permissions, resource, action, scope)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
