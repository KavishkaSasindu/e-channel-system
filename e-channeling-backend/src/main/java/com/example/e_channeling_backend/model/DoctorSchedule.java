package com.example.e_channeling_backend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "scheduleId"
)
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schedule_seq")
    @SequenceGenerator(name = "schedule_seq", sequenceName = "schedule_sequence", allocationSize = 1)
    private Long scheduleId;
    private DayOfWeek dayOfWeek;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    @ManyToOne
    @JoinColumn(
            name = "doctor_id"
    )
    private Doctor doctor;
    private boolean available;

    private int capacity;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Appointment> appointments;

}
