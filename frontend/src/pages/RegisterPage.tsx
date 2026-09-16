import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { register } from '../services/authService';


 

const RegisterPage: React.FC = () => {

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    setLoading(true);


 

    try {

      await register({ username, email, password });

      alert('Registration successful! Please login.');

      navigate('/login');

    } catch (err: any) {

      setError(err.response?.data?.message || 'Registration failed');

    } finally {

      setLoading(false);

    }

  };


 

  return (

    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>

      <div className="row justify-content-center w-100">

        <div className="col-md-5">

          <div className="card shadow-custom">

            <div className="card-body p-4">

              <div className="text-center mb-4">

                <div className="mb-3">

                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                    <defs>

                      <linearGradient id="gradient2" x1="1" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">

                        <stop stopColor="#4f46e5"/>

                        <stop offset="1" stopColor="#06b6d4"/>

                      </linearGradient>

                    </defs>

                  </svg>

                </div>

                <h3 className="text-gradient mb-2" style={{ fontWeight: 700, fontSize: '1.75rem' }}>Create Account</h3>

                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Join us to book meeting rooms</p>

              </div>

              {error && (

                <div className="alert alert-danger" role="alert">

                  {error}

                </div>

              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label htmlFor="username" className="form-label" style={{ fontSize: '0.9rem' }}>

                    Username

                  </label>

                  <input

                    type="text"

                    className="form-control"

                    id="username"

                    placeholder="Choose a username"

                    value={username}

                    onChange={(e) => setUsername(e.target.value)}

                    required

                  />

                </div>

                <div className="mb-3">

                  <label htmlFor="email" className="form-label" style={{ fontSize: '0.9rem' }}>

                    Email Address

                  </label>

                  <input

                    type="email"

                    className="form-control"

                    id="email"

                    placeholder="your.email@example.com"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    required

                  />

                </div>

                <div className="mb-3">

                  <label htmlFor="password" className="form-label" style={{ fontSize: '0.9rem' }}>

                    Password

                  </label>

                  <input

                    type="password"

                    className="form-control"

                    id="password"

                    placeholder="Create a strong password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    required

                  />

                </div>

                <button

                  type="submit"

                  className="btn btn-primary w-100"

                  disabled={loading}

                  style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: 600 }}

                >

                  {loading ? (

                    <>

                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                      Creating Account...

                    </>

                  ) : (

                    'Create Account'

                  )}

                </button>

              </form>

              <div className="mt-4 text-center">

                <Link to="/login" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 500 }}>Already have an account? <strong>Sign In</strong></Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


 

export default RegisterPage;


 