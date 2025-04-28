package com.example.e_channeling_backend.model;

import com.example.e_channeling_backend.model.enums.AppointmentStatus;
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
        property = "appointmentId"
)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus appointmentStatus;

    @ManyToOne
    @JoinColumn(
            name = "profile_id"
    )
    private UserProfile patient;

    @ManyToOne
    @JoinColumn(
            name = "doctor_id"
    )
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(
            name = "schedule_id"
    )
    private DoctorSchedule schedule;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL)
    private QueueEntry queueEntry;

}
