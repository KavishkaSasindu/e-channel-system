package com.example.e_channeling_backend.service.auth;

import com.example.e_channeling_backend.dto.LogInRequestDto;
import com.example.e_channeling_backend.dto.LogInResponseDto;
import com.example.e_channeling_backend.jwt.JwtService;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.model.enums.Role;
import com.example.e_channeling_backend.repo.UserProfileRepo;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Data
@Service
public class AuthService {

    private JwtService jwtService;
    private UserProfileRepo userProfileRepo;
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(JwtService jwtService,UserProfileRepo userProfileRepo,AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.userProfileRepo = userProfileRepo;
        this.authenticationManager = authenticationManager;
    }


    public UserProfile checkUserIsExist(String email) {
        Optional<UserProfile> existUser = userProfileRepo.findByProfileEmail(email);
        return existUser.orElse(null);
    }


//    register as a user
    public UserProfile createUserProfile(UserProfile userProfile) {
        UserProfile existUser = checkUserIsExist(userProfile.getProfileEmail());
        if (existUser != null) {
            throw new RuntimeException("User profile already exists");
        }
        userProfile.setRole(Role.PATIENT);
        userProfile.setPassword(bCryptPasswordEncoder.encode(userProfile.getPassword()));
        return userProfileRepo.save(userProfile);
    }


//    login patient
    public LogInResponseDto logInPatient(LogInRequestDto logInRequestDto) {
        UserProfile user = checkUserIsExist(logInRequestDto.getEmail());
        if(user == null) {
            throw new RuntimeException("User not found");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(logInRequestDto.getEmail(), logInRequestDto.getPassword())
        );
        if(authentication.isAuthenticated()) {
            Map<String,Object> claims = new HashMap<>();
            claims.put("profileId",user.getProfileId());
            claims.put("email", user.getProfileEmail());
            claims.put("role", user.getRole());
            claims.put("username", user.getProfileName());

            String token = jwtService.generateToken(claims,user);
            return new  LogInResponseDto(
                    user.getProfileId(),
                    user.getProfileEmail(),
                    user.getProfileName(),
                    token,
                    user.getRole()
            );
        }
        return null;
    }

//    staff login
public LogInResponseDto logInStaff(LogInRequestDto logInRequestDto) {
    UserProfile user = checkUserIsExist(logInRequestDto.getEmail());
    if(user == null) {
        throw new RuntimeException("User not found");
    }

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(logInRequestDto.getEmail(), logInRequestDto.getPassword())
    );
    if(authentication.isAuthenticated()) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("profileId",user.getProfileId());
        claims.put("email", user.getProfileEmail());
        claims.put("role", user.getRole());
        claims.put("username", user.getProfileName());
        claims.put("staffId",user.getStaff().getStaffId());

        String token = jwtService.generateToken(claims,user);
        return LogInResponseDto.fromStaff(
                user.getProfileId(),
                user.getStaff().getStaffId(),
                user.getProfileEmail(),
                user.getProfileName(),
                token,
                user.getRole()
        );
    }
    return null;
}

//doctor login
public LogInResponseDto logInDoctor(LogInRequestDto logInRequestDto) {
    UserProfile user = checkUserIsExist(logInRequestDto.getEmail());
    if(user == null) {
        throw new RuntimeException("User not found");
    }

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(logInRequestDto.getEmail(), logInRequestDto.getPassword())
    );
    if(authentication.isAuthenticated()) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("profileId",user.getProfileId());
        claims.put("email", user.getProfileEmail());
        claims.put("role", user.getRole());
        claims.put("username", user.getProfileName());
        claims.put("doctorId",user.getDoctor().getDoctorId());

        String token = jwtService.generateToken(claims,user);
        return LogInResponseDto.fromDoctor(
                user.getProfileId(),
                user.getDoctor().getDoctorId(),
                user.getProfileEmail(),
                user.getProfileName(),
                token,
                user.getRole()
        );
    }
    return null;
}
}
