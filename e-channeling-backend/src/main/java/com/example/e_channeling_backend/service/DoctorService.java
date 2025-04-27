package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.model.Appointment;
import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.DoctorSchedule;
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

import java.util.List;

@Data
@Service
public class DoctorService {

    private final DoctorScheduleRepo doctorScheduleRepo;
    private final AppointmentRepo appointmentRepo;
    private DoctorRepository doctorRepo;
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    public DoctorService(DoctorRepository doctorRepo, DoctorScheduleRepo doctorScheduleRepo,
                         AppointmentRepo appointmentRepo, DoctorScheduleService doctorScheduleService) {
        this.doctorRepo = doctorRepo;
        this.doctorScheduleRepo = doctorScheduleRepo;
        this.appointmentRepo = appointmentRepo;
        this.doctorScheduleService = doctorScheduleService;
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


}
