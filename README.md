# Mini LMS Video Tracker

A focused mini Learning Management System that lets users view course modules/videos, switch between them, mark videos as complete, and track progress with optimistic UI updates.

## ✨ Features

- **Two-pane layout** — Sidebar with module list + main video player area
- **Module navigation** — Click any module to switch videos instantly
- **Completion tracking** — Mark modules as complete with visual indicators (✓ green checkmark / grey circle)
- **Global progress bar** — Shows "X of Y videos completed — Z%" with animated fill
- **Optimistic UI updates** — Progress updates instantly without waiting for API; rolls back on failure
- **Video Resume State**  — Automatically saves your position when you pause, and resumes from that exact timestamp when you revisit a module
- **Proper error handling** — Frontend rollback on API failure + error toast notifications
- **Seed script** — Demo data ready to test immediately after setup

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Axios, Lucide React |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Deployment | Netlify (frontend) + Render (backend) |

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── courseController.js # GET course with modules
│   │   └── progressController.js # GET/PUT progress
│   ├── models/
│   │   ├── Course.js           # Course schema
│   │   ├── Module.js           # Video module schema
│   │   └── Progress.js         # User progress schema
│   ├── routes/
│   │   ├── courseRoutes.js     # /api/courses
│   │   └── progressRoutes.js  # /api/progress
│   ├── seed/
│   │   └── seed.js            # Demo data seeder
│   ├── server.js              # Express entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CourseSidebar.jsx  # Module list with status icons
│   │   │   ├── VideoPlayer.jsx    # HTML5 video + mark complete
│   │   │   └── ProgressBar.jsx    # Global completion bar
│   │   ├── context/
│   │   │   └── CourseContext.jsx   # Shared state + optimistic updates
│   │   ├── pages/
│   │   │   └── CoursePage.jsx     # Main two-pane layout
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── netlify.toml
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or local instance)
- *Optional:* Docker & Docker Compose (for containerized setup)

### Option A: Standard Manual Setup

#### 1. Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file and set the required variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/edsanta
   ```
3. Install dependencies, seed the database, and start the development server:
   ```bash
   npm install
   npm run seed    # Seeds courses and video modules
   npm run dev     # Starts API on http://localhost:5000
   ```
   *Note: Copy the printed **Course ID** from the seed output to paste into your frontend environment.*

#### 2. Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Create a `.env` file and set your environment variables:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_COURSE_ID=<paste_course_id_from_seed_step>
   VITE_USER_ID=demo-user-123
   ```
3. Install dependencies and start the Vite development server:
   ```bash
   npm install
   npm run dev     # Starts web app on http://localhost:5173
   ```

---

### Option B: Quick Docker Setup (Bonus Point Submission)

To compile and launch the entire multi-service stack (MongoDB, Express API, React SPA served via Nginx) in a fully sandboxed environment:

1. Build and run the containers in the background from the root directory:
   ```bash
   docker compose up -d --build
   ```
2. Run the database seed script inside the running backend container:
   ```bash
   docker compose exec backend npm run seed
   ```
3. Access the services in your browser:
   - **Frontend App:** http://localhost:5173
   - **Backend Health Check:** http://localhost:5000

To stop all container services, run:
```bash
docker compose down -v
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses/:id` | Fetch course details with ordered modules |
| `GET` | `/api/progress/:userId/:courseId` | Fetch user's completion status |
| `PUT` | `/api/progress/:userId/:moduleId` | Mark a module as complete |

### Example: Fetch Course

```
GET /api/courses/683e1a2b4f5d6e7a8b9c0d1e

Response:
{
  "_id": "683e1a2b4f5d6e7a8b9c0d1e",
  "title": "Advanced JavaScript",
  "description": "Master advanced JS concepts...",
  "modules": [
    {
      "_id": "683e1a2b4f5d6e7a8b9c0d1f",
      "title": "Closures & Lexical Scope",
      "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
      "duration": "12:30",
      "order": 1
    }
  ]
}
```

### Example: Mark Module Complete

```
PUT /api/progress/demo-user-123/683e1a2b4f5d6e7a8b9c0d1f
Content-Type: application/json

{ "courseId": "683e1a2b4f5d6e7a8b9c0d1e" }

Response:
{
  "userId": "demo-user-123",
  "courseId": "683e1a2b4f5d6e7a8b9c0d1e",
  "completedModules": ["683e1a2b4f5d6e7a8b9c0d1f"],
  "percentage": 20
}
```

## 🗄 Database Schema

### Course
```js
{ title, description, modules: [ObjectId → Module] }
```

### Module
```js
{ title, videoUrl, duration, order, course: ObjectId → Course }
```

### Progress
```js
{ userId, courseId, completedModules: [ObjectId], percentage, lastWatchedPositions: Map<moduleId, seconds> }
```

## ⭐ Bonus: Video Resume State

The app tracks the exact timestamp where the user paused the video and automatically resumes from that position when they revisit the module:

- **On pause** — Current playback position is saved to the backend
- **On revisit** — Video automatically seeks to the saved position
- **Periodic saves** — Position is saved every 5 seconds during playback for safety
- **Stored in** — `Progress.lastWatchedPositions` (Map of moduleId → seconds)

## 🚢 Deployment

### Frontend → Netlify

1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables: `VITE_API_URL`, `VITE_COURSE_ID`

### Backend → Render

1. Create a new Web Service on Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables: `MONGO_URI`, `PORT`

## 📜 License

MIT License
