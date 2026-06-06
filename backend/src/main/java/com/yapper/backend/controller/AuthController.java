package com.yapper.backend.controller;

import com.yapper.backend.dto.LoginRequest;
import com.yapper.backend.dto.RegisterRequest;
import com.yapper.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")

public class AuthController { //for identity/authentication ops
   private final AuthService authService;

   public AuthController(AuthService authService){
       this.authService = authService;
   }

   @PostMapping("/register")
    public ResponseEntity<?> register (@RequestBody RegisterRequest registerRequest){

       return authService.register(registerRequest);
   }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest loginRequest){


    return authService.login(loginRequest);
    }


}
