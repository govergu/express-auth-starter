## ✨ Overview

This project is a reusable authentication backend designed to accelerate development of fullstack applications by providing a secure and scalable auth foundation.

![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-blue)

# 🔐 Express Auth Starter

A production-ready authentication system built with Express, MongoDB, and JWT.

> Designed to be reusable across projects with secure architecture and modern best practices.

---

## 🚀 Features

- 🔐 JWT Authentication (Access + Refresh Token)
- 🔁 Refresh Token Rotation
- 🍪 HTTP-only Cookie Support
- 📧 Email Verification (Nodemailer)
- 🔑 Forgot / Reset Password
- 🧑 Role-based Authorization
- 🧾 Input Validation (Zod)
- 🔒 Secure Password Hashing (bcrypt)
- 🧠 Clean Modular Architecture

---

## 🏗️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Zod
- Nodemailer

---

## 📂 Project Structure

src/
│
├── modules/
│ ├── auth/
│ ├── user/
│
├── common/
│ ├── middlewares/
│ ├── types/
│ ├── utils/
│
├── infrastructure/
│ ├── database/
│ ├── services/
│
├── config/
├── app.ts
├── server.ts

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/express-auth-starter.git
cd express-auth-starter

```

### 2. Install the dependencies

```bash
npm install
```

### 3. Setup Environment variables

Create a .env file:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/express-auth-starter

JWT_ACCESS_SECRET=accesssecret
JWT_REFRESH_SECRET=refreshsecret

JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

COOKIE_EXPIRES_DAYS=7

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email-address
EMAIL_PASS=1234 5678 1234 5678
EMAIL_FROM=Auction App <your-email-address>

FRONTEND_URL=http://localhost:3000
```

### 4. Run the Server

```bash
npm run dev
```

---

## 🔐 Authentication Flow

Register → Email Verification → Login → Access Token Issued

---

## 🔁 Token Flow

Login → Access Token (short-lived)
→ Refresh Token (long-lived)

Access expires → Refresh API → New tokens issued

---

## 🔑 Password Reset Flow

Forgot Password → Email Sent → Reset Link → New Password Set

---

## 📬 API Endpoints

| Method | Route                        | Description      |
| ------ | ---------------------------- | ---------------- |
| POST   | /api/v1/auth/register        | Register user    |
| POST   | /api/v1/auth/login           | Login            |
| GET    | /api/v1/auth/verify-email    | Verify email     |
| GET    | /api/v1/auth/refresh         | Refresh token    |
| POST   | /api/v1/auth/logout          | Logout           |
| GET    | /api/v1/auth/me              | Get current user |
| POST   | /api/v1/auth/change-password | Change password  |
| POST   | /api/v1/auth/forgot-password | Send reset email |
| POST   | /api/v1/auth/reset-password  | Reset password   |

---

## 🛡️ Security Practices

- Password hashing with bcrypt
- HTTP-only cookies
- Token rotation
- Input validation
- Role-based access control

---

## 📌 Future Enhancements

- OAuth (Google, GitHub)
- Redis session storage
- Multi-device login tracking

---

## 🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Commit your changes
Open a Pull Request
