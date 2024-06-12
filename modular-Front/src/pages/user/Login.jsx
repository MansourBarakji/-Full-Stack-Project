/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom'; 
import useAuth from '../../hooks/useAsync';
import '../../public/LoginRegister.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
   const response = await login({ email, password });
   if(response && response.token){
    navigate('/');
  }

   
  };

  return (
    <div className="container">
      <h1>Login</h1>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="links">
        <p>
          Don't have an account? <Link className="link" to="/register">Register</Link>
        </p>
        <p>
        Forgot Password? <Link className="link" to="/forgotPassword">Reset</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
