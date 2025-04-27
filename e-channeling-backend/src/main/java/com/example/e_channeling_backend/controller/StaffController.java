package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.Staff;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.service.StaffService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Data
@RestController
@RequestMapping("/staff")
public class StaffController {

    private  StaffService staffService;


    @Autowired
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

//    test staff
    @GetMapping("/test-staff")
    public ResponseEntity<?> testStaff() {
        return ResponseEntity.status(HttpStatus.OK).body("Hello");
    }

//    create a userProfile
    @PostMapping("/create-profile")
    public ResponseEntity<?> createUserProfile(@RequestBody UserProfile userProfile) {
        try{
            UserProfile returnValue = staffService.createUserProfile(userProfile);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(returnValue);
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("UserProfile could not be created");
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    create a staff member
    @PostMapping("/create-staff")
    public ResponseEntity<?> createStaffMember(@RequestBody Staff staff) {
        try{
            Staff returnValue = staffService.createStaffMember(staff);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Staff could not be created");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    create a doctor
    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        try{
            Doctor returnValue = staffService.createDoctor(doctor);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Doctor could not be created");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

}
