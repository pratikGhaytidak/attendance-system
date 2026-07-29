import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;