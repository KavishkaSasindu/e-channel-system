package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.enums.Role;
import lombok.Data;

@Data
public class LogInResponseDto {

    private Long profileId;
    private Long staffId;
    private Long doctorId;
    private String email;
    private String profileName;
    private String token;
    private Role role;

    // Private constructor to force usage of factory methods
    public LogInResponseDto(Long profileId, String email, String profileName, String token, Role role) {
        this.profileId = profileId;
        this.email = email;
        this.profileName = profileName;
        this.token = token;
        this.role = role;
    }

    public static LogInResponseDto fromBase(Long profileId, String email, String profileName, String token, Role role) {
        return new LogInResponseDto(profileId, email, profileName, token, role);
    }

    public static LogInResponseDto fromStaff(Long profileId, Long staffId, String email, String profileName, String token, Role role) {
        LogInResponseDto dto = new LogInResponseDto(profileId, email, profileName, token, role);
        dto.staffId = staffId;
        return dto;
    }

    public static LogInResponseDto fromDoctor(Long profileId, Long doctorId, String email, String profileName, String token, Role role) {
        LogInResponseDto dto = new LogInResponseDto(profileId, email, profileName, token, role);
        dto.doctorId = doctorId;
        return dto;
    }
}
