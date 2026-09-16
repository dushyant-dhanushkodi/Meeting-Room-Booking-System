package com.meetingbooking.dto;

import java.util.Set;

public class RoomDto {

	private Long id;
	private String name;
	private String building;
	private String floor;
	private Integer capacity;
	private Set<String> equipments;

	public RoomDto() {

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

	public Set<String> getEquipments() {

		return equipments;

	}

	public void setEquipments(Set<String> equipments) {

		this.equipments = equipments;

	}

}
