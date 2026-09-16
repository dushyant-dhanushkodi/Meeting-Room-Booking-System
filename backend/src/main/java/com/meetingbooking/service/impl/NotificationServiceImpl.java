package com.meetingbooking.service.impl;

import com.meetingbooking.dto.NotificationDto;
import com.meetingbooking.entity.Booking;
import com.meetingbooking.entity.Notification;
import com.meetingbooking.entity.User;
import com.meetingbooking.repository.NotificationRepository;
import com.meetingbooking.service.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

   private final NotificationRepository notificationRepository;
   private final ModelMapper modelMapper;

   public NotificationServiceImpl(NotificationRepository notificationRepository, ModelMapper modelMapper) {
       this.notificationRepository = notificationRepository;
       this.modelMapper = modelMapper;
   }

   @Override
   public NotificationDto createBookingNotification(User user, Booking booking, String message) {
       Notification notification = new Notification();
       notification.setUser(user);
       notification.setBooking(booking);
       notification.setMessage(message);
       Notification saved = notificationRepository.save(notification);
       return toDto(saved);
   }

   @Override
   public NotificationDto createReminderNotification(User user, Booking booking, String message) {
       Notification notification = new Notification();
       notification.setUser(user);
       notification.setBooking(booking);
       notification.setMessage(message);
       Notification saved = notificationRepository.save(notification);
       return toDto(saved);
   }

   private NotificationDto toDto(Notification notification) {
       NotificationDto dto = modelMapper.map(notification, NotificationDto.class);
       dto.setBookingId(notification.getBooking().getId());
       dto.setUserId(notification.getUser().getId());
       return dto;
   }
}

