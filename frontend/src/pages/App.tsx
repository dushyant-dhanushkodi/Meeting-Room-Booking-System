import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';

import RegisterPage from './RegisterPage';

import DashboardPage from './DashboardPage';

import { AuthProvider } from '../services/AuthContext';

import ProtectedRoute from '../components/ProtectedRoute';


 

const App: React.FC = () => {

  return (

    <AuthProvider>

      <div className="app-container">

        <div className="app-content">

          <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route

              path="/"

              element={

                <ProtectedRoute>

                  <DashboardPage />

                </ProtectedRoute>

              }

            />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

        </div>

      </div>

    </AuthProvider>

  );

};


 

export default App;



 