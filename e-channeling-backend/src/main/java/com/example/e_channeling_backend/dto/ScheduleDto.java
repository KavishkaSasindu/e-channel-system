package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.DoctorSchedule;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleDto {
    private Long scheduleId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
    private int capacity;

    public ScheduleDto(DoctorSchedule schedule) {
        this.scheduleId = schedule.getScheduleId();
        this.date = schedule.getDate();
        this.startTime = schedule.getStartTime();
        this.endTime = schedule.getEndTime();
        this.available = schedule.isAvailable();
        this.capacity = schedule.getCapacity();
    }
}
