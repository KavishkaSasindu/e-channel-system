package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepo extends JpaRepository<UserProfile,Long> {

    Optional<UserProfile> findByProfileEmail(String profileEmail);
}
