package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.Specialization;
import com.example.e_channeling_backend.model.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class DoctorProfileDto {
    private Long doctorId;
    private double consultationFee;
    private String qualification;
    private boolean available;
    private UserProfileDto userProfile;
    private SpecializationDto specialization;
    private List<ScheduleDto> schedules;

    // Constructor using Doctor entity
    public DoctorProfileDto(Doctor doctor) {
        this.doctorId = doctor.getDoctorId();
        this.consultationFee = doctor.getConsultationFee();
        this.qualification = doctor.getQualification();
        this.available = doctor.isAvailable();

        this.userProfile = new UserProfileDto(doctor.getUserProfile());
        this.specialization = new SpecializationDto(doctor.getSpecialization());

        this.schedules = doctor.getSchedules().stream()
                .map(ScheduleDto::new)
                .toList();
    }

}
