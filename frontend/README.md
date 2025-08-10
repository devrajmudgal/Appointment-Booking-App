# Appointment Booking App

A minimal full-stack appointment booking application for a small clinic.

---

## Tech Stack

- **Backend:** Node.js, Express, Prisma ORM, JWT authentication
- **Database:** SQLite (for development) / PostgreSQL (recommended for production)
- **Frontend:** React, Vite, React Router, Axios
- **Deployment:** Render (backend), Vercel (frontend)

---

## Features

### Patient
- Register and log in
- View available appointment slots for the next 7 days (30-min intervals between 9:00–17:00)
- Book available slots (double-book prevention)
- View personal bookings

### Admin
- Login as admin (seeded user)
- View all bookings

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Git

---

### Backend Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/devrajmudgal/Appointment-Booking-App.git
   cd Appointment-Booking-App/backend
Install dependencies:

bash
Copy code
npm install
Create a .env file in the backend folder with:

env
Copy code
DATABASE_URL="file:./dev.db" # or your Postgres connection string for production
JWT_SECRET="your_jwt_secret_key_here"
FRONTEND_ORIGIN="http://localhost:5173" 
Run migrations and seed initial data:

bash
Copy code
npx prisma migrate deploy
npx prisma db seed
Start the backend server:

bash
Copy code
npm run start
Frontend Setup
Navigate to the frontend directory:

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Create .env file in the frontend folder with:

env
Copy code
VITE_API_URL="http://localhost:3000/api"  # Or your deployed backend API URL
Start the frontend dev server:

bash
Copy code
npm run dev
Deployment
--

Make sure to update environment variables on your hosting platforms:

DATABASE_URL

JWT_SECRET

FRONTEND_ORIGIN (backend)

VITE_API_URL (frontend)

Seeded Users for Testing
Role	Email	Password
Admin	admin@example.com	Passw0rd!
Patient	patient@example.com	Passw0rd!

API Endpoints
Method	Endpoint	Description	Auth Required
POST	/api/register	Register new user	No
POST	/api/login	Login and get JWT token	No
GET	/api/slots	Get available slots (query from & to)	Yes (patient/admin)
POST	/api/book	Book a slot	Yes (patient)
GET	/api/my-bookings	Get patient's bookings	Yes (patient)
GET	/api/all-bookings	Get all bookings (admin only)	Yes (admin)

Postman / curl Verification Script
bash
Copy code
# Register a new patient
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"name":"Test Patient","email":"testpatient@example.com","password":"Passw0rd!"}'

# Login as patient
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"patient@example.com","password":"Passw0rd!"}'

# Use the returned token below in Authorization headers as "Bearer <token>"

# Get available slots
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/slots?from=2025-08-10&to=2025-08-17

# Book a slot
curl -X POST http://localhost:3000/api/book -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"slotId":1}'

# Get my bookings
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/my-bookings

# Login as admin and get all bookings
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"Passw0rd!"}'
curl -H "Authorization: Bearer <admin_token>" http://localhost:3000/api/all-bookings
Known Limitations & Next Steps
No email verification or password reset flows.

Basic UI styling; UX can be improved.

Rate limiting & brute-force attack protection can be added.

Support for slot creation/removal by admin could be added.

More extensive backend testing is recommended.

Deploy using PostgreSQL for production reliability.

Add CI/CD pipelines for automated testing and deployment.

Architecture Notes
Folder Structure: Separate backend and frontend directories for clarity.

Auth & RBAC: JWT based authentication with user roles (patient, admin).

Booking Concurrency: Prisma unique constraint on bookings.slot_id prevents double booking.

Error Handling: Clear HTTP status codes and JSON error responses with codes like SLOT_TAKEN.

Timezone: All timestamps stored and processed in UTC consistently.
