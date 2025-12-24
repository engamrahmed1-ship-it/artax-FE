import './css/Login.css';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import loginBg from '../../assets/images/loginP1.png';
import fullLogo from '../../assets/images/Full-Logo.png';

const LoginPage = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await auth.login(user, password, rememberMe);
      console.log("Logged")
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid username or password.');
      console.error('this is the error ', err.message);
    }
  };

  return (
    <div className="login-div">
      {/* <div className="card mb-3 login-card"> */}


        {/* Form Section */}
        <div className="login-form-section">
          {/* <div className="card-body py-5 px-md-5 d-flex flex-column justify-content-center align-items-center"> */}
          <div className="login-card">
            <div className="text-center mb-4">
              <img
                src={fullLogo}
                alt="Artax Logo"
                className="login-logo"
              />
            </div>

            <div className="form mt-4">
              <h2 className="login-title">Sign In</h2>
              {error && <p className="error">{error}</p>}

              <form onSubmit={handleSubmit}>
                {/* Email input */}
                <div className="input-group-container">
                  <input
                    type="text"
                    className="custom-input"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    placeholder="" // Leave empty for a cleaner look
                  />
                  <label className="input-sub-label">Username</label>
                </div>

                {/* Password input */}
                <div className="input-group-container">
                  <input
                    type="password"
                    className="custom-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=""
                  />
                  <label className="input-sub-label">Password</label>
                </div>
                {/* Remember me & Forgot password */}
                {/* <div className="row mb-4 align-items-center">
                  <div className="col d-flex justify-content-start">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <div className="col text-end">
                    <a href="#!" className="forgot-password-link">
                      Forgot password?
                    </a>
                  </div>
                </div> */}

                {/* Submit button */}
                <button type="submit" className="btn-gradient">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default LoginPage;
