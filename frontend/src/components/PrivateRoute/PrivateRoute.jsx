import { useCall } from "../../Provider/Provider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useCall();

  // Show loader
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirect
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "distributor":
      return <Navigate to="/distributor" replace />;

    case "user":
      return children;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
