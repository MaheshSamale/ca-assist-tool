import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        CA Assist
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        {isLoggedIn ? (
          <>
            <Link to="/">Client List</Link>
            <Link to="/add">Add Client</Link>
            <Link to="/deadlines">Deadlines</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
