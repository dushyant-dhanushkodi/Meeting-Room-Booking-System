package com.meetingbooking.controller;

import com.meetingbooking.dto.RoomDto;
import com.meetingbooking.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

   private final RoomService roomService;

   public RoomController(RoomService roomService) {
       this.roomService = roomService;
   }

   @GetMapping
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<List<RoomDto>> getAllRooms() {
       return ResponseEntity.ok(roomService.getAllRooms());
   }

   @GetMapping("/search")
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<List<RoomDto>> searchRooms(
           @RequestParam(required = false) Integer capacity,
           @RequestParam(required = false) String building,
           @RequestParam(required = false) String floor,
           @RequestParam(required = false) String equipments) {

       List<String> equipmentList = null;
       if (equipments != null && !equipments.isEmpty()) {
           equipmentList = Arrays.asList(equipments.split(","));
       }
       return ResponseEntity.ok(roomService.searchRooms(capacity, building, floor, equipmentList));
   }

   @PostMapping
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<RoomDto> createRoom(@RequestBody RoomDto roomDto) {
       return ResponseEntity.ok(roomService.createRoom(roomDto));
   }

   @PutMapping("/{id}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @RequestBody RoomDto roomDto) {
       return ResponseEntity.ok(roomService.updateRoom(id, roomDto));
   }

   @DeleteMapping("/{id}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
       roomService.deleteRoom(id);
       return ResponseEntity.noContent().build();
   }
}

