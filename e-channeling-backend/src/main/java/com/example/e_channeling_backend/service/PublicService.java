package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.repo.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicService {

    private final DoctorRepository doctorRepository;

    public PublicService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor checkExistDoctor(Long doctorId) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        return doctor.orElse(null);
    }

    //    get doctor profile
    public Doctor getDoctorProfile(Long doctorId) {
        return checkExistDoctor(doctorId);
    }

//    get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
}
