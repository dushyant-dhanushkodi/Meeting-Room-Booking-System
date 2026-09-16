import api from './api';


 

export const getRoomUsageReport = async (

  from: string,

  to: string

): Promise<Record<string, number>> => {

  const response = await api.get<Record<string, number>>('/reports/room-usage', {

    params: { from, to },

  });

  return response.data;

};


 

export const getPeakHoursReport = async (

  from: string,

  to: string

): Promise<Record<number, number>> => {

  const response = await api.get<Record<number, number>>('/reports/peak-hours', {

    params: { from, to },

  });

  return response.data;

};


 