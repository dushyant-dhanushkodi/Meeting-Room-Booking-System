package com.meetingbooking.service.impl;

import com.meetingbooking.dto.RoomDto;
import com.meetingbooking.entity.Equipment;
import com.meetingbooking.entity.Room;
import com.meetingbooking.exception.NotFoundException;
import com.meetingbooking.repository.EquipmentRepository;
import com.meetingbooking.repository.RoomRepository;
import com.meetingbooking.service.RoomService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

   private final RoomRepository roomRepository;
   private final EquipmentRepository equipmentRepository;
   private final ModelMapper modelMapper;

   public RoomServiceImpl(RoomRepository roomRepository,
                          EquipmentRepository equipmentRepository,
                          ModelMapper modelMapper) {
       this.roomRepository = roomRepository;
       this.equipmentRepository = equipmentRepository;
       this.modelMapper = modelMapper;
   }

   @Override
   public RoomDto createRoom(RoomDto roomDto) {
       Room room = new Room();
       room.setName(roomDto.getName());
       room.setBuilding(roomDto.getBuilding());
       room.setFloor(roomDto.getFloor());
       room.setCapacity(roomDto.getCapacity());
       room.setEquipments(resolveEquipments(roomDto.getEquipments()));
       Room saved = roomRepository.save(room);
       return toDto(saved);
   }

   @Override
   public RoomDto updateRoom(Long id, RoomDto roomDto) {
       Room room = roomRepository.findById(id)
               .orElseThrow(() -> new NotFoundException("Room not found with id " + id));
       room.setName(roomDto.getName());
       room.setBuilding(roomDto.getBuilding());
       room.setFloor(roomDto.getFloor());
       room.setCapacity(roomDto.getCapacity());
       room.setEquipments(resolveEquipments(roomDto.getEquipments()));
       Room saved = roomRepository.save(room);
       return toDto(saved);
   }

   @Override
   public void deleteRoom(Long id) {
       if (!roomRepository.existsById(id)) {
           throw new NotFoundException("Room not found with id " + id);
       }
       roomRepository.deleteById(id);
   }

   @Override
   public List<RoomDto> searchRooms(Integer capacity, String building, String floor, List<String> equipments) {
       List<Room> rooms = roomRepository.searchRooms(capacity, building, floor, equipments);
       return rooms.stream().map(this::toDto).collect(Collectors.toList());
   }

   @Override
   public List<RoomDto> getAllRooms() {
       return roomRepository.findAll().stream()
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   private Set<Equipment> resolveEquipments(Set<String> equipmentNames) {
       if (equipmentNames == null || equipmentNames.isEmpty()) {
           return new HashSet<>();
       }
       Set<Equipment> equipments = new HashSet<>();
       for (String name : equipmentNames) {
           Equipment equipment = equipmentRepository.findByName(name)
                   .orElseGet(() -> equipmentRepository.save(new Equipment(name)));
           equipments.add(equipment);
       }
       return equipments;
   }

   private RoomDto toDto(Room room) {
       RoomDto dto = modelMapper.map(room, RoomDto.class);
       Set<String> equipmentNames = room.getEquipments().stream()
               .map(Equipment::getName)
               .collect(Collectors.toSet());
       dto.setEquipments(equipmentNames);
       return dto;
   }
}

