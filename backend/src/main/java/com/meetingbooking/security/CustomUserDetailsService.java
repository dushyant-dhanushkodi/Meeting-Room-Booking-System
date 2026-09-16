package com.meetingbooking.security;

import com.meetingbooking.entity.Role;
import com.meetingbooking.entity.User;
import com.meetingbooking.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

   private final UserRepository userRepository;

   public CustomUserDetailsService(UserRepository userRepository) {
       this.userRepository = userRepository;
   }

   @Override
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

       Set<GrantedAuthority> authorities = user.getRoles().stream()
               .map(Role::getName)
               .map(roleName -> new SimpleGrantedAuthority("ROLE_" + roleName))
               .collect(Collectors.toSet());

       return new org.springframework.security.core.userdetails.User(
               user.getUsername(),
               user.getPassword(),
               authorities
       );
   }
}

