import api from './api';

import { AuthRequest, AuthResponse } from '../models/auth';


 

export const login = async (payload: AuthRequest): Promise<AuthResponse> => {

  const response = await api.post<AuthResponse>('/auth/login', payload);

  return response.data;

};


 

export const register = async (payload: {

  username: string;

  email: string;

  password: string;

}): Promise<any> => {

  const response = await api.post('/auth/register', payload);

  return response.data;

};



 