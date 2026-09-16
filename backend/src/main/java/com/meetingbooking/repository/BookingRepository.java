package com.meetingbooking.repository;

import com.meetingbooking.entity.Booking;
import com.meetingbooking.entity.BookingStatus;
import com.meetingbooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

   @Query("SELECT b FROM Booking b WHERE b.room = :room " +
           "AND b.status IN :activeStatuses " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
   List<Booking> findOverlappingBookings(@Param("room") Room room,
                                         @Param("startTime") LocalDateTime startTime,
                                         @Param("endTime") LocalDateTime endTime,
                                         @Param("activeStatuses") List<BookingStatus> activeStatuses);

   List<Booking> findByRoom(Room room);

   @Query("SELECT b FROM Booking b WHERE b.startTime BETWEEN :start AND :end")
   List<Booking> findAllBetween(@Param("start") LocalDateTime start,
                                @Param("end") LocalDateTime end);

   @Query("SELECT b FROM Booking b WHERE b.startTime BETWEEN :start AND :end AND b.status = :status")
   List<Booking> findAllBetweenWithStatus(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end,
                                           @Param("status") BookingStatus status);
}

