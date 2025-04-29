package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.AppointmentDto;
import com.example.e_channeling_backend.model.*;
import com.example.e_channeling_backend.repo.AppointmentRepo;
import com.example.e_channeling_backend.repo.DoctorRepository;
import com.example.e_channeling_backend.repo.DoctorScheduleRepo;
import lombok.Data;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@Data
@Service
public class DoctorService {

    private final DoctorScheduleRepo doctorScheduleRepo;
    private final AppointmentRepo appointmentRepo;
    private final UserService userService;
    private DoctorRepository doctorRepo;
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    public DoctorService(DoctorRepository doctorRepo, DoctorScheduleRepo doctorScheduleRepo,
                         AppointmentRepo appointmentRepo, DoctorScheduleService doctorScheduleService, UserService userService) {
        this.doctorRepo = doctorRepo;
        this.doctorScheduleRepo = doctorScheduleRepo;
        this.appointmentRepo = appointmentRepo;
        this.doctorScheduleService = doctorScheduleService;
        this.userService = userService;
    }

//    check doctor exist
    public Doctor checkDoctorExists(Long doctorId) {
        return doctorRepo.findById(doctorId).orElse(null);
    }

//    check schedule is exist
    public DoctorSchedule checkScheduleExists(Long scheduleId) {
        return doctorScheduleRepo.findById(scheduleId).orElse(null);
    }

//    get appointment by schedule and doctor
    public List<Appointment> getAppointmentsByDoctor(Long doctorId,Long scheduleId) {
        Doctor doctor = checkDoctorExists(doctorId);
        if(doctor == null) return null;
        DoctorSchedule schedule = checkScheduleExists(scheduleId);
        if(schedule == null) return null;
        return appointmentRepo.findByDoctor_DoctorIdAndSchedule_ScheduleId(doctorId, scheduleId);
    }

//    get schedules by doctorId
    public List<DoctorSchedule> getAllSchedulesByDoctorId(Long doctorId) {
        Doctor doctor = checkDoctorExists(doctorId);
        if(doctor == null) return null;
        return doctorScheduleRepo.findByDoctor_DoctorId(doctorId);
    }

//    get appointments by scheduleId
    public List<AppointmentDto> getAllAppointmentsByDoctorId(Long doctorId,Long scheduleId) {
        Doctor doctor = checkDoctorExists(doctorId);
        if(doctor == null) return null;
        List<Appointment> appointments = appointmentRepo.findBySchedule_ScheduleId(scheduleId);

        if(appointments == null) return null;
        return appointments.stream().map(this::convertToDto).toList();
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setAppointmentId(appointment.getAppointmentId());
        dto.setAppointmentStatus(appointment.getAppointmentStatus());

        // Convert patient
        dto.setPatient(convertPatientToDto(appointment.getPatient()));

        // Convert doctor
        dto.setDoctor(convertDoctorToDto(appointment.getDoctor()));

        // Convert schedule
        dto.setSchedule(convertScheduleToDto(appointment.getSchedule()));

        // Convert queue entry
        if(appointment.getQueueEntry() != null) {
            dto.setQueue(convertQueueToDto(appointment.getQueueEntry()));
        }

        return dto;
    }

    // Helper conversion methods
    private AppointmentDto.PatientInfo convertPatientToDto(UserProfile patient) {
        AppointmentDto.PatientInfo patientDto = new AppointmentDto.PatientInfo();
        patientDto.setProfileId(patient.getProfileId());
        patientDto.setProfileName(patient.getProfileName());
        patientDto.setProfileEmail(patient.getProfileEmail());
        patientDto.setPhone(patient.getPhone());
        return patientDto;
    }

    private AppointmentDto.DoctorInfo convertDoctorToDto(Doctor doctor) {
        AppointmentDto.DoctorInfo doctorDto = new AppointmentDto.DoctorInfo();
        doctorDto.setDoctorId(doctor.getDoctorId());
        doctorDto.setDoctorName(doctor.getUserProfile().getProfileName());
        doctorDto.setSpecialization(doctor.getSpecialization().getSpecializationName());
        doctorDto.setConsultationFee(doctor.getConsultationFee());
        return doctorDto;
    }

    private AppointmentDto.ScheduleInfo convertScheduleToDto(DoctorSchedule schedule) {
        AppointmentDto.ScheduleInfo scheduleDto = new AppointmentDto.ScheduleInfo();
        scheduleDto.setScheduleId(schedule.getScheduleId());
        scheduleDto.setDate(schedule.getDate());
        scheduleDto.setStartTime(schedule.getStartTime());
        scheduleDto.setEndTime(schedule.getEndTime());
        return scheduleDto;
    }

    private AppointmentDto.QueueInfo convertQueueToDto(QueueEntry queueEntry) {
        AppointmentDto.QueueInfo queueDto = new AppointmentDto.QueueInfo();
        queueDto.setQueueNumber(queueEntry.getQueueNumber());
        queueDto.setStatus(queueEntry.getStatus());
        return queueDto;
    }

}
