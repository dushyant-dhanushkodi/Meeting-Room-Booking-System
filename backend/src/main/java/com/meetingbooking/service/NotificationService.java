package com.meetingbooking.service;

import com.meetingbooking.dto.NotificationDto;
import com.meetingbooking.entity.Booking;
import com.meetingbooking.entity.User;

public interface NotificationService {

   NotificationDto createBookingNotification(User user, Booking booking, String message);

   NotificationDto createReminderNotification(User user, Booking booking, String message);
}

