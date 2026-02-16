# 🚀 SKYBOUND Kids Academy

**"Distance is Not a Barrier"** - A creative learning platform for young creators to learn, grow, and share their passion.

## 🌟 Features

### For Students
- **Welcome Slideshow** - Beautiful onboarding experience introducing the platform
- **Sign Up / Login** - Create account with email and select interests (Art, Music, Dance, Tech, etc.)
- **Academy** - Browse and watch lessons from real instructors
- **Tasks** - Complete assignments and submit video proof
- **The Lab** - Social community to share work and connect with peers
- **Profile** - Track badges, certificates, and learning progress
- **Leaderboard** - Compete with other students based on approved submissions

### For Admins
- **Dashboard** - View stats (lessons, tasks, students, pending reviews)
- **Content Upload** - Upload lessons, tasks, and quizzes with video URLs
- **Grading** - Review student submissions and assign secret scores (0-100)

## 🏗️ Architecture

```
SKYBOUND Academy/
├── src/
│   ├── pages/           # React pages (Welcome, Home, Academy, Tasks, etc.)
│   ├── components/      # Reusable components (Layout, BottomNav, Sidebar)
│   ├── lib/            # Database utilities
│   ├── App.tsx         # Main app with routing
│   └── main.tsx        # Entry point
├── functions/
│   └── api/
│       ├── auth/       # Signup & Login endpoints
│       ├── content/    # Content CRUD operations
│       └── submissions/ # Task submissions & grading
├── wrangler.toml       # Cloudflare Pages config with D1
├── netlify.toml        # Netlify deployment config
└── schema.sql          # D1 database schema
```

## 🗄️ Database Schema (Cloudflare D1)

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | User's display name |
| email | TEXT | Unique email |
| role | TEXT | 'admin' or 'student' |
| social_links | TEXT | JSON (Instagram, TikTok) |
| niches | TEXT | JSON array of interests |
| total_badges | INTEGER | Badge count |
| created_at | DATETIME | Creation timestamp |

### Content Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| type | TEXT | 'lesson', 'task', or 'quiz' |
| title | TEXT | Content title |
| description | TEXT | Content description |
| video_url | TEXT | Video link |
| cover_image_url | TEXT | Cover image |
| resource_links | TEXT | JSON array of resources |
| created_at | DATETIME | Creation timestamp |

### Submissions Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| student_id | INTEGER | Foreign key to Users |
| content_id | INTEGER | Foreign key to Content |
| video_proof_url | TEXT | Student's video URL |
| status | TEXT | 'pending' or 'approved' |
| secret_score | INTEGER | 0-100 score (hidden from students) |
| submitted_at | DATETIME | Submission timestamp |

### TheLab Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| author_id | INTEGER | Foreign key to Users |
| content | TEXT | Post content |
| repost_id | INTEGER | For reposts |
| type | TEXT | 'post' or 'announcement' |
| created_at | DATETIME | Creation timestamp |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create new user |
| POST | /api/auth/login | Login by email |

### Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/content?type=all\|lesson\|task\|quiz | Fetch content |
| POST | /api/content | Create content (admin) |

### Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/submissions?status=pending\|approved | Fetch submissions |
| POST | /api/submissions | Submit task |
| PATCH | /api/submissions | Grade submission |

## 🚀 Deployment

### Option 1: Cloudflare Pages (Recommended)

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Login to Cloudflare
npx wrangler login

# Deploy to Cloudflare Pages
npx wrangler pages deploy ./dist --project-name=skybound-academy

# Apply database schema (if new D1)
npx wrangler d1 execute skyboundacademy_db --file=schema.sql --remote
```

### Option 2: Netlify

```bash
# Build the app
npm run build

# Deploy to Netlify (auto-detects netlify.toml)
# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

## 🔧 Environment Setup

### Required Environment Variables
None required - all config is in wrangler.toml

### D1 Database Setup
1. Create D1 database:
   ```bash
   npx wrangler d1 create skyboundacademy_db
   ```
2. Copy the `database_id` to wrangler.toml
3. Apply schema:
   ```bash
   npx wrangler d1 execute skyboundacademy_db --file=schema.sql --remote
   ```

## 📱 App Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Welcome | Slideshow intro (if not logged in) |
| `/onboarding` | Onboarding | Signup/Login flow |
| `/` | Home | Dashboard with leaderboard |
| `/academy` | Academy | Browse lessons |
| `/tasks` | Tasks | View & submit tasks |
| `/the-lab` | The Lab | Social feed |
| `/profile` | Profile | User stats & badges |
| `/admin` | Admin Panel | Content management |

## 🎨 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Cloudflare Workers Functions
- **Database**: Cloudflare D1
- **Deployment**: Cloudflare Pages / Netlify

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and feature requests, please open a GitHub issue.

---

**Built with ❤️ for young creators everywhere**
