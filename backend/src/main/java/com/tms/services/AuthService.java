package com.tms.services;

import com.tms.dto.*;
import com.tms.exceptions.BadRequestException;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.Role;
import com.tms.models.User;
import com.tms.repositories.UserRepository;
import com.tms.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .role(registerRequest.getRole())
                .registered(false)
                .build();

        return userRepository.save(user);
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal();

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .role(userDetails.getRole().name())
                .name(userDetails.getName())
                .phone(userDetails.getPhone())
                .registered(userDetails.getRegistered())
                .build();
    }

    @Transactional
    public String generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + email));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
        userRepository.save(user);

        // In a real system, we would send this via email. We will log it in console.
        System.out.println("\n--------------------------------------------------");
        System.out.println("PASSWORD RESET REQUEST FOR: " + email);
        System.out.println("TOKEN: " + token);
        System.out.println("RESET LINK: http://localhost:5173/reset-password?token=" + token);
        System.out.println("--------------------------------------------------\n");

        return token;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        User user = userRepository.findByResetToken(resetPasswordRequest.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public Map<String, Object> updateProfile(User currentUser, String name, String phone, String newUsername) {
        Map<String, Object> response = new HashMap<>();
        currentUser.setName(name);
        currentUser.setPhone(phone);

        boolean usernameChanged = newUsername != null && !newUsername.trim().isEmpty() && !newUsername.equals(currentUser.getUsername());
        if (usernameChanged) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new BadRequestException("Error: Username is already taken!");
            }
            currentUser.setUsername(newUsername);
        }

        User savedUser = userRepository.save(currentUser);
        response.put("user", savedUser);

        if (usernameChanged) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    savedUser, null, savedUser.getAuthorities());
            String token = jwtUtils.generateJwtToken(authentication);
            response.put("token", token);
        }

        return response;
    }

    public Page<User> getUsersByRole(Role role, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findByRole(role, pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public long countUsersByRole(Role role) {
        return userRepository.countByRole(role);
    }
}
