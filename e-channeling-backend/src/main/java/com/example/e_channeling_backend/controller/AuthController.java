package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.dto.LogInRequestDto;
import com.example.e_channeling_backend.dto.LogInResponseDto;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.service.auth.AuthService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Data
@RequestMapping("/auth")
@RestController
public class AuthController {

    private AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

//    register user
    @PostMapping("/register-patient")
    public ResponseEntity<?> registerPatient(@RequestBody UserProfile userProfile) {
        try{
            UserProfile user = authService.createUserProfile(userProfile);
            if(user != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(user);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating user profile");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    login patient
    @PostMapping("/login-patient")
    public ResponseEntity<?> loginPatient(@RequestBody LogInRequestDto logInRequestDto) {
        try{
            LogInResponseDto returnValue = authService.logInPatient(logInRequestDto);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Username or password is incorrect");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    login staff member
    @PostMapping("/login-staff")
    public ResponseEntity<?> logInStaffMember(@RequestBody LogInRequestDto logInRequestDto) {
        try{
            LogInResponseDto returnValue = authService.logInStaff(logInRequestDto);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("bad credentials");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    doctor logIn
@PostMapping("/login-doctor")
public ResponseEntity<?> logInDoctor(@RequestBody LogInRequestDto logInRequestDto) {
    try{
        LogInResponseDto returnValue = authService.logInDoctor(logInRequestDto);
        if(returnValue != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(returnValue);
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("bad credentials");
    } catch (Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
    }
}
}
