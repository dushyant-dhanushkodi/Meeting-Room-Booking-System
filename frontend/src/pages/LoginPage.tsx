import React, { useState } from 'react';

import { useLocation, useNavigate, Link } from 'react-router-dom';

import { login as loginApi } from '../services/authService';

import { useAuth } from '../services/AuthContext';


 

const LoginPage: React.FC = () => {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation() as any;

  const { login } = useAuth();


 

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);

    setLoading(true);

    try {

      const data = await loginApi({ username, password });

      login(data);

      const from = location.state?.from?.pathname || '/';

      navigate(from, { replace: true });

    } catch (err) {

      setError('Invalid credentials');

    } finally {

      setLoading(false);

    }

  };


 

  return (

    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '20px' }}>

      <div className="card shadow-custom" style={{ minWidth: 360, maxWidth: 420 }}>

        <div className="card-body p-4">

          <div className="text-center mb-4">

            <div className="mb-3">

              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                <defs>

                  <linearGradient id="gradient1" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">

                    <stop stopColor="#4f46e5"/>

                    <stop offset="1" stopColor="#06b6d4"/>

                  </linearGradient>

                </defs>

              </svg>

            </div>

            <h3 className="card-title mb-2 text-gradient" style={{ fontWeight: 700, fontSize: '1.75rem' }}>Meeting Room Booking</h3>

            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Sign in to manage your bookings</p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label" style={{ fontSize: '0.9rem' }}>Username</label>

              <input

                type="text"

                className="form-control"

                placeholder="Enter your username"

                value={username}

                onChange={(e) => setUsername(e.target.value)}

                required

                style={{ fontSize: '0.95rem' }}

              />

            </div>

            <div className="mb-3">

              <label className="form-label" style={{ fontSize: '0.9rem' }}>Password</label>

              <input

                type="password"

                className="form-control"

                placeholder="Enter your password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                required

                style={{ fontSize: '0.95rem' }}

              />

            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>

              {loading ? (

                <>

                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>

                  Signing in...

                </>

              ) : (

                'Sign In'

              )}

            </button>

          </form>

          <div className="mt-4 text-center">

            <Link to="/register" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 500 }}>Don't have an account? <strong>Register</strong></Link>

          </div>

          <div className="mt-3 text-center">

            <div className="alert alert-info py-2 mb-0" style={{ fontSize: '0.85rem' }}>

              <strong>Demo:</strong> admin / admin123

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


 

export default LoginPage;



 