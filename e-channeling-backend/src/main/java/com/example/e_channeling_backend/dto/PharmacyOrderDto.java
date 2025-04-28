package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PharmacyOrderDto {
    private Long orderId;
    private Long prescriptionId;
    private Long patientId;
    private String patientName;
    private String prescriptionTitle;
    private DeliveryStatus orderStatus;
    private byte[] prescriptionImage;

}
