package com.meetingbooking.service.impl;

import com.meetingbooking.entity.Booking;
import com.meetingbooking.entity.BookingStatus;
import com.meetingbooking.repository.BookingRepository;
import com.meetingbooking.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

   private final BookingRepository bookingRepository;

   public ReportServiceImpl(BookingRepository bookingRepository) {
       this.bookingRepository = bookingRepository;
   }

   @Override
   public Map<String, Long> getRoomUsageReport(LocalDate from, LocalDate to) {
       LocalDateTime start = from.atStartOfDay();
       LocalDateTime end = to.plusDays(1).atStartOfDay();
       List<Booking> bookings = bookingRepository.findAllBetweenWithStatus(start, end, BookingStatus.BOOKED);

       Map<String, Long> roomCounts = new HashMap<>();
       for (Booking booking : bookings) {
           String roomName = booking.getRoom().getName();
           roomCounts.put(roomName, roomCounts.getOrDefault(roomName, 0L) + 1);
       }
       return roomCounts;
   }

   @Override
   public Map<Integer, Long> getPeakHoursReport(LocalDate from, LocalDate to) {
       LocalDateTime start = from.atStartOfDay();
       LocalDateTime end = to.plusDays(1).atStartOfDay();
       List<Booking> bookings = bookingRepository.findAllBetweenWithStatus(start, end, BookingStatus.BOOKED);

       Map<Integer, Long> hourCounts = new HashMap<>();
       for (Booking booking : bookings) {
           int hour = booking.getStartTime().getHour();
           hourCounts.put(hour, hourCounts.getOrDefault(hour, 0L) + 1);
       }
       return hourCounts;
   }
}

