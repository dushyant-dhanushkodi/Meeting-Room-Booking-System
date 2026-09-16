package com.meetingbooking.repository;

import com.meetingbooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

   @Query("SELECT DISTINCT r FROM Room r " +
           "LEFT JOIN r.equipments e " +
           "WHERE (:capacity IS NULL OR r.capacity >= :capacity) " +
           "AND (:building IS NULL OR r.building = :building) " +
           "AND (:floor IS NULL OR r.floor = :floor) " +
           "AND (:equipmentNames IS NULL OR e.name IN :equipmentNames)")
   List<Room> searchRooms(@Param("capacity") Integer capacity,
                          @Param("building") String building,
                          @Param("floor") String floor,
                          @Param("equipmentNames") List<String> equipmentNames);
}

