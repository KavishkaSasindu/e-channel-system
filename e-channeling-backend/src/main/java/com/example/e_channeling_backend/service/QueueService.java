package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.*;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.QueueEntry;
import com.example.e_channeling_backend.model.enums.QueueStatus;
import com.example.e_channeling_backend.repo.QueueEntryRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Service
public class QueueService {
    private final QueueEntryRepository queueEntryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    public QueueService(QueueEntryRepository queueEntryRepository, SimpMessagingTemplate messagingTemplate, DoctorScheduleService doctorScheduleService) {
        this.queueEntryRepository = queueEntryRepository;
        this.messagingTemplate = messagingTemplate;
        this.doctorScheduleService = doctorScheduleService;
    }

    public QueueEntry markCurrentAsCompletedAndNotify(DoctorSchedule schedule) {
        QueueEntry current = queueEntryRepository.findFirstByScheduleAndStatusOrderByQueueNumberAsc(schedule, QueueStatus.QUEUED)
                .orElseThrow(() -> new RuntimeException("No patients in queue"));

        current.setStatus(QueueStatus.DONE);
        queueEntryRepository.save(current);

        // Find the next one
        List<QueueEntry> queuedList = queueEntryRepository.findByScheduleAndStatusOrderByQueueNumberAsc(schedule, QueueStatus.QUEUED);
        int nextQueue = queuedList.isEmpty() ? -1 : queuedList.get(0).getQueueNumber();

        // Determine new current queue number
        int newCurrentQueue = queuedList.isEmpty() ? -1 : queuedList.get(0).getQueueNumber();


        QueueUpdatePayload payload = new QueueUpdatePayload(
                schedule.getDoctor().getDoctorId(),
                newCurrentQueue,
                (nextQueue != -1) ? "Next patient please" : "Queue is empty"
        );

        messagingTemplate.convertAndSend("/topic/queue-updates/" + schedule.getDoctor().getDoctorId(), payload);
        return current;
    }

    public List<QueueEntryResponseDTO> getQueueEntriesByScheduleAndStatus(Long scheduleId, QueueStatus status) {
        List<QueueEntry> entries = queueEntryRepository.findByScheduleAndStatusOrderByQueueNumberAsc(
                doctorScheduleService.getScheduleById(scheduleId),
                status
        );

        return entries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private QueueEntryResponseDTO convertToDto(QueueEntry entry) {
        QueueEntryResponseDTO dto = new QueueEntryResponseDTO();
        dto.setQueueId(entry.getQueueId());
        dto.setStatus(entry.getStatus());
        dto.setQueueNumber(entry.getQueueNumber());

        // Convert Appointment
        AppointmentResponseDTO appointmentDto = new AppointmentResponseDTO();
        appointmentDto.setAppointmentId(entry.getAppointment().getAppointmentId());

        // Convert Patient
        PatientInfoDTO patientDto = new PatientInfoDTO();
        patientDto.setProfileName(entry.getAppointment().getPatient().getProfileName());
        patientDto.setProfileEmail(entry.getAppointment().getPatient().getProfileEmail());
        appointmentDto.setPatient(patientDto);

        dto.setAppointment(appointmentDto);

        // Convert Schedule
        ScheduleResponseDTO scheduleDto = new ScheduleResponseDTO();
        scheduleDto.setScheduleId(entry.getSchedule().getScheduleId());
        scheduleDto.setDoctorId(entry.getSchedule().getDoctor().getDoctorId());
        scheduleDto.setDate(entry.getSchedule().getDate());
        scheduleDto.setStartTime(entry.getSchedule().getStartTime());

        dto.setSchedule(scheduleDto);

        return dto;
    }

    public QueueEntry getQueueEntryByAppointmentId(Long appointmentId) {
        return queueEntryRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found for appointment"));
    }

}
