# 🏥 Healthcare Assistance Platform

<p align="center">
<img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue">
<img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green">
<img src="https://img.shields.io/badge/Database-MongoDB-brightgreen">
<img src="https://img.shields.io/badge/AI-Google%20Gemini%20%2B%20LangGraph-orange">
<img src="https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-red">
<img src="https://img.shields.io/badge/Status-Completed-success">
</p>

A full-stack healthcare web application that helps users access basic healthcare support online.  
The platform includes secure authentication, role-based dashboards, doctor management, appointment booking, profile management, and an **AI healthcare chatbot powered by Gemini + LangGraph**.

---

# 🌐 Project Vision
The goal is to make healthcare **more accessible and organized online** by allowing users to:
- Find doctors
- Book appointments
- Manage health information
- Get basic AI healthcare guidance

> ⚠️ This platform does **not replace professional medical advice**.

---

# ✨ Key Features

## 🔐 Authentication & Security
- Patient signup & login
- JWT-based authentication
- Password hashing using bcryptjs
- Role-based authorization
- Secure MongoDB Atlas connection
- Protected backend routes

## 👥 Role-Based System
| Role | Capabilities |
|---|---|
| **Patient** | Book appointments, chat with AI, manage profile |
| **Doctor** | Manage appointments |
| **Admin** | Manage doctors & appointments |

---

## 👨‍⚕️ Doctor Management
- View doctors list
- Search & filter doctors
- Admin can add, update, and delete doctors

---

## 📅 Appointment Booking System
- Book appointments with doctors
- Cancel appointments
- Manage appointment status
- Doctor/Admin appointment control

---

## 🤖 AI Healthcare Chatbot
Powered by **Google Gemini + LangGraph**

Features:
- General healthcare guidance
- Emergency query detection
- Safety disclaimers
- Chat history storage
- Chat history clearing

---

# 🧠 System Architecture

### Frontend
Users can:
- Register & login
- Browse doctors
- Book appointments
- Chat with AI assistant
- Manage profiles

### Backend
Handles:
- API requests
- Authentication & authorization
- MongoDB operations
- Appointment management
- AI chatbot processing

---

# 🔄 Application Workflow
1. User interacts with frontend  
2. Frontend sends API request  
3. Backend processes request  
4. MongoDB stores/retrieves data  
5. Backend sends response  
6. Frontend updates UI  

---

# 🛠️ Tech Stack

## Frontend
- HTML
- CSS
- JavaScript
- Fetch API
- LocalStorage
- Responsive Design

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- CORS

## AI Integration
- Google Gemini API
- LangGraph
- Rule-based emergency detection

---

# 🗄️ Database Collections
- Users  
- Doctors  
- Appointments  
- ChatMessages  

---

# 🔌 API Modules
- Authentication APIs  
- Doctor APIs  
- Appointment APIs  
- Chatbot APIs  
- Profile APIs  

---

# 📸 Screenshots

Add screenshots in a folder named **screenshots** and update paths if needed.

### 🏠 Home Page
<img src="screenshots/home.png" width="800">

### 🔐 Login Page
<img src="screenshots/login.png" width="800">

### 👨‍⚕️ Doctors Page
<img src="screenshots/doctors.png" width="800">

### 📅 Appointments
<img src="screenshots/appointments.png" width="800">

### 🤖 AI Chatbot
<img src="screenshots/chatbot.png" width="800">

---

# 🎨 UI Highlights
- Mobile-friendly layout
- Healthcare-style theme
- Role-based navigation
- Form validation & feedback
- Card-based UI

---

# 📈 Learning Outcomes
This project strengthened skills in:
- Full-stack development
- REST API design
- Authentication & authorization
- MongoDB database handling
- AI integration in web apps
- Role-based systems

---

# 🚀 Future Improvements
- Video consultations  
- Email/SMS notifications  
- Online prescriptions  
- Payment integration  
- Real-time doctor chat  
- Advanced AI recommendations  
- Mobile app version  

---

# 👩‍💻 Author
**Radhika Agarwal**

---

⭐ If you like this project, give it a star!
