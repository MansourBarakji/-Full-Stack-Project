import { useState } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate, useLocation } from "react-router-dom";
import "../../public/EditProfile.css";
import NavBar from "../../components/NavBar";


const EditProfilePage = () => {
  const { editUserProfile, loading, error } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state;
  const [email, setEmail] = useState(profile.email);
  const [fullName, setFullName] = useState(profile.fullName);
  const [message, setMessage] = useState("");
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await editUserProfile({ email, fullName });
    if (response && response.message) {
      setMessage(response.message);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  };

  return (
    <div>
      <NavBar cart={cart} />
      <div className="edit-profile-content">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
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
          <button type="submit" disabled={loading} className="button">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        {error && <p className="error-message"> {error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default EditProfilePage;
