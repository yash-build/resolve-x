import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Please login first</h2>
      </div>
    );
  }

  return children;

}

export default ProtectedRoute;