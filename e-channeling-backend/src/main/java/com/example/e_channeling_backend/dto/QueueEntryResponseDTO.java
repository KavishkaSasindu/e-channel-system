package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.enums.QueueStatus;
import lombok.Data;

@Data
public class QueueEntryResponseDTO {
    private Long queueId;
    private QueueStatus status;
    private int queueNumber;
    private AppointmentResponseDTO appointment;
    private ScheduleResponseDTO schedule;
}
