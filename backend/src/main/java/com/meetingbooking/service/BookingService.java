package com.meetingbooking.service;

import com.meetingbooking.dto.BookingDto;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {

   BookingDto createBooking(BookingDto bookingDto);

   BookingDto overrideBooking(Long bookingId, BookingDto newBookingDto);

   void cancelBooking(Long bookingId);

   List<BookingDto> getBookingsForUser(Long userId);

   List<BookingDto> getBookingsForRoom(Long roomId);

   List<BookingDto> getAvailableSlots(Long roomId, LocalDateTime start, LocalDateTime end);

   List<BookingDto> getAllBookings();
}

