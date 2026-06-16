package com.tms;

import com.tms.dto.RegisterRequest;
import com.tms.config.JwtUtils;
import com.tms.models.Role;
import com.tms.models.User;
import com.tms.repositories.UserRepository;
import com.tms.services.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TransportManagementApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void contextLoads() {
        // Verify Application context boot
    }

    @Test
    void testUserRegistrationAndPasswordHashing() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("teststudent");
        request.setPassword("studentpassword");
        request.setEmail("teststudent@tms.com");
        request.setName("Test Student");
        request.setPhone("+12345678");
        request.setRole(Role.ROLE_STUDENT);

        User savedUser = authService.registerUser(request);

        assertNotNull(savedUser.getId());
        assertEquals("teststudent", savedUser.getUsername());
        assertEquals("teststudent@tms.com", savedUser.getEmail());
        assertEquals(Role.ROLE_STUDENT, savedUser.getRole());
        assertFalse(savedUser.getRegistered());

        assertNotEquals("studentpassword", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("studentpassword", savedUser.getPassword()));
    }

    @Test
    void testJwtTokenGenerationAndValidation() {
        User user = User.builder()
                .id(999L)
                .username("jwttestuser")
                .password("dummy")
                .email("jwt@tms.com")
                .role(Role.ROLE_STUDENT)
                .name("JWT Tester")
                .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtUtils.generateJwtToken(auth);

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("jwttestuser", jwtUtils.getUsernameFromJwtToken(token));
    }
}
