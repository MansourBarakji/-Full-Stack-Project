import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import "../../public/Verify.css";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyUser, loading, error } = useApi();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const response = await verifyUser(token);
      if (response && response.message) {
        setMessage(response.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    verify();
  }, [token, verifyUser, navigate]);

  return (
    <div className="verify-container">
      <h1>Verifying User...</h1>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default VerifyPage;
