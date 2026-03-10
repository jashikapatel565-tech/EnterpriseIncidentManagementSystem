
# Enterprise Incident Management System

A modern **enterprise-style IT Incident Management Platform** designed to simulate real-world service desk systems used in large organizations.

The system allows users to report incidents, administrators to manage and assign tickets, monitor SLA compliance, generate reports, and track analytics through a modern dashboard.

---

# Project Overview

This project demonstrates a **full-stack enterprise application architecture** with authentication, role-based access control, ticket management, and reporting features.

It is designed to mimic **enterprise IT support platforms** used in organizations for managing technical incidents and service requests.

---

# Key Features

### Authentication & Authorization

* User signup and login
* Secure password hashing
* Role-based access control
* Admin and user dashboards

### Incident Management

* Create incidents
* Assign incidents to team members
* Update status and priority
* Track resolution progress

### Admin Dashboard

* Incident analytics
* Incident status overview
* Ticket assignment system
* Activity monitoring

### SLA Monitoring

* Automatic SLA tracking
* Alerts for delayed incidents
* Service performance monitoring

### Reporting System

* Generate incident reports
* Export resolved incidents to CSV
* Analytics for management insights

### Email Notifications

* Incident creation alerts
* Ticket assignment notifications
* Status updates for users

---

# System Architecture

```
Frontend (React)
        │
        │ REST API
        ▼
Backend (FastAPI)
        │
        │ ORM Layer
        ▼
Database (SQLite)
```

### Backend Services

* Authentication & Security
* Incident Management API
* SLA Monitoring Service
* Email Notification Service
* Report Generation Service

---

# Tech Stack

### Frontend

* React
* JavaScript
* Modern dashboard UI

### Backend

* Python
* FastAPI
* SQLAlchemy
* JWT Authentication

### Database

* SQLite

### DevOps

* Docker
* Git

---

# Project Structure

```
EnterpriseIncidentManagementSystem
│
├── backend
│   ├── app
│   │   ├── services
│   │   │   ├── email_service.py
│   │   │   ├── report_generator.py
│   │   │   └── sla_monitor.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── public
│   └── src
│
├── screenshots
├── architecture.png
├── docker-compose.yml
└── README.md
```

---

# Installation Guide

## 1 Clone the repository

```
git clone https://github.com/jashikapatel565-tech/EnterpriseIncidentManagementSystem.git
```

```
cd EnterpriseIncidentManagementSystem
```

---

# Backend Setup

Create a virtual environment

```
python -m venv venv
```

Activate it

Windows

```
venv\Scripts\activate
```

Install dependencies

```
pip install -r requirements.txt
```

Run backend server

```
uvicorn app.main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Start frontend

```
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

# Running with Docker

Build and start services

```
docker-compose up --build
```

---

# Database

The system uses **SQLite** as the default database.

Database file:

```
enterprise_incidents.db
```

The database is automatically created when the backend starts.

---

# Future Improvements

* Cloud database integration
* Real-time notifications
* Advanced analytics dashboard
* AI-based incident categorization
* Mobile support

---
