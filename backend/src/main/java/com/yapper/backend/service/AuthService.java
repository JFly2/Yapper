package com.yapper.backend.service;

import com.yapper.backend.dto.LoginRequest;
import com.yapper.backend.dto.RegisterRequest;
import com.yapper.backend.model.User;
import com.yapper.backend.repository.UserRepository;
import com.yapper.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ResponseEntity<?> login(LoginRequest request) {

        User user = userRepository.findByUsername(request.username());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(token);
    }

    public ResponseEntity<?> register (RegisterRequest request){

        if (userRepository.existsByUsername(request.username())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        if (userRepository.existsByEmail(request.email())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        User user = new User(request.username(), request.email(), passwordEncoder.encode(request.password()));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

}
