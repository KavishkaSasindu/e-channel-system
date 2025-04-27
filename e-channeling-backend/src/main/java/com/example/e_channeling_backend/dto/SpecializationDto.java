package com.example.e_channeling_backend.dto;

import com.example.e_channeling_backend.model.Specialization;
import lombok.Data;

@Data
public class SpecializationDto {
    private Long specializationId;
    private String specializationName;
    private String specializationDescription;

    public SpecializationDto(Specialization specialization) {
        if(specialization != null) {
            this.specializationId = specialization.getSpecializationId();
            this.specializationName = specialization.getSpecializationName();
            this.specializationDescription = specialization.getSpecializationDescription();
        }
    }
}
