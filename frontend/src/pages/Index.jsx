import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Index = () => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to dashboard if logged in, otherwise to login
  return <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />;
};

export default Index;
