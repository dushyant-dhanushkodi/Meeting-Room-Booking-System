package com.meetingbooking.dto;

import java.time.LocalDateTime;

public class NotificationDto {

	private Long id;
	private Long bookingId;
	private Long userId;
	private String message;
	private LocalDateTime createdAt;
	private boolean sent;

	public NotificationDto() {

	}

	public Long getId() {

		return id;

	}

	public void setId(Long id) {

		this.id = id;

	}

	public Long getBookingId() {

		return bookingId;

	}

	public void setBookingId(Long bookingId) {

		this.bookingId = bookingId;

	}

	public Long getUserId() {

		return userId;

	}

	public void setUserId(Long userId) {

		this.userId = userId;

	}

	public String getMessage() {

		return message;

	}

	public void setMessage(String message) {

		this.message = message;

	}

	public LocalDateTime getCreatedAt() {

		return createdAt;

	}

	public void setCreatedAt(LocalDateTime createdAt) {

		this.createdAt = createdAt;

	}

	public boolean isSent() {

		return sent;

	}

	public void setSent(boolean sent) {

		this.sent = sent;

	}

}
