package com.example.e_channeling_backend.dto;

import lombok.Data;

@Data
public class AppointmentResponseDTO {
    private Long appointmentId;
    private PatientInfoDTO patient;
}
