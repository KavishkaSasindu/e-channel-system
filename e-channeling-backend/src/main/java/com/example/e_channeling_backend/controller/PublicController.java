package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.dto.DoctorProfileDto;
import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.service.PublicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/public")
@RestController
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

//    get doctor profile
    @GetMapping("/get-doctor-profile/{doctorId}")
    public ResponseEntity<?> getDoctorProfile(@PathVariable Long doctorId) {
        try{
            Doctor doctor = publicService.getDoctorProfile(doctorId);
            if(doctor == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Doctor not found");
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(doctor);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get all doctors
    @GetMapping("/all-doctors")
    public ResponseEntity<?> getAllDoctorProfiles() {
        try{
            List<DoctorProfileDto> allDoctors = publicService.getAllDoctors();
            if(allDoctors.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body("No doctors found");
            }
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(allDoctors);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
