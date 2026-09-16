package com.meetingbooking.service.impl;

import com.meetingbooking.dto.AuthRequestDto;
import com.meetingbooking.dto.AuthResponseDto;
import com.meetingbooking.dto.RegisterUserDto;
import com.meetingbooking.dto.UserDto;
import com.meetingbooking.entity.Role;
import com.meetingbooking.entity.User;
import com.meetingbooking.exception.BusinessException;
import com.meetingbooking.repository.RoleRepository;
import com.meetingbooking.repository.UserRepository;
import com.meetingbooking.security.JwtTokenProvider;
import com.meetingbooking.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

   private final AuthenticationManager authenticationManager;
   private final JwtTokenProvider jwtTokenProvider;
   private final UserRepository userRepository;
   private final RoleRepository roleRepository;
   private final PasswordEncoder passwordEncoder;
   private final ModelMapper modelMapper;

   public AuthServiceImpl(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          ModelMapper modelMapper) {
       this.authenticationManager = authenticationManager;
       this.jwtTokenProvider = jwtTokenProvider;
       this.userRepository = userRepository;
       this.roleRepository = roleRepository;
       this.passwordEncoder = passwordEncoder;
       this.modelMapper = modelMapper;
   }

   @Override
   public AuthResponseDto authenticate(AuthRequestDto request) {
       Authentication authentication = authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(
                       request.getUsername(),
                       request.getPassword()
               )
       );

       String token = jwtTokenProvider.generateToken(authentication);

       User user = userRepository.findByUsername(request.getUsername())
               .orElseThrow(() -> new BusinessException("User not found after authentication"));

       Set<String> roles = user.getRoles().stream()
               .map(Role::getName)
               .collect(Collectors.toSet());

       return new AuthResponseDto(token, user.getUsername(), roles, user.getId());
   }

   @Override
   public UserDto registerEmployee(RegisterUserDto request) {
       if (userRepository.existsByUsername(request.getUsername())) {
           throw new BusinessException("Username is already taken");
       }
       if (userRepository.existsByEmail(request.getEmail())) {
           throw new BusinessException("Email is already registered");
       }

       User user = new User();
       user.setUsername(request.getUsername());
       user.setEmail(request.getEmail());
       user.setPassword(passwordEncoder.encode(request.getPassword()));

       Role roleEmployee = roleRepository.findByName("EMPLOYEE")
               .orElseGet(() -> roleRepository.save(new Role("EMPLOYEE")));

       user.setRoles(Collections.singleton(roleEmployee));
       User saved = userRepository.save(user);

       UserDto dto = modelMapper.map(saved, UserDto.class);
       Set<String> roleNames = saved.getRoles().stream()
               .map(Role::getName)
               .collect(Collectors.toSet());
       dto.setRoles(roleNames);
       return dto;
   }
}

