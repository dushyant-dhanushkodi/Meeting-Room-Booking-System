package com.meetingbooking.controller;

import com.meetingbooking.dto.BookingDto;
import com.meetingbooking.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

   private final BookingService bookingService;

   public BookingController(BookingService bookingService) {
       this.bookingService = bookingService;
   }

   @PostMapping
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<BookingDto> createBooking(@RequestBody BookingDto bookingDto) {
       return ResponseEntity.ok(bookingService.createBooking(bookingDto));
   }

   @PostMapping("/{id}/override")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<BookingDto> overrideBooking(@PathVariable Long id, @RequestBody BookingDto bookingDto) {
       return ResponseEntity.ok(bookingService.overrideBooking(id, bookingDto));
   }

   @PostMapping("/{id}/cancel")
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
       bookingService.cancelBooking(id);
       return ResponseEntity.noContent().build();
   }

   @GetMapping("/user/{userId}")
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<List<BookingDto>> getBookingsForUser(@PathVariable Long userId) {
       return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
   }

   @GetMapping("/room/{roomId}")
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<List<BookingDto>> getBookingsForRoom(@PathVariable Long roomId) {
       return ResponseEntity.ok(bookingService.getBookingsForRoom(roomId));
   }

   @GetMapping("/room/{roomId}/slots")
   @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
   public ResponseEntity<List<BookingDto>> getUnavailableSlots(
           @PathVariable Long roomId,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
       return ResponseEntity.ok(bookingService.getAvailableSlots(roomId, start, end));
   }

   @GetMapping("/all")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<List<BookingDto>> getAllBookings() {
       return ResponseEntity.ok(bookingService.getAllBookings());
   }
}

