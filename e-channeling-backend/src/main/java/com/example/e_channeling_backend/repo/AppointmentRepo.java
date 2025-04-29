package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.Appointment;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepo extends JpaRepository<Appointment,Long> {
    boolean existsByPatientAndSchedule(UserProfile patient, DoctorSchedule schedule);

    List<Appointment> findByDoctor_DoctorIdAndSchedule_ScheduleId(Long doctorId, Long scheduleId);

    List<Appointment> findByPatient_ProfileId(Long profileId);

    List<Appointment> findBySchedule_ScheduleId(Long scheduleId);
    List<Appointment> findByScheduleScheduleId(Long scheduleId);
    List<Appointment> findByDoctorDoctorId(Long doctorId);
}
