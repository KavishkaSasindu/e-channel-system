package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.repo.DoctorRepository;
import com.example.e_channeling_backend.repo.DoctorScheduleRepo;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Data
@Service
public class DoctorScheduleService {
    private DoctorScheduleRepo doctorScheduleRepo;
    private DoctorRepository doctorRepository;

    @Autowired
    public DoctorScheduleService(DoctorScheduleRepo doctorScheduleRepo, DoctorRepository doctorRepository) {
        this.doctorScheduleRepo = doctorScheduleRepo;
        this.doctorRepository = doctorRepository;
    }

//    get schedules by doctor id
    public List<DoctorSchedule> getSchedulesByDoctorId(Long doctorId) {

        Optional<Doctor> existDoctor = doctorRepository.findById(doctorId);
        if(existDoctor.isEmpty()) {
            return null;
        }
        return doctorScheduleRepo.findByDoctor_DoctorId(doctorId);
    }

    // Add to DoctorScheduleService
    public DoctorSchedule getScheduleById(Long scheduleId) {
        return doctorScheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }
}
