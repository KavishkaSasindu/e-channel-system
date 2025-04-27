package com.example.e_channeling_backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleResponseDTO {

    private Long scheduleId;
    private Long doctorId;
    private LocalDate date;
    private LocalTime startTime;
}
