package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.Staff;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.model.enums.Role;
import com.example.e_channeling_backend.repo.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Service
public class StaffService {
    private final StaffRepo staffRepo;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepo doctorScheduleRepo;
    private final SpecializationRepo specializationRepo;
    private UserProfileRepo userProfileRepo;
    private BCryptPasswordEncoder bcryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    public StaffService (UserProfileRepo userProfileRepo, StaffRepo staffRepo, DoctorRepository doctorRepository, SpecializationRepo specializationRepo, DoctorScheduleRepo doctorScheduleRepo) {
        this.userProfileRepo = userProfileRepo;
        this.staffRepo = staffRepo;
        this.doctorRepository = doctorRepository;
        this.specializationRepo = specializationRepo;
        this.doctorScheduleRepo = doctorScheduleRepo;
    }

    public UserProfile checkUserIsExist(String profileEmail) {
        Optional<UserProfile> existUser = userProfileRepo.findByProfileEmail(profileEmail);
        return existUser.orElse(null);
    }

//    create a user
    public UserProfile createUserProfile(UserProfile userProfile) {
        UserProfile existUser = checkUserIsExist(userProfile.getProfileEmail());
        if (existUser != null) {
            throw new RuntimeException("User profile already exists");
        }
        userProfile.setRole(Role.PATIENT);
        return userProfileRepo.save(userProfile);
    }

//    create staff member
    @Transactional
    public Staff createStaffMember(Staff staff) {
        UserProfile existUser = checkUserIsExist(staff.getUserProfile().getProfileEmail());
        if(existUser != null) {
            throw new RuntimeException("User profile already exists");
        }
        UserProfile newUserProfile = new UserProfile();
        UserProfile requestUserProfile = staff.getUserProfile();
        newUserProfile.setProfileName(requestUserProfile.getProfileName());
        newUserProfile.setProfileEmail(requestUserProfile.getProfileEmail());
        newUserProfile.setPassword(new BCryptPasswordEncoder().encode(requestUserProfile.getPassword()));
        newUserProfile.setPhone(requestUserProfile.getPhone());
        newUserProfile.setAddress(requestUserProfile.getAddress());
        newUserProfile.setRole(Role.STAFF);

        Staff newStaff = new Staff();
        newStaff.setUserProfile(newUserProfile);
        newUserProfile.setStaff(newStaff);

        UserProfile saveProfile = userProfileRepo.save(newUserProfile);
        staff.setUserProfile(saveProfile);
        return staffRepo.save(staff);
    }

    @Transactional
    public Doctor createDoctor(Doctor doctor, MultipartFile image) throws IOException {
        UserProfile existUser = checkUserIsExist(doctor.getUserProfile().getProfileEmail());
        if (existUser != null) {
            throw new RuntimeException("User profile already exists");
        }

        // Extract info and create a new user profile
        UserProfile requestUserProfile = doctor.getUserProfile();
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setProfileName(requestUserProfile.getProfileName());
        newUserProfile.setProfileEmail(requestUserProfile.getProfileEmail());
        newUserProfile.setPassword(new BCryptPasswordEncoder().encode(requestUserProfile.getPassword()));
        newUserProfile.setPhone(requestUserProfile.getPhone());
        newUserProfile.setAddress(requestUserProfile.getAddress());
        if(image != null){
            newUserProfile.setImage(image.getBytes());
        }

        newUserProfile.setRole(Role.DOCTOR);

        // Create the doctor
        Doctor newDoctor = new Doctor();
        newDoctor.setConsultationFee(doctor.getConsultationFee());
        newDoctor.setQualification(doctor.getQualification());
        newDoctor.setSpecialization(doctor.getSpecialization());
        newDoctor.setAvailable(true);

        // Connect both sides of the relationship
        newDoctor.setUserProfile(newUserProfile);
        newUserProfile.setDoctor(newDoctor);

        userProfileRepo.save(newUserProfile);

        // Assign schedules
        List<DoctorSchedule> schedules = doctor.getSchedules();
        if (schedules != null && !schedules.isEmpty()) {
            for (DoctorSchedule schedule : schedules) {
                schedule.setDoctor(newDoctor);
            }
            newDoctor.setSchedules(schedules);
        }

        // Save the owning side — only need to save the profile, cascade will save the doctor
        return doctorRepository.save(newDoctor); // OR userProfileRepo.save(newUserProfile);
    }

}
