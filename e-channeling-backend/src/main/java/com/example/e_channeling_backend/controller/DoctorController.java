package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.dto.QueueEntryResponseDTO;
import com.example.e_channeling_backend.model.Appointment;
import com.example.e_channeling_backend.model.DoctorSchedule;
import com.example.e_channeling_backend.model.QueueEntry;
import com.example.e_channeling_backend.model.enums.QueueStatus;
import com.example.e_channeling_backend.repo.DoctorScheduleRepo;
import com.example.e_channeling_backend.service.DoctorScheduleService;
import com.example.e_channeling_backend.service.DoctorService;
import com.example.e_channeling_backend.service.QueueService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("/doctor")
public class DoctorController {
    private DoctorService doctorService;
    private final QueueService queueService;
    private final DoctorScheduleRepo doctorScheduleRepository;
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    public DoctorController(DoctorService doctorService, QueueService queueService, DoctorScheduleRepo doctorScheduleRepository, DoctorScheduleService doctorScheduleService) {
        this.doctorService = doctorService;
        this.queueService = queueService;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.doctorScheduleService = doctorScheduleService;
    }

//    get all appointments
    @GetMapping("/all-appointments/{doctorId}/{scheduleId}")
    public ResponseEntity<?> getAllAppointments(@PathVariable Long doctorId, @PathVariable Long scheduleId) {
        try{
            List<Appointment> returnValue = doctorService.getAppointmentsByDoctor(doctorId, scheduleId);
            if(returnValue.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NO_CONTENT)
                        .body("No appointments found");
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(returnValue);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/complete/{scheduleId}/{doctorId}")
    public ResponseEntity<?> completeCurrent(@PathVariable Long scheduleId,@PathVariable Long doctorId) {
        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getDoctor().getDoctorId().equals(doctorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("This schedule does not belong to the doctor");
        }

        QueueEntry completed =  queueService.markCurrentAsCompletedAndNotify(schedule);
        return ResponseEntity.ok(completed);
    }

    // get schedule by doctor id
    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<?> getDoctorSchedules(
            @PathVariable Long doctorId) {
        try{
            List<DoctorSchedule> schedules = doctorScheduleService.getSchedulesByDoctorId(doctorId);
            if(schedules.isEmpty()){
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Error: Doctor Schedule Not Found");
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(schedules);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/queue")
    public ResponseEntity<?> getQueueByScheduleAndStatus(
            @RequestParam Long scheduleId,
            @RequestParam QueueStatus status) {
        try {
            List<QueueEntryResponseDTO> entries = queueService.getQueueEntriesByScheduleAndStatus(scheduleId, status);
            return ResponseEntity.ok(entries);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/appointments/{appointmentId}/queue")
    public ResponseEntity<?> getPatientQueue(
            @PathVariable Long appointmentId) {
        try {
            QueueEntry entry = queueService.getQueueEntryByAppointmentId(appointmentId);
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
