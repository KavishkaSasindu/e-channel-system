package com.example.e_channeling_backend.model;

import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class PharmacyOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(
            name = "profile_id"
    )
    private UserProfile patient;


    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
}
