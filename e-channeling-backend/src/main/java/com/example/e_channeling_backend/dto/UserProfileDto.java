package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileDto {
    private Long profileId;
    private String profileName;
    private String profileEmail;
    private String phone;
    private String address;
    private Role role;
    private byte[] profileImage;

    public UserProfileDto(UserProfile profile) {
        this.profileId = profile.getProfileId();
        this.profileName = profile.getProfileName();
        this.profileEmail = profile.getProfileEmail();
        this.phone = profile.getPhone();
        this.address = profile.getAddress();
        this.role = profile.getRole();
        this.profileImage = profile.getImage();
    }
}
