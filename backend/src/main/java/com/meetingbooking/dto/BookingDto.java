package com.meetingbooking.dto;

import com.meetingbooking.entity.BookingStatus;

import java.time.LocalDateTime;

public class BookingDto {

   private Long id;
   private Long roomId;
   private Long userId;
   private String roomName;
   private String username;
   private String title;
   private LocalDateTime startTime;
   private LocalDateTime endTime;
   private BookingStatus status;

   public BookingDto() {
   }

   public Long getId() {
       return id;
   }

   public void setId(Long id) {
       this.id = id;
   }

   public Long getRoomId() {
       return roomId;
   }

   public void setRoomId(Long roomId) {
       this.roomId = roomId;
   }

   public Long getUserId() {
       return userId;
   }

   public void setUserId(Long userId) {
       this.userId = userId;
   }

   public String getRoomName() {
       return roomName;
   }

   public void setRoomName(String roomName) {
       this.roomName = roomName;
   }

   public String getUsername() {
       return username;
   }

   public void setUsername(String username) {
       this.username = username;
   }

   public String getTitle() {
       return title;
   }

   public void setTitle(String title) {
       this.title = title;
   }

   public LocalDateTime getStartTime() {
       return startTime;
   }

   public void setStartTime(LocalDateTime startTime) {
       this.startTime = startTime;
   }

   public LocalDateTime getEndTime() {
       return endTime;
   }

   public void setEndTime(LocalDateTime endTime) {
       this.endTime = endTime;
   }

   public BookingStatus getStatus() {
       return status;
   }

   public void setStatus(BookingStatus status) {
       this.status = status;
   }
}

