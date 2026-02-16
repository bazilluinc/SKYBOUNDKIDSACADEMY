-- SKYBOUND Academy Database Schema
-- Cloudflare D1 Compatible

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('admin', 'student')) DEFAULT 'student',
    social_links TEXT DEFAULT '{}', -- JSON object with IG, TikTok, etc.
    niches TEXT DEFAULT '[]', -- JSON array of selected niches
    total_badges INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content Table (Lessons, Tasks, Quizzes)
CREATE TABLE IF NOT EXISTS Content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('lesson', 'task', 'quiz')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    video_url TEXT,
    resource_links TEXT DEFAULT '[]', -- JSON array of resource links
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS Submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    video_proof_url TEXT,
    status TEXT CHECK(status IN ('pending', 'approved')) DEFAULT 'pending',
    secret_score INTEGER DEFAULT 0 CHECK(secret_score BETWEEN 0 AND 100),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(id),
    FOREIGN KEY (content_id) REFERENCES Content(id)
);

-- TheLab Table (Social Posts)
CREATE TABLE IF NOT EXISTS TheLab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    repost_id INTEGER, -- For reposts
    type TEXT CHECK(type IN ('post', 'announcement')) DEFAULT 'post',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(id),
    FOREIGN KEY (repost_id) REFERENCES TheLab(id)
);

-- Saves Table (Bookmarks)
CREATE TABLE IF NOT EXISTS Saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (post_id) REFERENCES TheLab(id),
    UNIQUE(user_id, post_id)
);

-- Likes Table for TheLab
CREATE TABLE IF NOT EXISTS LabLikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (post_id) REFERENCES TheLab(id),
    UNIQUE(user_id, post_id)
);

-- Quiz Questions Table
CREATE TABLE IF NOT EXISTS QuizQuestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL, -- Links to Content table
    question TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT CHECK(correct_answer IN ('A', 'B', 'C', 'D')),
    FOREIGN KEY (content_id) REFERENCES Content(id)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS Badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon_url TEXT,
    description TEXT,
    requirement TEXT
);

-- User Badges Junction Table
CREATE TABLE IF NOT EXISTS UserBadges (
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (badge_id) REFERENCES Badges(id),
    PRIMARY KEY (user_id, badge_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_submissions_student ON Submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_content ON Submissions(content_id);
CREATE INDEX IF NOT EXISTS idx_thelab_author ON TheLab(author_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON Content(type);
