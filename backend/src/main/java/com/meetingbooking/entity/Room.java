package com.meetingbooking.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "rooms")
public class Room {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true)
   private String name;

   @Column(nullable = false)
   private String building;

   @Column(nullable = false)
   private String floor;

   @Column(nullable = false)
   private Integer capacity;

   @ManyToMany
   @JoinTable(
           name = "room_equipments",
           joinColumns = @JoinColumn(name = "room_id"),
           inverseJoinColumns = @JoinColumn(name = "equipment_id")
   )
   private Set<Equipment> equipments = new HashSet<>();

   public Room() {
   }

   public Long getId() {
       return id;
   }

   public void setId(Long id) {
       this.id = id;
   }

   public String getName() {
       return name;
   }

   public void setName(String name) {
       this.name = name;
   }

   public String getBuilding() {
       return building;
   }

   public void setBuilding(String building) {
       this.building = building;
   }

   public String getFloor() {
       return floor;
   }

   public void setFloor(String floor) {
       this.floor = floor;
   }

   public Integer getCapacity() {
       return capacity;
   }

   public void setCapacity(Integer capacity) {
       this.capacity = capacity;
   }

   public Set<Equipment> getEquipments() {
       return equipments;
   }

   public void setEquipments(Set<Equipment> equipments) {
       this.equipments = equipments;
   }
}

