package com.example.e_channeling_backend.service.auth;

import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.repo.UserProfileRepo;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Data
@Service
public class MyUserDetails implements UserDetailsService {

    private UserProfileRepo userProfileRepo;

    @Autowired
    public MyUserDetails(UserProfileRepo userProfileRepo) {
        this.userProfileRepo = userProfileRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserProfile> existUser = userProfileRepo.findByProfileEmail(username);
        if (existUser.isPresent()) {
            return existUser.get();
        }
        throw new UsernameNotFoundException(username);
    }
}
