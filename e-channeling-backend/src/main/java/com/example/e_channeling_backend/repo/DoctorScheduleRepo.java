package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorScheduleRepo extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctor_DoctorId(Long doctorId);
    List<DoctorSchedule> findByDoctorDoctorId(Long doctorId);
}
