import { useLocation } from "react-router-dom";

import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <UserNotRegisteredError redirectTo={`/login?next=${encodeURIComponent(location.pathname)}`} />;
  }

  return children;
}
