import React, { useState } from 'react';

import { useAuth } from '../services/AuthContext';

import RoomSearch from '../components/RoomSearch';

import MyBookings from '../components/MyBookings';

import RoomManagement from '../components/RoomManagement';

import Reports from '../components/Reports';

import OverrideBookings from '../components/OverrideBookings';


 

const DashboardPage: React.FC = () => {

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'rooms' | 'reports' | 'override'>('search');

  const isAdmin = user?.roles?.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');


 

  return (

    <>

      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>

        <div className="container-fluid px-4">

          <span className="navbar-brand" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}>

              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

            </svg>

            Meeting Room Booking

          </span>

          <div className="d-flex align-items-center gap-3 text-white">

            <div className="d-flex align-items-center" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.5rem 1rem', borderRadius: '20px' }}>

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>

                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              </svg>

              <span style={{ fontWeight: 500 }}>{user?.username}</span>

            </div>

            <button className="btn btn-outline-light btn-sm" onClick={logout} style={{ borderRadius: '20px', fontWeight: 500, padding: '0.4rem 1.2rem' }}>

              Logout

            </button>

          </div>

        </div>

      </nav>

      <main className="container mt-4" style={{ maxWidth: '1400px' }}>

        <div className="row mb-4">

          <div className="col-12">

            <ul className="nav nav-tabs" style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '12px 12px 0 0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>

              <li className="nav-item">

                <button

                  className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}

                  onClick={() => setActiveTab('search')}

                >

                  Search Rooms

                </button>

              </li>

              <li className="nav-item">

                <button

                  className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}

                  onClick={() => setActiveTab('bookings')}

                >

                  My Bookings

                </button>

              </li>

              {isAdmin && (

                <li className="nav-item">

                  <button

                    className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}

                    onClick={() => setActiveTab('rooms')}

                  >

                    Manage Rooms

                  </button>

                </li>

              )}

              {isAdmin && (

                <li className="nav-item">

                  <button

                    className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}

                    onClick={() => setActiveTab('reports')}

                  >

                    Reports

                  </button>

                </li>

              )}

              {isAdmin && (

                <li className="nav-item">

                  <button

                    className={`nav-link ${activeTab === 'override' ? 'active' : ''}`}

                    onClick={() => setActiveTab('override')}

                  >

                    Override Bookings

                  </button>

                </li>

              )}

            </ul>

          </div>

        </div>

        <div className="row">

          <div className="col-12">

            {activeTab === 'search' && <RoomSearch />}

            {activeTab === 'bookings' && <MyBookings />}

            {activeTab === 'rooms' && isAdmin && <RoomManagement />}

            {activeTab === 'reports' && isAdmin && <Reports />}

            {activeTab === 'override' && isAdmin && <OverrideBookings />}

          </div>

        </div>

      </main>

    </>

  );

};


 

export default DashboardPage;



 