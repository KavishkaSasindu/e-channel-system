package com.example.e_channeling_backend.service;

import com.example.e_channeling_backend.dto.PharmacyOrderDto;
import com.example.e_channeling_backend.model.*;
import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import com.example.e_channeling_backend.model.enums.Role;
import com.example.e_channeling_backend.repo.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Service
public class StaffService {
    private final StaffRepo staffRepo;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepo doctorScheduleRepo;
    private final SpecializationRepo specializationRepo;
    private final PharmacyOrderRepo pharmacyOrderRepo;
    private UserProfileRepo userProfileRepo;
    private BCryptPasswordEncoder bcryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private EmailService emailService;

    @Autowired
    public StaffService (UserProfileRepo userProfileRepo,
                         StaffRepo staffRepo,
                         DoctorRepository doctorRepository,
                         SpecializationRepo specializationRepo,
                         DoctorScheduleRepo doctorScheduleRepo,
                         PharmacyOrderRepo pharmacyOrderRepo,EmailService emailService) {
        this.userProfileRepo = userProfileRepo;
        this.staffRepo = staffRepo;
        this.doctorRepository = doctorRepository;
        this.specializationRepo = specializationRepo;
        this.doctorScheduleRepo = doctorScheduleRepo;
        this.pharmacyOrderRepo = pharmacyOrderRepo;
        this.emailService = emailService;
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
}
