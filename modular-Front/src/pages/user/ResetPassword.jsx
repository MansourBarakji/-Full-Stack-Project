import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import "../../public/ForgetPass.css";

const ResetPasswordPage = () => {
  const { resetToken } = useParams();
  const { resetPassword, loading, error } = useApi();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await resetPassword(resetToken, newPassword);
    if (response && response.message) {
      setMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="content">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="button">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="error-message"> {error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
