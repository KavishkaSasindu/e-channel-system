package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.QueueEntry;
import com.example.e_channeling_backend.model.enums.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {
    List<QueueEntry> findByScheduleAndStatusOrderByQueueNumberAsc(DoctorSchedule schedule, QueueStatus status);
    Optional<QueueEntry> findFirstByScheduleAndStatusOrderByQueueNumberAsc(DoctorSchedule schedule, QueueStatus status);

    Optional<QueueEntry> findByAppointment_AppointmentId(Long appointmentId);
}
