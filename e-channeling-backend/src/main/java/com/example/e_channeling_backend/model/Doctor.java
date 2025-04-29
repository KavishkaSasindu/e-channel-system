package com.example.e_channeling_backend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString(exclude = "userProfile")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "doctorId"
)
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;

    @OneToOne(mappedBy = "doctor")
    private UserProfile userProfile;

    private Double consultationFee;
    private String qualification;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "specialization_id"
    )
    private Specialization specialization;

    private boolean available;
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL,fetch = FetchType.LAZY,orphanRemoval = true)
    private List<DoctorSchedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;



    public void addSchedule(DoctorSchedule schedule) {
        schedules.add(schedule);
        schedule.setDoctor(this);
    }

    public void removeSchedule(DoctorSchedule schedule) {
        schedules.remove(schedule);
        schedule.setDoctor(null);
    }

}
