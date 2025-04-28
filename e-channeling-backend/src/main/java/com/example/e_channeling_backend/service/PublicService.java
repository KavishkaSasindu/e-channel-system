package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.DoctorProfileDto;
import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.repo.DoctorRepository;
import com.example.e_channeling_backend.repo.UserProfileRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublicService {

    private final DoctorRepository doctorRepository;
    private final UserProfileRepo userProfileRepo;

    public PublicService(DoctorRepository doctorRepository, UserProfileRepo userProfileRepo) {
        this.doctorRepository = doctorRepository;
        this.userProfileRepo = userProfileRepo;
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
    public List<DoctorProfileDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .filter(Objects::nonNull)
                .map(DoctorProfileDto::new)
                .collect(Collectors.toList());
    }

//    get doctor profile image
    public byte[] getProfileImage(Long profileId) {
        UserProfile user = userProfileRepo.findById(profileId).get();
        return user.getImage();
    }
}
