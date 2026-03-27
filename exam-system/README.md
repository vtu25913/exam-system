# Dynamic Online Examination & Result Processing System

A full-stack web application for conducting online exams with real-time timer, auto-evaluation, and result analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Bootstrap 5, Bootstrap Icons |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0, Sequelize ORM |
| Auth | JWT (JSON Web Tokens), bcryptjs |

---

## Features

### Admin
- Secure login/logout
- Create, edit, delete exams with MCQ questions
- Set exam duration and passing marks
- View all student results and analytics
- Manage students (add, activate/deactivate, delete)

### Student
- Register and login
- View available exams
- Take timed exams with auto-submit
- View results with detailed answer review

---

## Project Structure

```
exam-system/
├── backend/
│   ├── config/db.js          # MySQL/Sequelize connection
│   ├── controllers/          # Business logic
│   ├── middleware/auth.js    # JWT authentication
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── seed.js               # Sample data
│   ├── server.js             # Entry point
│   └── .env                  # Environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Layout, Spinner, Pagination
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Admin & Student pages
│   │   └── utils/api.js      # Axios instance
│   └── build/                # Production build
├── landing/                  # Static landing page
├── start.bat                 # One-click launcher
└── README.md
```

---

## Prerequisites

- Node.js v18+
- MySQL 8.0 (with MySQL Workbench)
- npm

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/exam-system.git
cd exam-system
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
Edit `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=examdb
JWT_SECRET=supersecretjwtkey2024examSystem
```

### 4. Create MySQL database
Open MySQL Workbench and run:
```sql
CREATE DATABASE IF NOT EXISTS examdb;
```

### 5. Seed sample data
```bash
cd backend
node seed.js
```

### 6. Install frontend dependencies & build
```bash
cd frontend
npm install
npm run build
```

### 7. Start the server
```bash
cd backend
node server.js
```

### 8. Open in browser
```
http://localhost:5000
```

---

## Quick Start (Windows)

Just double-click `start.bat` — it starts MySQL, the backend, and opens the browser automatically.

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@exam.com | admin123 |
| Student | alice@exam.com | student123 |
| Student | bob@exam.com | student123 |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register student |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Exams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exams | List exams |
| GET | /api/exams/:id | Get exam |
| POST | /api/exams | Create exam (admin) |
| PUT | /api/exams/:id | Update exam (admin) |
| DELETE | /api/exams/:id | Delete exam (admin) |
| GET | /api/exams/:id/start | Start exam (student) |

### Results
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/results/submit | Submit exam |
| GET | /api/results/my | My results |
| GET | /api/results/my/:examId | Result detail |
| GET | /api/results | All results (admin) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List students (admin) |
| POST | /api/users | Add student (admin) |
| PATCH | /api/users/:id/toggle | Activate/deactivate |
| DELETE | /api/users/:id | Delete student (admin) |

---

## Database Schema

### users
| Column | Type |
|--------|------|
| id | INT (PK) |
| name | VARCHAR |
| email | VARCHAR (unique) |
| password | VARCHAR (hashed) |
| role | ENUM(admin, student) |
| isActive | BOOLEAN |

### exams
| Column | Type |
|--------|------|
| id | INT (PK) |
| title | VARCHAR |
| description | TEXT |
| duration | INT (minutes) |
| totalMarks | INT |
| passingMarks | INT |
| isActive | BOOLEAN |
| questions | JSON |
| createdBy | INT (FK users) |

### results
| Column | Type |
|--------|------|
| id | INT (PK) |
| studentId | INT (FK users) |
| examId | INT (FK exams) |
| answers | JSON |
| score | FLOAT |
| totalMarks | FLOAT |
| percentage | FLOAT |
| passed | BOOLEAN |
| timeTaken | INT (seconds) |
| submittedAt | DATETIME |

---

## Hardware Requirements

- Processor: Intel Core i3 or above
- RAM: 4GB minimum
- Storage: 500MB free space

## Software Requirements

- Windows 10/11
- Node.js v18+
- MySQL 8.0
- Google Chrome or any modern browser
