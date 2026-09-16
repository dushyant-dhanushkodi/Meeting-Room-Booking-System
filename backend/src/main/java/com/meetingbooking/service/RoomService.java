package com.meetingbooking.service;

import com.meetingbooking.dto.RoomDto;

import java.util.List;

public interface RoomService {

   RoomDto createRoom(RoomDto roomDto);

   RoomDto updateRoom(Long id, RoomDto roomDto);

   void deleteRoom(Long id);

   List<RoomDto> searchRooms(Integer capacity, String building, String floor, List<String> equipments);

   List<RoomDto> getAllRooms();
}

