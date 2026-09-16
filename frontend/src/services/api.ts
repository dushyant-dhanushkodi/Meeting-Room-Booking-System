import axios from 'axios';

import { AuthResponse } from '../models/auth';


 

const api = axios.create({

  baseURL: 'http://localhost:8080/api'

});


 

api.interceptors.request.use((config) => {

  const stored = localStorage.getItem('auth');

  if (stored) {

    const auth: AuthResponse = JSON.parse(stored);

    if (auth.token && config.headers) {

      config.headers.Authorization = `Bearer ${auth.token}`;

    }

  }

  return config;

});


 

export default api;



 