import { useState } from "react";
import useApi from "../../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import "../../public/LoginRegister.css";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register({ fullName, email, password });
    if (response && response.token) {
      navigate("/");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="FullName"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="button">
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="error-message"> {error}</p>}
      </form>
      <div className="links">
        <p>
          Already have account?{" "}
          <Link className="link" to="/login">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
