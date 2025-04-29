package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.PharmacyOrderDto;
import com.example.e_channeling_backend.model.*;
import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import com.example.e_channeling_backend.model.enums.Role;
import com.example.e_channeling_backend.repo.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Data
@Service
public class StaffService {
    private final StaffRepo staffRepo;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepo doctorScheduleRepo;
    private final SpecializationRepo specializationRepo;
    private final PharmacyOrderRepo pharmacyOrderRepo;
    private final AppointmentRepo appointmentRepo;
    private final QueueEntryRepository queueEntryRepository;
    private final PrescriptionRepo prescriptionRepo;
    private UserProfileRepo userProfileRepo;
    private BCryptPasswordEncoder bcryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private EmailService emailService;

    @Autowired
    public StaffService (UserProfileRepo userProfileRepo,
                         StaffRepo staffRepo,
                         DoctorRepository doctorRepository,
                         SpecializationRepo specializationRepo,
                         DoctorScheduleRepo doctorScheduleRepo,
                         PharmacyOrderRepo pharmacyOrderRepo, EmailService emailService, AppointmentRepo appointmentRepo, QueueEntryRepository queueEntryRepository, PrescriptionRepo prescriptionRepo) {
        this.userProfileRepo = userProfileRepo;
        this.staffRepo = staffRepo;
        this.doctorRepository = doctorRepository;
        this.specializationRepo = specializationRepo;
        this.doctorScheduleRepo = doctorScheduleRepo;
        this.pharmacyOrderRepo = pharmacyOrderRepo;
        this.emailService = emailService;
        this.appointmentRepo = appointmentRepo;
        this.queueEntryRepository = queueEntryRepository;
        this.prescriptionRepo = prescriptionRepo;
    }

    public UserProfile checkUserIsExist(String profileEmail) {
        Optional<UserProfile> existUser = userProfileRepo.findByProfileEmail(profileEmail);
        return existUser.orElse(null);
    }

//    create a user
    public UserProfile createUserProfile(UserProfile userProfile) {
        UserProfile existUser = checkUserIsExist(userProfile.getProfileEmail());
        if (existUser != null) {
            throw new RuntimeException("User profile already exists");
        }
        userProfile.setRole(Role.PATIENT);
        return userProfileRepo.save(userProfile);
    }

//    create staff member
    @Transactional
    public Staff createStaffMember(Staff staff) {
        UserProfile existUser = checkUserIsExist(staff.getUserProfile().getProfileEmail());
        if(existUser != null) {
            throw new RuntimeException("User profile already exists");
        }
        UserProfile newUserProfile = new UserProfile();
        UserProfile requestUserProfile = staff.getUserProfile();
        newUserProfile.setProfileName(requestUserProfile.getProfileName());
        newUserProfile.setProfileEmail(requestUserProfile.getProfileEmail());
        newUserProfile.setPassword(new BCryptPasswordEncoder().encode(requestUserProfile.getPassword()));
        newUserProfile.setPhone(requestUserProfile.getPhone());
        newUserProfile.setAddress(requestUserProfile.getAddress());
        newUserProfile.setRole(Role.STAFF);

        Staff newStaff = new Staff();
        newStaff.setUserProfile(newUserProfile);
        newUserProfile.setStaff(newStaff);

        UserProfile saveProfile = userProfileRepo.save(newUserProfile);
        staff.setUserProfile(saveProfile);
        return staffRepo.save(staff);
    }

