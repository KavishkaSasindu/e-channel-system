package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueEntryRepo extends JpaRepository<QueueEntry,Long> {
    int countBySchedule(DoctorSchedule schedule);
}
