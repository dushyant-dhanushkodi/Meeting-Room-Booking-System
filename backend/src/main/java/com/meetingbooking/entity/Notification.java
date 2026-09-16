package com.meetingbooking.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne(optional = false)
   @JoinColumn(name = "user_id")
   private User user;

   @ManyToOne(optional = false)
   @JoinColumn(name = "booking_id")
   private Booking booking;

   @Column(nullable = false)
   private String message;

   @Column(nullable = false)
   private LocalDateTime createdAt = LocalDateTime.now();

   @Column(nullable = false)
   private boolean sent = false;

   public Notification() {
   }

   public Long getId() {
       return id;
   }

   public void setId(Long id) {
       this.id = id;
   }

   public User getUser() {
       return user;
   }

   public void setUser(User user) {
       this.user = user;
   }

   public Booking getBooking() {
       return booking;
   }

   public void setBooking(Booking booking) {
       this.booking = booking;
   }

   public String getMessage() {
       return message;
   }

   public void setMessage(String message) {
       this.message = message;
   }

   public LocalDateTime getCreatedAt() {
       return createdAt;
   }

   public void setCreatedAt(LocalDateTime createdAt) {
       this.createdAt = createdAt;
   }

   public boolean isSent() {
       return sent;
   }

   public void setSent(boolean sent) {
       this.sent = sent;
   }
}

