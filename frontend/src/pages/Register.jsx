import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/register", form);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Create your account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
