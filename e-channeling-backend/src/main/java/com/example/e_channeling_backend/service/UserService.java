package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.AppointmentDto;
import com.example.e_channeling_backend.dto.PharmacyOrderDto;
import com.example.e_channeling_backend.dto.UserProfileDto;
import com.example.e_channeling_backend.model.*;
import com.example.e_channeling_backend.model.enums.AppointmentStatus;
import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import com.example.e_channeling_backend.model.enums.QueueStatus;
import com.example.e_channeling_backend.repo.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@Service
public class UserService {
    private final PrescriptionRepo prescriptionRepo;
    private final PharmacyOrderRepo pharmacyOrderRepo;
    private UserProfileRepo userProfileRepo;
    private DoctorRepository doctorRepo;
    private DoctorScheduleRepo scheduleRepo;
    private AppointmentRepo appointmentRepo;
    private QueueEntryRepo queueRepo;
    private EmailService emailService;

    @Autowired
    public UserService(UserProfileRepo userProfileRepo,
                       DoctorRepository doctorRepo,
                       DoctorScheduleRepo scheduleRepo,
                       AppointmentRepo appointmentRepo,
                       QueueEntryRepo queueRepo,
                       EmailService emailService, PrescriptionRepo prescriptionRepo, PharmacyOrderRepo pharmacyOrderRepo) {
        this.userProfileRepo = userProfileRepo;
        this.doctorRepo = doctorRepo;
        this.scheduleRepo = scheduleRepo;
        this.appointmentRepo = appointmentRepo;
        this.queueRepo = queueRepo;
        this.emailService = emailService;
        this.prescriptionRepo = prescriptionRepo;
        this.pharmacyOrderRepo = pharmacyOrderRepo;
    }

//    create an appointment
    @Transactional
    public Appointment createAppointment(Long patientId, Long doctorId, Long scheduleId) {
        UserProfile patient = userProfileRepo.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        System.out.println(doctor.getUserProfile());

        DoctorSchedule schedule = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        LocalDateTime now = LocalDateTime.now();
        if (schedule.getDate().atTime(schedule.getStartTime()).isBefore(now)) {
            throw new RuntimeException("Schedule is expired or in the past");
        }

        if (appointmentRepo.existsByPatientAndSchedule(patient, schedule)) {
            throw new RuntimeException("Patient already booked this schedule");
        }

        if (!schedule.isAvailable()) {
            throw new RuntimeException("Schedule is not available");
        }

        int currentCount = queueRepo.countBySchedule(schedule);
        if (currentCount >= schedule.getCapacity()) {
            schedule.setAvailable(false); // mark as unavailable
            scheduleRepo.save(schedule); // persist update
            throw new RuntimeException("Schedule capacity reached");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setSchedule(schedule);
        appointment.setAppointmentStatus(AppointmentStatus.BOOKED);
        Appointment savedAppointment = appointmentRepo.save(appointment);

        QueueEntry queueEntry = new QueueEntry();
        queueEntry.setAppointment(savedAppointment);
        queueEntry.setSchedule(schedule);
        queueEntry.setStatus(QueueStatus.QUEUED);
        queueEntry.setQueueNumber(currentCount + 1);
        queueRepo.save(queueEntry);

        savedAppointment.setQueueEntry(queueEntry);

        // If this booking fills the schedule, mark as unavailable
        if (currentCount + 1 >= schedule.getCapacity()) {
            schedule.setAvailable(false);
            scheduleRepo.save(schedule);
        }

        Appointment newAppointment = appointmentRepo.save(savedAppointment);

        // Calculate time slot for this patient
        LocalTime baseStartTime = schedule.getStartTime();
        LocalTime baseEndTime = schedule.getEndTime();
        int capacity = schedule.getCapacity();

        Duration totalDuration = Duration.between(baseStartTime, baseEndTime);
        long minutesPerSlot = totalDuration.toMinutes() / capacity;

// Calculate slot time for the current patient
        LocalTime assignedTimeSlot = baseStartTime.plusMinutes(currentCount * minutesPerSlot);


        UserProfile user = newAppointment.getPatient();
        String userEmail = user.getProfileEmail();
        String subject = "Appointment Confirmation";
        String message = "Dear " + patient.getProfileName() + ",\n\n" +
                "Your appointment with Dr. " + savedAppointment.getDoctor().getUserProfile().getProfileName() +
                " has been successfully created.\n" +
                "Your Queue Number : " + savedAppointment.getQueueEntry().getQueueNumber() + "\n" +
                "Appointment Date: " + savedAppointment.getSchedule().getDate() + "\n" +
                "Appointment Time: " + assignedTimeSlot + "\n\n" +
                "Your payment can be done at the hospital at the time of your appointment.\n\n" +
                "Best regards,\nE-Channeling Team";


        emailService.sendEmail(userEmail, subject, message);
        return savedAppointment;
    }

    public Appointment getSpecificAppointment(Long appointmentId) {
        Optional<Appointment> existAppointment = appointmentRepo.findById(appointmentId);

        if(existAppointment.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        return existAppointment.get();
    }

//    all doctors
    public List<Doctor> getAllDoctors() {
        List<Doctor> doctors = doctorRepo.findAll();
        if(doctors.isEmpty()) {
            return null;
        }
        return doctors;
    }

    public List<AppointmentDto> getAllAppointments(Long profileId) {
        // Validate profile exists
        UserProfile user = userProfileRepo.findById(profileId)
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + profileId));

        // Get appointments and convert to DTOs
        return appointmentRepo.findByPatient_ProfileId(profileId)
                .stream()
                .map(this::convertToDto)  // Using the same conversion method from previous example
                .collect(Collectors.toList());
    }

//    get one appointment
    public AppointmentDto getAppointment(Long appointmentId) {
        Optional<Appointment> existAppointment = appointmentRepo.findById(appointmentId);
        if(existAppointment.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }
        return convertToDto(existAppointment.get());
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

//    get user profile
    public UserProfileDto getUserProfile(Long profileId){
        Optional<UserProfile> user = userProfileRepo.findById(profileId);
        if(user.isEmpty()){
            throw new RuntimeException("User profile not found with ID: " + profileId);
        }
        UserProfile userProfile = user.get();
        return new UserProfileDto(
                userProfile.getProfileId(),
                userProfile.getProfileName(),
                userProfile.getProfileEmail(),
                userProfile.getPhone(),
                userProfile.getAddress(),
                userProfile.getRole(),
                userProfile.getImage()
        );
    }

//create pharmacy order
@Transactional
public PharmacyOrder createPharmacyOrder(Long profileId, PharmacyOrder pharmacyOrder, MultipartFile image) throws IOException {
    // Validate user exists
    UserProfile userProfile = userProfileRepo.findById(profileId)
            .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + profileId));

