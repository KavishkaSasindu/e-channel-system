package com.example.e_channeling_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueueUpdatePayload {
    private Long doctorId;
    private int currentQueueNumber;
    private String message;
}
