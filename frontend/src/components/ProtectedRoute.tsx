import React from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../services/AuthContext';


 

type Props = {

  children: React.ReactNode;

  requiredRole?: 'EMPLOYEE' | 'ADMIN';

};


 

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {

  const { user, loading } = useAuth();

  const location = useLocation();


 

  if(loading){

    return null; // or a loading spinner

  }

  if (!user) {

    return <Navigate to="/login" state={{ from: location }} replace />;

  }


 

  if (requiredRole && !user.roles.includes(requiredRole)) {

    return <Navigate to="/" replace />;

  }


 

  return <>{children}</>;

};


 

export default ProtectedRoute;



 