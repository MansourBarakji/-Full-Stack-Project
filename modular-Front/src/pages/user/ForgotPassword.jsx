import { useState } from "react";
import useApi from "../../hooks/useApi";
import "../../public/ForgetPass.css";

const ForgotPasswordPage = () => {
  const { sendResetPasswordEmail, loading, error } = useApi();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await sendResetPasswordEmail(email);
    if (response && response.message) {
      setMessage(response.message);
    }
  };

  return (
    <div className="content">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit} className="form">
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
        <button type="submit" disabled={loading} className="button">
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      {error && <p className="error-message"> {error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
