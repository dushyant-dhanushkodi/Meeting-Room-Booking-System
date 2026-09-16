package com.meetingbooking.repository;

import com.meetingbooking.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

   Optional<Equipment> findByName(String name);
}

