import api from './api';

import { RoomDto } from '../models/room';


 

export const getAllRooms = async (): Promise<RoomDto[]> => {

  const response = await api.get<RoomDto[]>('/rooms');

  return response.data;

};


 

export const searchRooms = async (params: {

  capacity?: number;

  building?: string;

  floor?: string;

  equipments?: string;

}): Promise<RoomDto[]> => {

  const response = await api.get<RoomDto[]>('/rooms/search', { params });

  return response.data;

};


 

export const createRoom = async (room: RoomDto): Promise<RoomDto> => {

  const response = await api.post<RoomDto>('/rooms', room);

  return response.data;

};


 

export const updateRoom = async (id: number, room: RoomDto): Promise<RoomDto> => {

  const response = await api.put<RoomDto>(`/rooms/${id}`, room);

  return response.data;

};


 

export const deleteRoom = async (id: number): Promise<void> => {

  await api.delete(`/rooms/${id}`);

};



 