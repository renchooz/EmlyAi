# 🚀 EmlyAI

EmlyAI is an AI-powered job application automation platform that helps job seekers analyze resumes, match them with job descriptions, generate personalized application emails and cover letters, and send applications directly through Gmail.

The goal of EmlyAI is to reduce the time spent on repetitive job application tasks and improve application quality using AI.

---

## ✨ Features

### 📄 Resume Management

* Upload multiple resumes (PDF)
* Store and manage resumes securely
* Rename, preview, and delete resumes
* Resume text extraction for AI processing

### 🤖 AI Resume Analysis

* ATS-style resume analysis
* Resume vs Job Description matching
* Match score generation
* Strength identification
* Missing skills detection
* Improvement suggestions

### 🎯 Best Resume Selection

* Compare multiple resumes against a Job Description
* AI automatically selects the most relevant resume
* Match score and reasoning provided

### ✉️ AI Email Generation

* Generate personalized application emails
* Tailored according to:

  * Resume
  * Job Description
  * Company Name
* Professional subject line generation

### 📝 AI Cover Letter Generator

* Customized cover letters
* Company-specific content
* Resume-based personalization

### ⚡ One Click Apply

* Select best resume automatically
* Generate email content
* Preview before sending
* Edit email content
* Send directly through Gmail

### 📬 Gmail Integration

* Google OAuth Authentication
* Secure Gmail API integration
* No App Password required
* Send emails directly from user's Gmail account

### 📊 Email History

* Track sent applications
* View email subjects and recipients
* Application history dashboard

### 🔒 Authentication

* JWT Authentication
* Google Login
* Protected Routes
* Secure Cookie-based sessions

---

## 🏗️ System Architecture

```text
React Frontend
      │
      ▼
Node.js + Express API
      │
      ├── MongoDB
      ├── Gemini AI
      ├── Gmail API
      └── Google OAuth
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Framer Motion
* Axios
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* JWT
* Multer
* PDF Parse
* Google APIs
* Gemini AI SDK

### Database

* MongoDB
* Mongoose

### AI

* Google Gemini 2.5 Flash

### Authentication

* JWT Authentication
* Google OAuth 2.0

### Email

* Gmail API

### DevOps & Deployment

* Docker
* Docker Compose
* Nginx
* AWS EC2
* GitHub Actions CI/CD

---

## 📁 Project Structure

```text
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   └── utils/

server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/

uploads/
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

GEMINI_API_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REDIRECT_URI=

CLIENT_URL=

SERVER_URL=
```

### Frontend (.env)

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone <repository-url>

cd emly-ai
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## 🐳 Docker Setup

### Build Containers

```bash
docker compose up --build
```

### Run Detached

```bash
docker compose up -d
```

### Stop

```bash
docker compose down
```

---

## ☁️ Deployment

### Infrastructure

* AWS EC2
* Nginx Reverse Proxy
* Docker Containers
* GitHub Actions CI/CD

### New EC2 setup (13.61.25.64)

When moving to a **new EC2 instance**, update these in order:

#### 1. AWS EC2 security group

Open inbound ports:

| Port | Purpose |
|------|---------|
| 22   | SSH (GitHub Actions deploy) |
| 80   | HTTP |
| 443  | HTTPS (after SSL setup) |

#### 2. GitHub repository secrets

Update in **Settings → Secrets and variables → Actions**:

| Secret | New value |
|--------|-----------|
| `EC2_HOST` | `13.61.25.64` |
| `EC2_USER` | `ubuntu` (or your AMI user) |
| `EC2_SSH_KEY` | Private key contents for the new instance |
| `EC2_DOMAIN` | `13.61.25.64.nip.io` |
| `CLIENT_URL` | `http://13.61.25.64.nip.io` |
| `SERVER_URL` | `http://13.61.25.64.nip.io` |
| `VITE_API_URL` | `http://13.61.25.64.nip.io/api` |
| `GOOGLE_REDIRECT_URI` | `http://13.61.25.64.nip.io/api/gmail/callback` |
| `MONGO_URI` | `mongodb://mongo:27017/emlyai` |

Keep existing secrets unchanged: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `PORT`.

After enabling HTTPS with Certbot, change `http://` to `https://` in `CLIENT_URL`, `SERVER_URL`, `VITE_API_URL`, and `GOOGLE_REDIRECT_URI`, then redeploy.

#### 3. Google Cloud Console (OAuth)

In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth client:

**Authorized JavaScript origins**
```
http://13.61.25.64.nip.io
https://13.61.25.64.nip.io
```

**Authorized redirect URIs**
```
http://13.61.25.64.nip.io/api/gmail/callback
https://13.61.25.64.nip.io/api/gmail/callback
```

#### 4. Deploy

Push to the `prod` branch to trigger the pipeline:

```bash
git push origin prod
```

The workflow installs Docker, Nginx, pulls images from Docker Hub, and starts containers on the new server.

#### 5. Enable HTTPS (one-time on EC2)

SSH into the new server:

```bash
ssh -i your-key.pem ubuntu@13.61.25.64
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d 13.61.25.64.nip.io
```

Then update GitHub secrets to use `https://` URLs and push again.

### CI/CD Flow

```text
Push to GitHub
      │
      ▼
GitHub Actions
      │
      ▼
Docker Image Build
      │
      ▼
Push to Docker Hub
      │
      ▼
SSH Deployment to EC2
      │
      ▼
Docker Compose Pull & Restart
```

---

## 📈 Benefits

### Before EmlyAI

* Manual resume selection
* Manual email writing
* Manual attachment handling
* 10–15 minutes per application

### After EmlyAI

* AI resume selection
* AI-generated emails
* Gmail integration
* Application in a few clicks

---

## 🔮 Future Improvements

* Job board integrations
* Bulk application support
* Resume optimization suggestions
* Application tracking dashboard
* Interview preparation assistant
* AI-powered networking outreach
* Analytics & reporting
* Multi-LLM support (Gemini, OpenAI, Claude)

---

## 👨‍💻 Author

Raj Sharma

LinkedIn:
https://www.linkedin.com/in/raj-sharma9975/

GitHub:
https://github.com/renchooz

---

## ⭐ Support

If you found this project useful, consider giving it a star and sharing your feedback.
