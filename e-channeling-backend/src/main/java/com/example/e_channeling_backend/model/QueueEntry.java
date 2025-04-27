package com.example.e_channeling_backend.model;

import com.example.e_channeling_backend.model.enums.QueueStatus;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "queueId"
)
public class QueueEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queueId;

    @OneToOne
    @JoinColumn(
            name = "appoinment_id"
    )
    private Appointment appointment;

    @Enumerated(EnumType.STRING)
    private QueueStatus status;

    private int queueNumber;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "schedule_id"
    )
    private DoctorSchedule schedule;
}