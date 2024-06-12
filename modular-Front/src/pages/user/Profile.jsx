import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../public/Profile.css";

const ProfilePage = () => {
  const { getUserProfile, loading, error } = useApi();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getUserProfile();
      if (response) {
        setProfile(response);
      }
    };
    fetchProfile();
  }, [getUserProfile]);

  const handleEditClick = () => {
    navigate("/editProfile", { state: { profile } });
  };
  return (
    <div>
      <NavBar cart={cart} />
      <div className="profile-content">
        <h1> Profile</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {profile && (
          <div className="profile-details">
            <p>
              <span>FullName:</span> {profile.fullName}
            </p>
            <p>
              <span>Email:</span> {profile.email}
            </p>
            <button onClick={handleEditClick}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
