# Running the Nexus Tech Backend Locally

To run the backend server on your machine, follow these steps:

### 1. Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: You need a running MongoDB instance. You can either:
  - Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally.
  - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud) and get a connection string.

### 2. Environment Setup
The backend requires several environment variables. I have already created a `.env` file in the `server` directory for you.

If you are using MongoDB Atlas, update the `MONGO_URI` in `server/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexus_tech
```

### 3. Installation
If you haven't already, install the dependencies:
```powershell
cd server
npm install
```

### 4. Running the Server
You have two options to start the server:

#### Option A: Development Mode (with Auto-Reload)
This uses `nodemon` to restart the server whenever you save a file.
```powershell
npm run dev
```

#### Option B: Normal Mode
```powershell
npm start
```

### 5. Verification
Once started, you should see:
- `✅ MongoDB Connected`
- `✅ Firebase Admin SDK initialized`
- `🚀 Server running in development mode`

You can test the health of the API by visiting:
[http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Common Issues
- **MongoDB Connection Error**: Ensure your MongoDB service is started (if local) or your IP is whitelisted in MongoDB Atlas.
- **Firebase Error**: Ensure the credentials in `.env` are correct and the private key is properly formatted with `\n` characters.
