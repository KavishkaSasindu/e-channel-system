package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.dto.*;
import com.example.e_channeling_backend.model.Appointment;
import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.PharmacyOrder;
import com.example.e_channeling_backend.service.UserService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@RestController
@RequestMapping("/patient")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

//    create an appointment
    @PostMapping("/appointment/{profileId}/{doctorId}/{scheduleId}")
    public ResponseEntity<?> createAppointment(@PathVariable Long profileId,@PathVariable Long doctorId,@PathVariable Long scheduleId) {
        try{
            Appointment appointment = userService.createAppointment(profileId, doctorId, scheduleId);
            if(appointment != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(appointment);
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating appointment");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get specific appointment
    @GetMapping("/appointment/{appointmentId}/queue")
    public ResponseEntity<?> getAppointmentQueue(@PathVariable Long appointmentId) {
        try{
            Appointment appointment = userService.getSpecificAppointment(appointmentId);
            if(appointment != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(new AppointmentQueueDto(appointment));
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting appointment");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get all doctors
    @GetMapping("/all-doctor")
    public ResponseEntity<?> getAllDoctors() {
        try{
            List<Doctor> allDoctors = userService.getAllDoctors();
            if(allDoctors != null) {
                List<DoctorProfileDto> doctorDto = allDoctors.stream()
                        .map(DoctorProfileDto::new)
                        .toList();
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(doctorDto);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting all doctors");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get all appointments
    @GetMapping("/my-appointments/{profileId}")
    public ResponseEntity<?> getAllAppointments(@PathVariable Long profileId) {
        try{
            List<AppointmentDto> returnValue = userService.getAllAppointments(profileId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting appointments");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get one appointment
    @GetMapping("/one-appointment/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long appointmentId) {
        try{
            AppointmentDto appointment = userService.getAppointment(appointmentId);
            if(appointment != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(appointment);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting appointment");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get user profile
    @GetMapping("/profile/{profileId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long profileId) {
        try{
            UserProfileDto returnValue = userService.getUserProfile(profileId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting user profile");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    create a pharmacy order
    @PostMapping("/order/{profileId}")
    public ResponseEntity<?> createOrder(@PathVariable Long profileId, @RequestPart MultipartFile file, @RequestPart PharmacyOrder pharmacyOrder) {
        try{
            PharmacyOrder order = userService.createPharmacyOrder(profileId,pharmacyOrder,file);
            if(order != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(new PharmacyOrderDto(
                                order.getId(),
                                order.getPrescription().getPrescriptionId(),
                                order.getPatient().getProfileId(),
                                order.getPatient().getProfileName(),
                                order.getPrescription().getPrescriptionTitle(),
                                order.getStatus(),
                                order.getPrescription().getPrescriptionImage()

                        ));
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating order");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get all order by id
    @GetMapping("/all-orders/{profileId}")
    public ResponseEntity<?> getAllOrder(@PathVariable Long profileId){
        try{
            List<PharmacyOrderDto> returnValue = userService.getPharmacyOrderAll(profileId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting all orders");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get prescription image by id
    @GetMapping("/order/prescription-image/{prescriptionId}")
    public ResponseEntity<?> getPrescriptionImage(@PathVariable Long prescriptionId) {
        try{
            byte[] returnValue = userService.getPrescriptionImage(prescriptionId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error getting prescription image");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
