package com.meetingbooking.controller;

import com.meetingbooking.dto.AuthRequestDto;
import com.meetingbooking.dto.AuthResponseDto;
import com.meetingbooking.dto.RegisterUserDto;
import com.meetingbooking.dto.UserDto;
import com.meetingbooking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

   private final AuthService authService;

   public AuthController(AuthService authService) {
       this.authService = authService;
   }

   @PostMapping("/login")
   public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
       AuthResponseDto response = authService.authenticate(request);
       return ResponseEntity.ok(response);
   }

   @PostMapping("/register")
   public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterUserDto request) {
       UserDto userDto = authService.registerEmployee(request);
       return ResponseEntity.ok(userDto);
   }
}