    @Transactional
    public Doctor createDoctor(Doctor doctor, MultipartFile image) throws IOException {
        UserProfile existUser = checkUserIsExist(doctor.getUserProfile().getProfileEmail());
        if (existUser != null) {
            throw new RuntimeException("User profile already exists");
        }

        // Extract info and create a new user profile
        UserProfile requestUserProfile = doctor.getUserProfile();
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setProfileName(requestUserProfile.getProfileName());
        newUserProfile.setProfileEmail(requestUserProfile.getProfileEmail());
        newUserProfile.setPassword(new BCryptPasswordEncoder().encode(requestUserProfile.getPassword()));
        newUserProfile.setPhone(requestUserProfile.getPhone());
        newUserProfile.setAddress(requestUserProfile.getAddress());
        if(image != null){
            newUserProfile.setImage(image.getBytes());
        }

        newUserProfile.setRole(Role.DOCTOR);

        // Create the doctor
        Doctor newDoctor = new Doctor();
        newDoctor.setConsultationFee(doctor.getConsultationFee());
        newDoctor.setQualification(doctor.getQualification());
        newDoctor.setSpecialization(doctor.getSpecialization());
        newDoctor.setAvailable(true);

        // Connect both sides of the relationship
        newDoctor.setUserProfile(newUserProfile);
        newUserProfile.setDoctor(newDoctor);

        userProfileRepo.save(newUserProfile);

        // Assign schedules
        List<DoctorSchedule> schedules = doctor.getSchedules();
        if (schedules != null && !schedules.isEmpty()) {
            for (DoctorSchedule schedule : schedules) {
                schedule.setDoctor(newDoctor);
            }
            newDoctor.setSchedules(schedules);
        }

        // Save the owning side — only need to save the profile, cascade will save the doctor
        return doctorRepository.save(newDoctor); // OR userProfileRepo.save(newUserProfile);
    }

//    find order by PENDING status
    public List<PharmacyOrderDto> getPendingOrders() {
        List<PharmacyOrder> pendingOrders = pharmacyOrderRepo.findByStatus(DeliveryStatus.PENDING);
        return pendingOrders.stream().map(
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

    //    find order by REJECTED status
    public List<PharmacyOrderDto> getRejectedOrders() {
        List<PharmacyOrder> pendingOrders = pharmacyOrderRepo.findByStatus(DeliveryStatus.REJECTED);
        return pendingOrders.stream().map(
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

    //    find order by DELIVERED status
    public List<PharmacyOrderDto> getDeliveredOrders() {
        List<PharmacyOrder> pendingOrders = pharmacyOrderRepo.findByStatus(DeliveryStatus.DELIVERED);
        return pendingOrders.stream().map(
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

//    make order Approved and delivered
@Transactional
public PharmacyOrderDto approveOrder(Long orderId) {
    // 1. Fetch and validate order
    PharmacyOrder order = pharmacyOrderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

    // 2. Check current status
    if (order.getStatus() != DeliveryStatus.PENDING) {
        throw new IllegalStateException("Order cannot be approved from current status: " + order.getStatus());
    }

    // 3. Get associated user
    UserProfile userProfile = userProfileRepo.findById(order.getPatient().getProfileId())
            .orElseThrow(() -> new RuntimeException("Associated user not found"));

    // 4. Update status
    order.setStatus(DeliveryStatus.DELIVERED);
    PharmacyOrder updatedOrder = pharmacyOrderRepo.save(order);

    // 5. Update user's order list in-memory (automatic through JPA relationships)
    userProfile.getOrders().replaceAll(o ->
            o.getId().equals(orderId) ? updatedOrder : o
    );

    // 6. Send notification
    emailService.sendEmail(
            userProfile.getProfileEmail(),
            "Order Approved",
            String.format("Order %d has been approved.\n\nIt will be delivered within 3 working days.\n\nYou can make the payment upon delivery.", orderId)
    );

    // 7. Return updated DTO
    return mapToDto(updatedOrder);
}

    //    make order Approved and delivered
    @Transactional
    public PharmacyOrderDto rejectedOrder(Long orderId) {
        // 1. Fetch and validate order
        PharmacyOrder order = pharmacyOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // 2. Check current status
        if (order.getStatus() != DeliveryStatus.PENDING) {
            throw new IllegalStateException("Order cannot be approved from current status: " + order.getStatus());
        }

        // 3. Get associated user
        UserProfile userProfile = userProfileRepo.findById(order.getPatient().getProfileId())
                .orElseThrow(() -> new RuntimeException("Associated user not found"));

        // 4. Update status
        order.setStatus(DeliveryStatus.REJECTED);
        PharmacyOrder updatedOrder = pharmacyOrderRepo.save(order);

        // 5. Update user's order list in-memory (automatic through JPA relationships)
        userProfile.getOrders().replaceAll(o ->
                o.getId().equals(orderId) ? updatedOrder : o
        );
        String message = "Order " + orderId + " has been rejected." +
                "\n\nUnfortunately, we are unable to process your prescription at this time." +
                "\n\nPlease contact our support team for further assistance.";

        // 6. Send notification
        emailService.sendEmail(
                userProfile.getProfileEmail(),
                "Order Rejected",
                message);


        // 7. Return updated DTO
        return mapToDto(updatedOrder);
    }

    private PharmacyOrderDto mapToDto(PharmacyOrder order) {
        return new PharmacyOrderDto(
                order.getId(),
                order.getPrescription().getPrescriptionId(),
                order.getPatient().getProfileId(),
                order.getPatient().getProfileName(),
                order.getPrescription().getPrescriptionTitle(),
                order.getStatus(),
                order.getPrescription().getPrescriptionImage()
        );
    }

//    fetch pending order by order id
    public PharmacyOrderDto getOrderById(Long orderId) {
        Optional<PharmacyOrder> orders = pharmacyOrderRepo.findById(orderId);
        return mapToDto(orders.get());
    }

//test doctor profile
    public Doctor testDoctorProfile(Long doctorId) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        return doctor.orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
    }


    @Transactional
    public void deleteDoctorAndRelatedEntities(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with id: " + doctorId));

        // Delete all schedules and related appointments, queue entries, and prescriptions
        List<DoctorSchedule> schedules = doctorScheduleRepo.findByDoctorDoctorId(doctorId);
        deleteSchedulesAndRelatedEntities(schedules);

        // Delete any remaining appointments directly linked to the doctor
        List<Appointment> doctorAppointments = appointmentRepo.findByDoctorDoctorId(doctorId);
        deleteAppointmentsAndRelatedEntities(doctorAppointments);

        List<UserProfile> allUsers = userProfileRepo.findAll();


        for (UserProfile user : allUsers) {
            try {
                emailService.sendEmail(
                        user.getProfileEmail(),
                        "Doctor Removed from System",
                        "Dear " + user.getProfileName() + ",\n\n"
                                + "We would like to inform you that Dr. " + doctor.getUserProfile().getProfileName() + " is no longer available in our system.\n"
                                + "All schedules and appointments under this doctor have been cancelled.\n\n"
                                + "If you were planning to visit or had booked with this doctor, please visit the platform to choose another available doctor.\n\n"
                                + "Thank you for using our service.\n"
                );
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }


        // Delete user profile and related notifications
        UserProfile userProfile = userProfileRepo.findByDoctorDoctorId(doctorId);
        if (userProfile != null) {
            deleteUserProfileAndRelatedEntities(userProfile);
        }





        // Finally, delete the doctor
        doctorRepository.delete(doctor);
    }

    private void deleteSchedulesAndRelatedEntities(List<DoctorSchedule> schedules) {
        for (DoctorSchedule schedule : schedules) {
            List<Appointment> appointments = appointmentRepo.findByScheduleScheduleId(schedule.getScheduleId());
            deleteAppointmentsAndRelatedEntities(appointments);
            doctorScheduleRepo.delete(schedule);
        }
    }

    private void deleteAppointmentsAndRelatedEntities(List<Appointment> appointments) {
        for (Appointment appointment : appointments) {
            // Delete queue entry
            QueueEntry queueEntry = queueEntryRepository.findByAppointmentAppointmentId(appointment.getAppointmentId());
            if (queueEntry != null) {
                queueEntryRepository.delete(queueEntry);
            }


            // Delete the appointment
            appointmentRepo.delete(appointment);
        }
    }

    private void deletePrescriptionsAndUpdateOrders(List<Prescription> prescriptions) {
        for (Prescription prescription : prescriptions) {
            List<PharmacyOrder> orders = pharmacyOrderRepo.findByPrescriptionPrescriptionId(prescription.getPrescriptionId());
            for (PharmacyOrder order : orders) {
                order.setPrescription(null); // Remove prescription reference
                pharmacyOrderRepo.save(order);
            }
            prescriptionRepo.delete(prescription);
        }
    }

    private void deleteUserProfileAndRelatedEntities(UserProfile userProfile) {
        // Delete notifications linked to the user profile


        // Delete the user profile
        userProfileRepo.delete(userProfile);
    }

//    update doctor
@Transactional
public Doctor updateDoctor(Long doctorId, Doctor doctorUpdate, MultipartFile image) throws IOException {
    // Find existing doctor
    Doctor existingDoctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

    // Update UserProfile information
    UserProfile existingUserProfile = existingDoctor.getUserProfile();
    UserProfile updateUserProfile = doctorUpdate.getUserProfile();

    if (updateUserProfile != null) {
        // Check if email is being changed
        if (updateUserProfile.getProfileEmail() != null &&
                !updateUserProfile.getProfileEmail().equals(existingUserProfile.getProfileEmail())) {
            Optional<UserProfile> emailCheck = userProfileRepo.findByProfileEmail(updateUserProfile.getProfileEmail());
            if (emailCheck.isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            existingUserProfile.setProfileEmail(updateUserProfile.getProfileEmail());
        }

        // Update other profile fields if provided
        if (updateUserProfile.getProfileName() != null) {
            existingUserProfile.setProfileName(updateUserProfile.getProfileName());
        }
        if (updateUserProfile.getPhone() != null) {
            existingUserProfile.setPhone(updateUserProfile.getPhone());
        }
        if (updateUserProfile.getAddress() != null) {
            existingUserProfile.setAddress(updateUserProfile.getAddress());
        }

        // Update password if provided
        if (updateUserProfile.getPassword() != null && !updateUserProfile.getPassword().isEmpty()) {
            existingUserProfile.setPassword(
                    new BCryptPasswordEncoder().encode(updateUserProfile.getPassword())
            );
        }

        // Update image if provided
        if (image != null && !image.isEmpty()) {
            existingUserProfile.setImage(image.getBytes());
        }
    }

    // Update Doctor information
    if (doctorUpdate.getConsultationFee() != null) {
        existingDoctor.setConsultationFee(doctorUpdate.getConsultationFee());
    }
    if (doctorUpdate.getQualification() != null) {
        existingDoctor.setQualification(doctorUpdate.getQualification());
    }
    if (doctorUpdate.getSpecialization() != null) {
        existingDoctor.setSpecialization(doctorUpdate.getSpecialization());
    }
    existingDoctor.setAvailable(doctorUpdate.isAvailable());

// Handle schedules
    List<DoctorSchedule> newSchedules = doctorUpdate.getSchedules();
    if (newSchedules != null) {
        // Track existing schedules by ID
        Map<Long, DoctorSchedule> existingSchedules = existingDoctor.getSchedules().stream()
                .collect(Collectors.toMap(DoctorSchedule::getScheduleId, s -> s));

        List<DoctorSchedule> mergedSchedules = new ArrayList<>();

        // Process schedules from the update request
        for (DoctorSchedule updatedSchedule : newSchedules) {
            if (updatedSchedule.getScheduleId() != null && existingSchedules.containsKey(updatedSchedule.getScheduleId())) {
                // Update existing schedule
                DoctorSchedule existing = existingSchedules.get(updatedSchedule.getScheduleId());
                existing.setDate(updatedSchedule.getDate());
                existing.setStartTime(updatedSchedule.getStartTime());
                existing.setEndTime(updatedSchedule.getEndTime());
                existing.setAvailable(updatedSchedule.isAvailable());
                existing.setCapacity(updatedSchedule.getCapacity());
                mergedSchedules.add(existing);
                existingSchedules.remove(updatedSchedule.getScheduleId()); // Mark as processed
            } else {
                // Add new schedule (no ID or unknown ID)
                updatedSchedule.setDoctor(existingDoctor); // Link to the doctor
                mergedSchedules.add(updatedSchedule);
            }
        }

        // Remove schedules not included in the update request (orphans)
        existingSchedules.values().forEach(schedule -> {
            existingDoctor.getSchedules().remove(schedule); // Orphan removal will delete these
            schedule.setDoctor(null); // Optional: Break bidirectional link
        });

        // Add updated and new schedules to the doctor
        existingDoctor.getSchedules().addAll(mergedSchedules);
    }

    // Save updates
    userProfileRepo.save(existingUserProfile);
    return doctorRepository.save(existingDoctor);
}
}
