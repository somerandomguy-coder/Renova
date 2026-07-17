# Deployment Guide - Turso, Render, & Netlify

This guide explains how to deploy the database on Turso, the FastAPI backend on Render, and the Next.js frontend on Netlify.

---

## 1. 🗄️ Database Setup (Turso)

Turso is a distributed SQLite service built on libSQL. It is compatible with our SQLite schema out-of-the-box.

1. Install the Turso CLI and log in, or sign up at [Turso.tech](https://turso.tech).
2. Create a new database:
   ```bash
   turso db create renova-db
   ```
3. Retrieve your database connection URL:
   ```bash
   turso db show renova-db --url
   # Example output: libsql://renova-db-yourusername.turso.io
   ```
4. Generate a secure authentication token:
   ```bash
   turso db tokens create renova-db
   # Example output: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Save both values for the Render backend environment variables.

---

## 2. 🐍 Backend API Setup (Render)

Render will host the FastAPI server and connect to Turso.

1. Sign up/log in at [Render.com](https://render.com).
2. Create a new **Web Service** and link your Git repository.
3. Configure the service settings:
   * **Root Directory**: `backend` (Ensure Render points only to the backend folder).
   * **Language**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in the Render settings panel:
   * `DATABASE_URL`: Your Turso DB URL (e.g., `libsql://renova-db-user.turso.io`).
   * `TURSO_AUTH_TOKEN`: The auth token generated in step 1 (Note: `database.py` will append the token parameter automatically from the URL, or you can supply `sqlite+libsql://your-url/?authToken=your-token&secure=true` directly in `DATABASE_URL`).
   * `CORS_ORIGINS`: A JSON array containing your Netlify site URL, e.g. `["https://renova-circular.netlify.app"]`.
   * `JWT_SECRET_KEY`: A secure random password string.
   * `ENCRYPTION_KEY`: A base64-encoded Fernet key (Generate via `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`).
   * `USE_MOCK_EMAIL`: Set to `False` (if you want live emails) or `True` (if you want to keep logging emails mock-style).
   * `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`: (Optional SMTP mail configurations).

---

## 3. 🌐 Frontend Static Site Setup (Netlify)

Netlify will build and host the Next.js frontend, connecting to the Render API.

1. Sign up/log in at [Netlify.com](https://netlify.com).
2. Import a new site from your Git provider and select your repository.
3. Configure the build settings:
   * **Base Directory**: `frontend` (Point Netlify to build inside the frontend subfolder).
   * **Build Command**: `npm run build`
   * **Publish Directory**: `frontend/out` (Since we are using static export, Netlify serves static pages directly).
4. Add the following **Environment Variable** in the Netlify site configuration:
   * `NEXT_PUBLIC_API_URL`: The full URL of your deployed Render backend web service (e.g. `https://your-renova-backend.onrender.com`).
5. Click **Deploy**. Netlify will deploy the Next.js application, making it accessible on a public `.netlify.app` domain.
