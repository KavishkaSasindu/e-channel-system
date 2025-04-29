package com.example.e_channeling_backend.repo;

import com.example.e_channeling_backend.model.PharmacyOrder;
import com.example.e_channeling_backend.model.enums.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PharmacyOrderRepo extends JpaRepository<PharmacyOrder, Long> {
    List<PharmacyOrder> findByPatient_ProfileId(Long profileId);
    List<PharmacyOrder> findByStatus(DeliveryStatus status);
    List<PharmacyOrder> findByPrescriptionPrescriptionId(Long prescriptionId);
}
