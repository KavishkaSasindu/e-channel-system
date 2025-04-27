package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepo extends JpaRepository<Staff,Long> {
    Optional<Staff> findByUserProfile_ProfileEmail(String email);
}
