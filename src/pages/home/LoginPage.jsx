import './css/Login.css';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';


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
      navigate(from, { replace: true });
      console.log('Redirect after login to:', from);
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error('this is the error ', err.message);
    }
  };

  return (
    <div className="login-div">
      {/* <div className="card mb-3 login-card"> */}


      <div className="d-flex flex-row bd-highlight mb-3  ">
        {/* Left Image */}
        <div className="login-brand">
          <img
            src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
            alt="Trendy Pants and Shoes"
          // className="rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5"
          />
        </div>

        {/* Form Section */}
        <div className="login-form">
          <div className="card-body py-5 px-md-5 d-flex flex-column justify-content-center align-items-center">
            <div className="container">
              <div className="p-5 bg-light text-black text-center rounded shadow-lg">
                <h1 className="display-4 fw-bold" style={{ letterSpacing: '2px' }}>
                  ARTAX <span className="text-info">is the Future</span>
                </h1>
              </div>
            </div>
            <div className="form mt-4">
              <h2 className="fw-bold mb-4">Sign In</h2>
              {error && <p className="error">{error}</p>}

              <form onSubmit={handleSubmit}>
                {/* Email input */}
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="user"
                    className="form-control"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Username"
                    required
                  />
                  <label className="form-label" htmlFor="username">
                    username
                  </label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
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
                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default LoginPage;
