package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.Appointment;
import com.example.e_channeling_backend.model.DoctorSchedule;
import lombok.Data;

@Data
public class AppointmentQueueDto {
    private int queueNumber;
    private Long doctorId;
    private String doctorName;
    private String appointmentDateTime;
    private String patientName;

    // Constructor using Appointment entity
    public AppointmentQueueDto(Appointment appointment) {
        this.queueNumber = appointment.getQueueEntry().getQueueNumber();
        this.doctorId = appointment.getDoctor().getDoctorId();
        this.doctorName = appointment.getDoctor().getUserProfile().getProfileName();
        this.patientName = appointment.getPatient().getProfileName();

        // Get schedule from doctor's schedules matching appointment's schedule
        DoctorSchedule appointmentSchedule = appointment.getDoctor().getSchedules().stream()
                .filter(s -> s.getScheduleId().equals(appointment.getSchedule().getScheduleId()))
                .findFirst()
                .orElseThrow();

        this.appointmentDateTime = appointmentSchedule.getDate() + " " + appointmentSchedule.getStartTime();
    }
}
