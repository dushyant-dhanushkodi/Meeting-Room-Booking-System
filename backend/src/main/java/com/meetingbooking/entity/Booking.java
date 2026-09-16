package com.meetingbooking.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne(optional = false)
   @JoinColumn(name = "room_id")
   private Room room;

   @ManyToOne(optional = false)
   @JoinColumn(name = "user_id")
   private User user;

   @Column(nullable = false)
   private LocalDateTime startTime;

   @Column(nullable = false)
   private LocalDateTime endTime;

   @Column(nullable = false)
   private String title;

   @Enumerated(EnumType.STRING)
   @Column(nullable = false)
   private BookingStatus status = BookingStatus.BOOKED;

   public Booking() {
   }

   public Long getId() {
       return id;
   }

   public void setId(Long id) {
       this.id = id;
   }

   public Room getRoom() {
       return room;
   }

   public void setRoom(Room room) {
       this.room = room;
   }

   public User getUser() {
       return user;
   }

   public void setUser(User user) {
       this.user = user;
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

   public String getTitle() {
       return title;
   }

   public void setTitle(String title) {
       this.title = title;
   }

   public BookingStatus getStatus() {
       return status;
   }

   public void setStatus(BookingStatus status) {
       this.status = status;
   }
}

