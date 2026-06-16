# Transport Management System (TMS)

## Project Overview

The Transport Management System (TMS) is a full-stack web application developed to automate and manage transportation services efficiently. The system allows administrators and users to manage bus routes, vehicle registrations, boarding points, maintenance schedules, payments, and transport registrations through a centralized platform.

This project is developed using:

* **Frontend:** React.js, Vite, Bootstrap
* **Backend:** Spring Boot, Spring Security, JWT Authentication
* **Database:** MySQL
* **Build Tools:** Maven, npm

---

## Features

### User Features

* User Registration and Login
* Secure JWT Authentication
* View Available Routes
* Transport Registration
* Payment Processing
* Profile Management
* Password Recovery

### Admin Features

* Dashboard Analytics
* Bus Management
* Route Management
* Boarding Point Management
* User Management
* Maintenance Tracking
* Registration Approval
* Payment Monitoring

### Security Features

* Spring Security Integration
* JWT Token Authentication
* Role-Based Access Control
* Password Encryption

---

## System Architecture

```text
+------------------+
|   React Frontend |
+--------+---------+
         |
         | REST APIs
         |
+--------v---------+
| Spring Boot API  |
+--------+---------+
         |
         |
+--------v---------+
|    MySQL DB      |
+------------------+
```

---

## Project Structure

```text
transport-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/main/java/com/tms
│   │   ├── controllers
│   │   ├── services
│   │   ├── repositories
│   │   ├── models
│   │   ├── config
│   │   └── dto
│   │
│   ├── src/main/resources
│   └── pom.xml
│
└── README.md
```

---

## Installation Guide

### Prerequisites

Install the following software:

* Java JDK 17+
* Maven 3.8+
* MySQL 8+
* Node.js 18+
* npm

---

## Backend Setup

### 1. Navigate to Backend Folder

```bash
cd backend
```

### 2. Configure Database

Update the database configuration in:

```properties
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tmsdb
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
```

### 3. Build and Run

```bash
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Frontend Setup

### 1. Navigate to Frontend Folder

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Application

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Main Modules

### Authentication Module

* Login
* Registration
* JWT Security
* Password Reset

### Bus Management Module

* Add Bus
* Update Bus
* Delete Bus
* Track Bus Information

### Route Management Module

* Create Routes
* Update Routes
* Route Assignment

### Registration Module

* Transport Registration
* Approval Workflow

### Payment Module

* Fee Management
* Payment Tracking

### Maintenance Module

* Vehicle Maintenance Records
* Service Scheduling

---

## Technologies Used

| Technology      | Purpose               |
| --------------- | --------------------- |
| React.js        | Frontend Development  |
| Vite            | Build Tool            |
| Spring Boot     | Backend Development   |
| Spring Security | Authentication        |
| JWT             | Authorization         |
| MySQL           | Database              |
| Maven           | Dependency Management |
| Bootstrap       | UI Design             |

---

## API Endpoints

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Bus

```http
GET    /api/buses
POST   /api/buses
PUT    /api/buses/{id}
DELETE /api/buses/{id}
```

### Routes

```http
GET    /api/routes
POST   /api/routes
PUT    /api/routes/{id}
DELETE /api/routes/{id}
```

### Registrations

```http
GET    /api/registrations
POST   /api/registrations
```

### Payments

```http
GET    /api/payments
POST   /api/payments
```

---

## Future Enhancements

* GPS Tracking Integration
* Mobile Application
* Real-Time Notifications
* Online Payment Gateway
* QR Code Boarding System
* AI-Based Route Optimization

---

## Author

**Krishna Sai**
B.Tech Project – Transport Management System

---

## License

This project is developed for educational and academic purposes only. Unauthorized commercial use is prohibited.

---

This README is suitable for including in your project report, GitHub repository, and final project documentation.
