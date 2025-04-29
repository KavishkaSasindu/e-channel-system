package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepo extends JpaRepository<Prescription, Long> {

}
