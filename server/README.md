# Nexus Tech Contest API

Scalable backend for the contest platform where users participate, earn points, and redeem rewards.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Firebase Project (for Authentication)

### Installation
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Fill in your `MONGO_URI`
   - Fill in your Firebase Service Account details

4. Run the server:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 🛠 API Architecture
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: Hybrid (Firebase Admin SDK + local JWT)
- **Validation**: Joi
- **Security**: Helmet, CORS, Express-Rate-Limit, BcryptJS

## 📂 Folder Structure
- `src/config`: Database and Third-party configurations
- `src/models`: Mongoose schemas
- `src/controllers`: Request handlers and business logic
- `src/routes`: API endpoint definitions
- `src/middlewire`: Custom middleware (Auth, Error handling, Validation)
- `src/services`: Background tasks and shared logic
- `src/utils`: Helpers (API responses, Errors, Tokens)

## 📍 Key Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/firebase-login` - Sync with Firebase Auth
- `GET /api/auth/me` - Get current user profile

### Contests
- `GET /api/contests` - List all contests
- `POST /api/contests/:id/join` - Join a contest
- `POST /api/contests/:id/submit` - Submit quiz answers

### Wallet & Rewards
- `GET /api/wallet` - Check balance & history
- `GET /api/rewards` - List available rewards
- `POST /api/rewards/:id/redeem` - Redeem points for a reward

### Leaderboard
- `GET /api/leaderboard` - Global rankings

### Admin (Admin Role Required)
- `GET /api/admin/dashboard` - Stats overview
- `POST /api/admin/contests` - Create new contest
- `PATCH /api/admin/users/:id/ban` - Ban a user
