package com.example.e_channeling_backend.controller;

import com.example.e_channeling_backend.dto.PharmacyOrderDto;
import com.example.e_channeling_backend.model.Doctor;
import com.example.e_channeling_backend.model.PharmacyOrder;
import com.example.e_channeling_backend.model.Staff;
import com.example.e_channeling_backend.model.UserProfile;
import com.example.e_channeling_backend.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public ResponseEntity<?> createDoctor(@RequestPart Doctor doctor,@RequestPart(required = false) MultipartFile profileImage) {
        try{
            Doctor returnValue = staffService.createDoctor(doctor,profileImage);
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

//    get Pending order
    @GetMapping("/orders/pending")
    public ResponseEntity<?> pendingOrder() {
        try{
            List<PharmacyOrderDto> returnValue = staffService.getPendingOrders();
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("No pending orders");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    //    get Pending order
    @GetMapping("/orders/rejected")
    public ResponseEntity<?> rejectedOrder() {
        try{
            List<PharmacyOrderDto> returnValue = staffService.getRejectedOrders();
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("No rejected orders");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    //    get Pending order
    @GetMapping("/orders/delivered")
    public ResponseEntity<?> deliveredOrder() {
        try{
            List<PharmacyOrderDto> returnValue = staffService.getDeliveredOrders();
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("No delivered orders");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    make order approved
    @PostMapping("/order/approved/{orderId}")
    public ResponseEntity<?> orderAccepted(@PathVariable Long orderId) {
        try{
            PharmacyOrderDto returnValue = staffService.approveOrder(orderId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("No order accepted");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    //    make order approved
    @PostMapping("/order/reject/{orderId}")
    public ResponseEntity<?> rejectOrder(@PathVariable Long orderId) {
        try{
            PharmacyOrderDto returnValue = staffService.rejectedOrder(orderId);
            if(returnValue != null) {
                return ResponseEntity
                        .status(HttpStatus.OK)
                        .body(returnValue);
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("No order rejected");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

//    get pharmacy order by id
@GetMapping("/order/{orderId}")
public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
    try{
        PharmacyOrderDto returnValue = staffService.getOrderById(orderId);
        if(returnValue != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(returnValue);
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("No order rejected");
    } catch (Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
    }
}

//test doctor profile
    @GetMapping("/test-get-doctor/{doctorId}")
    public ResponseEntity<?> getDoctorTest(@PathVariable Long doctorId) {
        Doctor doctor = staffService.testDoctorProfile(doctorId);
        return ResponseEntity.status(HttpStatus.OK).body(doctor);
    }

//    delete doctor
@DeleteMapping("/delete/doctor/{doctorId}")
public ResponseEntity<Void> deleteDoctor(@PathVariable Long doctorId) {
    try {
        staffService.deleteDoctorAndRelatedEntities(doctorId);
        return ResponseEntity.status(HttpStatus.OK).build();

    } catch (EntityNotFoundException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}

    @PutMapping("/update-doctor/{doctorId}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long doctorId ,@RequestPart Doctor doctor,@RequestPart(required = false) MultipartFile profileImage) {
        try{
            Doctor returnValue = staffService.updateDoctor(doctorId,doctor,profileImage);
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
