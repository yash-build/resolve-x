import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/report">Report Issue</Link> |{" "}
      <Link to="/issues">Issue Feed</Link> |{" "}
      <Link to="/admin">Admin Panel</Link>
    </nav>
  );
}

export default Navbar;