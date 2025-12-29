import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌿 Phyto Drug Finder
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/case-studies">Case Studies</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/feedback">Feedback</Link>

          {user ? (
            <>
              {isAdmin() && <Link to="/admin" className="admin-link">Admin</Link>}
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}