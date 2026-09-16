package com.meetingbooking.service;

import com.meetingbooking.dto.AuthRequestDto;
import com.meetingbooking.dto.AuthResponseDto;
import com.meetingbooking.dto.RegisterUserDto;
import com.meetingbooking.dto.UserDto;

public interface AuthService {

   AuthResponseDto authenticate(AuthRequestDto request);

   UserDto registerEmployee(RegisterUserDto request);
}

