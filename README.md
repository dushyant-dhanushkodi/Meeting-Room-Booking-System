# Meeting Room Booking System

A full-stack web application for managing meeting rooms and bookings. The system allows employees to search for suitable rooms, check availability, create and cancel bookings, while administrators can manage rooms, override bookings, and access usage reports.

## Features

### Employee Features

- Search meeting rooms based on:
  - Capacity
  - Building
  - Floor
  - Equipment
- View available and unavailable time slots for a room.
- Create meeting room bookings with meeting details.
- View bookings for a user.
- View bookings associated with a room.
- Cancel existing bookings.

### Admin Features

- Add new meeting rooms.
- Update room details such as capacity, building, floor, and equipment.
- Remove meeting rooms.
- View all bookings.
- Override existing bookings.
- View room usage reports.
- View peak booking hour reports.

### Booking Management

- Check room availability for a given date and time range.
- Prevent overlapping bookings through business validations.
- Restrict bookings based on configured office hours.
- Enforce maximum meeting duration.
- Maintain booking lifecycle and status.
- Support booking cancellation and administrator overrides.

### Security

- User registration and login.
- Authentication for protected APIs.
- Role-based authorization using Employee and Admin roles.
- Endpoint-level access control using Spring Security.
- Global exception handling for consistent error responses.

## Technology Stack

### Backend
- Java
- Spring Boot
- Spring Security
- REST APIs
- Maven

### Frontend
- React
- TypeScript
- HTML
- CSS

### Database
- MySQL

## System Architecture

```text
                    +----------------------+
                    |      React UI        |
                    | React + TypeScript   |
                    +----------+-----------+
                               |
                               | REST APIs
                               |
                    +----------v-----------+
                    |    Spring Boot       |
                    |       Backend        |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        Controllers         Services         Security
              |                |                |
              +----------------+----------------+
                               |
                               v
                        +-------------+
                        |    MySQL    |
                        +-------------+
````

## Application Flow

### Employee Booking Flow

```text
Login
  ↓
Search Rooms
  ↓
Filter by Capacity / Building / Floor / Equipment
  ↓
Select Room
  ↓
Check Available Time Slots
  ↓
Create Booking
  ↓
Booking Confirmation
```

### Admin Flow

```text
Admin Login
    ↓
Manage Rooms
    ├── Add Room
    ├── Update Room
    └── Delete Room
    ↓
Manage Bookings
    ├── View All Bookings
    └── Override Booking
    ↓
View Reports
    ├── Room Usage
    └── Peak Hours
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Room APIs

```http
GET    /api/rooms
GET    /api/rooms/search
POST   /api/rooms
PUT    /api/rooms/{id}
DELETE /api/rooms/{id}
```

### Booking APIs

```http
POST /api/bookings
POST /api/bookings/{id}/override
POST /api/bookings/{id}/cancel

GET /api/bookings/user/{userId}
GET /api/bookings/room/{roomId}
GET /api/bookings/room/{roomId}/slots
GET /api/bookings/all
```

### Report APIs

```http
GET /api/reports/room-usage
GET /api/reports/peak-hours
```

## Authorization

The application uses role-based authorization to control access to different operations.

| Operation          | Employee | Admin |
| ------------------ | :------: | :---: |
| Search Rooms       |     ✅    |   ✅   |
| View Availability  |     ✅    |   ✅   |
| Create Booking     |     ✅    |   ✅   |
| Cancel Booking     |     ✅    |   ✅   |
| View User Bookings |     ✅    |   ✅   |
| View Room Bookings |     ✅    |   ✅   |
| Add Room           |     ❌    |   ✅   |
| Update Room        |     ❌    |   ✅   |
| Delete Room        |     ❌    |   ✅   |
| Override Booking   |     ❌    |   ✅   |
| View All Bookings  |     ❌    |   ✅   |
| Room Usage Report  |     ❌    |   ✅   |
| Peak Hours Report  |     ❌    |   ✅   |

## Business Validations

The system applies business rules to ensure reliable room booking:

* A room cannot be booked for overlapping time periods.
* Meetings must fall within configured office hours.
* A meeting cannot exceed the configured maximum duration.
* A booking can only be created for an available room and time slot.
* Administrators can override bookings when required.
* Booking status is maintained throughout the booking lifecycle.

## Booking Status

The application maintains booking states such as:

```text
AVAILABLE
BOOKED
CANCELLED
OVERRIDDEN
```

## Backend Structure

```text
backend
└── src
    └── main
        └── java
            └── com.meetingbooking
                ├── config
                ├── controller
                ├── dto
                ├── entity
                ├── exception
                ├── repository
                ├── security
                ├── service
                └── service.impl
```

## Frontend Structure

```text
frontend
└── src
    ├── assets
    ├── components
    │   ├── BookingModal.tsx
    │   ├── MyBookings.tsx
    │   ├── OverrideBookings.tsx
    │   ├── ProtectedRoute.tsx
    │   ├── Reports.tsx
    │   ├── RoomManagement.tsx
    │   └── RoomSearch.tsx
    │
    ├── models
    │   ├── auth.ts
    │   ├── booking.ts
    │   └── room.ts
    │
    ├── pages
    │   ├── DashboardPage.tsx
    │   ├── LoginPage.tsx
    │   └── RegisterPage.tsx
    │
    ├── services
    │   ├── api.ts
    │   ├── authService.ts
    │   ├── bookingService.ts
    │   ├── reportService.ts
    │   └── roomService.ts
    │
    └── styles
```

## Setup and Installation

### Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js
* npm
* MySQL

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/meeting-room-booking.git
cd meeting-room-booking
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE meeting_booking;
```

Configure your database credentials in the Spring Boot configuration file.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meeting_booking
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd meeting-booking-backend
```

Run the application using Maven:

```bash
mvn spring-boot:run
```

### 4. Run the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

## API Examples

### Search Rooms

```http
GET /api/rooms/search?capacity=10&building=A&floor=2&equipments=Projector,Whiteboard
```

### Create Booking

```http
POST /api/bookings
Content-Type: application/json
```

Example request:

```json
{
  "roomId": 1,
  "userId": 5,
  "meetingTitle": "Project Discussion",
  "startTime": "2026-09-17T10:00:00",
  "endTime": "2026-09-17T11:00:00"
}
```

### Check Room Availability

```http
GET /api/bookings/room/1/slots?start=2026-09-17T09:00:00&end=2026-09-17T18:00:00
```

### Room Usage Report

```http
GET /api/reports/room-usage?from=2026-09-01&to=2026-09-30
```

### Peak Hours Report

```http
GET /api/reports/peak-hours?from=2026-09-01&to=2026-09-30
```

## Error Handling

The backend uses centralized exception handling to provide consistent responses for application errors such as:

* Room not found
* Booking conflicts
* Invalid booking requests
* Unauthorized access
* Validation failures
* Invalid user operations

## Project Highlights

* Full-stack application with **Spring Boot + React**
* RESTful backend architecture
* Role-based authorization with Spring Security
* Room search and availability management
* Booking conflict and business-rule validation
* Admin room and booking management
* Usage and peak-hour reporting
* Centralized exception handling

## Author

**Dushyant D**

Java | Spring Boot | React | MySQL
