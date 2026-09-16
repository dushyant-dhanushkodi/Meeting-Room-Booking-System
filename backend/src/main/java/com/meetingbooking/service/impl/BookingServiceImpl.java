package com.meetingbooking.service.impl;

import com.meetingbooking.dto.BookingDto;
import com.meetingbooking.entity.Booking;
import com.meetingbooking.entity.BookingStatus;
import com.meetingbooking.entity.Room;
import com.meetingbooking.entity.User;
import com.meetingbooking.exception.BusinessException;
import com.meetingbooking.exception.NotFoundException;
import com.meetingbooking.repository.BookingRepository;
import com.meetingbooking.repository.RoomRepository;
import com.meetingbooking.repository.UserRepository;
import com.meetingbooking.service.BookingService;
import com.meetingbooking.service.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

   private static final int MAX_DURATION_HOURS = 2;
   private static final LocalTime OFFICE_START = LocalTime.of(9, 0);
   private static final LocalTime OFFICE_END = LocalTime.of(18, 0);

   private final BookingRepository bookingRepository;
   private final RoomRepository roomRepository;
   private final UserRepository userRepository;
   private final NotificationService notificationService;
   private final ModelMapper modelMapper;

   public BookingServiceImpl(BookingRepository bookingRepository,
                             RoomRepository roomRepository,
                             UserRepository userRepository,
                             NotificationService notificationService,
                             ModelMapper modelMapper) {
       this.bookingRepository = bookingRepository;
       this.roomRepository = roomRepository;
       this.userRepository = userRepository;
       this.notificationService = notificationService;
       this.modelMapper = modelMapper;
   }

   @Override
   public BookingDto createBooking(BookingDto bookingDto) {
       Room room = roomRepository.findById(bookingDto.getRoomId())
               .orElseThrow(() -> new NotFoundException("Room not found with id " + bookingDto.getRoomId()));
       User user = userRepository.findById(bookingDto.getUserId())
               .orElseThrow(() -> new NotFoundException("User not found with id " + bookingDto.getUserId()));

       LocalDateTime start = bookingDto.getStartTime();
       LocalDateTime end = bookingDto.getEndTime();

       validateBusinessRules(room, start, end);

       Booking booking = new Booking();
       booking.setRoom(room);
       booking.setUser(user);
       booking.setTitle(bookingDto.getTitle());
       booking.setStartTime(start);
       booking.setEndTime(end);
       booking.setStatus(BookingStatus.BOOKED);

       Booking saved = bookingRepository.save(booking);
       notificationService.createBookingNotification(user, saved, "Booking created successfully.");

       return toDto(saved);
   }

   @Override
   public BookingDto overrideBooking(Long bookingId, BookingDto newBookingDto) {
       Booking existing = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new NotFoundException("Booking not found with id " + bookingId));

       existing.setStatus(BookingStatus.OVERRIDDEN);
       bookingRepository.save(existing);

       return createBooking(newBookingDto);
   }

   @Override
   public void cancelBooking(Long bookingId) {
       Booking booking = bookingRepository.findById(bookingId)
               .orElseThrow(() -> new NotFoundException("Booking not found with id " + bookingId));
       booking.setStatus(BookingStatus.CANCELLED);
       bookingRepository.save(booking);
       notificationService.createBookingNotification(booking.getUser(), booking, "Booking cancelled.");
   }

   @Override
   public List<BookingDto> getBookingsForUser(Long userId) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new NotFoundException("User not found with id " + userId));
       return bookingRepository.findAll().stream()
               .filter(b -> b.getUser().getId().equals(user.getId()))
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   @Override
   public List<BookingDto> getBookingsForRoom(Long roomId) {
       Room room = roomRepository.findById(roomId)
               .orElseThrow(() -> new NotFoundException("Room not found with id " + roomId));
       return bookingRepository.findByRoom(room).stream()
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   @Override
   public List<BookingDto> getAvailableSlots(Long roomId, LocalDateTime start, LocalDateTime end) {
       Room room = roomRepository.findById(roomId)
               .orElseThrow(() -> new NotFoundException("Room not found with id " + roomId));

       List<Booking> bookings = bookingRepository.findByRoom(room);
       return bookings.stream()
               .filter(b -> b.getStatus() == BookingStatus.BOOKED)
               .filter(b -> !b.getStartTime().isAfter(end) && !b.getEndTime().isBefore(start))
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   @Override
   public List<BookingDto> getAllBookings() {
       return bookingRepository.findAll().stream()
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   private void validateBusinessRules(Room room, LocalDateTime start, LocalDateTime end) {
       if (!end.isAfter(start)) {
           throw new BusinessException("End time must be after start time.");
       }

       long durationHours = Duration.between(start, end).toHours();
       if (durationHours > MAX_DURATION_HOURS) {
           throw new BusinessException("Maximum booking duration is " + MAX_DURATION_HOURS + " hours.");
       }

       LocalTime startTime = start.toLocalTime();
       LocalTime endTime = end.toLocalTime();

       if (startTime.isBefore(OFFICE_START) || endTime.isAfter(OFFICE_END)) {
           throw new BusinessException("Booking must be within office hours (09:00 - 18:00).");
       }

       List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.BOOKED);
       List<Booking> overlapping = bookingRepository.findOverlappingBookings(room, start, end, activeStatuses);
       if (!overlapping.isEmpty()) {
           throw new BusinessException("There is already a booking for this room in the selected time range.");
       }
   }

   private BookingDto toDto(Booking booking) {
       BookingDto dto = modelMapper.map(booking, BookingDto.class);
       dto.setRoomId(booking.getRoom().getId());
       dto.setUserId(booking.getUser().getId());
       dto.setRoomName(booking.getRoom().getName());
       dto.setUsername(booking.getUser().getUsername());
       return dto;
   }
}

