package com.example.e_channeling_backend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "prescriptionId"
)
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    private String prescriptionTitle;
    private byte[] prescriptionImage;

    @OneToOne(mappedBy = "prescription")
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(
            name = "doctor_id"
    )
    private Doctor doctor;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL)
    private List<PrescriptionItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "prescription", cascade = CascadeType.ALL)
    private PharmacyOrder order;
}
