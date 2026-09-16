import api from './api';

import { BookingDto } from '../models/booking';


 

export const createBooking = async (payload: BookingDto): Promise<BookingDto> => {

  const response = await api.post<BookingDto>('/bookings', payload);

  return response.data;

};


 

export const getBookingsForUser = async (userId: number): Promise<BookingDto[]> => {

  const response = await api.get<BookingDto[]>(`/bookings/user/${userId}`);

  return response.data;

};


 

export const cancelBooking = async (id: number): Promise<void> => {

  await api.post(`/bookings/${id}/cancel`);

};


 

export const getBookingsForRoom = async (roomId: number): Promise<BookingDto[]> => {

  const response = await api.get<BookingDto[]>(`/bookings/room/${roomId}`);

  return response.data;

};


 

export const getAvailableSlots = async (

  roomId: number,

  start: string,

  end: string

): Promise<BookingDto[]> => {

  const response = await api.get<BookingDto[]>(`/bookings/room/${roomId}/slots`, {

    params: { start, end },

  });

  return response.data;

};


 

export const overrideBooking = async (bookingId: number, payload: BookingDto): Promise<BookingDto> => {

  const response = await api.post<BookingDto>(`/bookings/${bookingId}/override`, payload);

  return response.data;

};



 