    // Validate image
    if (image == null || image.isEmpty()) {
        throw new RuntimeException("Prescription image is required");
    }

    // Create prescription
    Prescription prescription = new Prescription();
    prescription.setPrescriptionTitle(pharmacyOrder.getPrescription().getPrescriptionTitle());
    prescription.setPrescriptionImage(image.getBytes());

    // Create order
    PharmacyOrder order = new PharmacyOrder();
    order.setPrescription(prescription);
    order.setPatient(userProfile);
    order.setStatus(DeliveryStatus.PENDING);

    // Establish bidirectional relationship
    prescription.setOrder(order);

    // Save entities
    prescription = prescriptionRepo.save(prescription);
    order = pharmacyOrderRepo.save(order);

    // Add to user's orders (if needed)
    userProfile.getOrders().add(order);

    return order; // Return the saved entity instead of input parameter
}

//get all orders by patient
    public List<PharmacyOrderDto> getPharmacyOrderAll(Long profileId){
        Optional<UserProfile> user = userProfileRepo.findById(profileId);
        if(user.isEmpty()){
            throw new RuntimeException("User profile not found with ID: " + profileId);
        }
        UserProfile userProfile = user.get();
        return pharmacyOrderRepo.findByPatient_ProfileId(profileId).stream().map(
                order -> new PharmacyOrderDto(
                        order.getId(),
                        order.getPrescription().getPrescriptionId(),
                        order.getPatient().getProfileId(),
                        order.getPatient().getProfileName(),
                        order.getPrescription().getPrescriptionTitle(),
                        order.getStatus(),
                        order.getPrescription().getPrescriptionImage()
                )
        ).toList();
    }

//    get prescription image
    public byte[] getPrescriptionImage(Long prescriptionId) {
        Optional<Prescription> prescription = prescriptionRepo.findById(prescriptionId);
        if(prescription.isEmpty()){
            throw new RuntimeException("Prescription not found with ID: " + prescriptionId);
        }
        return prescription.get().getPrescriptionImage();
    }
}
