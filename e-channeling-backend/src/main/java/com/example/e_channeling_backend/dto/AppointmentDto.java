package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.enums.AppointmentStatus;
import com.example.e_channeling_backend.model.enums.QueueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDto {
    private Long appointmentId;
    private AppointmentStatus appointmentStatus;
    private PatientInfo patient;
    private DoctorInfo doctor;
    private ScheduleInfo schedule;
    private QueueInfo queue;

    // Nested static classes for organization
    @Data
    public static class PatientInfo {
        private Long profileId;
        private String profileName;
        private String profileEmail;
        private String phone;
        // Getters & Setters
    }

    @Data
    public static class DoctorInfo {
        private Long doctorId;
        private String doctorName;
        private String specialization;
        private double consultationFee;
        // Getters & Setters
    }
    @Data
    public static class ScheduleInfo {
        private Long scheduleId;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        // Getters & Setters
    }

    @Data
    public static class QueueInfo {
        private int queueNumber;
        private QueueStatus status;
        // Getters & Setters
    }
}
