// Cloudflare D1 Database Utility
// This module provides database operations for SKYBOUND Academy

// Database types matching schema
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'student'
  social_links: string
  niches: string
  total_badges: number
  created_at: string
}

export interface Content {
  id: number
  type: 'lesson' | 'task' | 'quiz'
  title: string
  description: string
  cover_image_url: string
  video_url: string
  resource_links: string
  created_at: string
}

export interface Submission {
  id: number
  student_id: number
  content_id: number
  video_proof_url: string
  status: 'pending' | 'approved'
  secret_score: number
  submitted_at: string
}

export interface TheLab {
  id: number
  author_id: number
  content: string
  repost_id: number | null
  type: 'post' | 'announcement'
  created_at: string
}

// Environment type for Cloudflare Workers
export interface Env {
  DB: any // D1Database binding
}

// Database operations class
export class Database {
  private db: any

  constructor(db: any) {
    this.db = db
  }

  // User operations
  async createUser(name: string, email: string, niches: string[], socialLinks: Record<string, string>) {
    return this.db.prepare(`
      INSERT INTO Users (name, email, niches, social_links)
      VALUES (?, ?, ?, ?)
    `).bind(name, email, JSON.stringify(niches), JSON.stringify(socialLinks)).run()
  }

  async getUserByEmail(email: string) {
    return this.db.prepare(`
      SELECT * FROM Users WHERE email = ?
    `).bind(email).first()
  }

  async getUserById(id: number) {
    return this.db.prepare(`
      SELECT * FROM Users WHERE id = ?
    `).bind(id).first()
  }

  async updateUserBadges(id: number, count: number) {
    return this.db.prepare(`
      UPDATE Users SET total_badges = total_badges + ? WHERE id = ?
    `).bind(count, id).run()
  }

  // Content operations
  async createContent(
    type: 'lesson' | 'task' | 'quiz',
    title: string,
    description: string,
    videoUrl?: string,
    coverImageUrl?: string
  ) {
    return this.db.prepare(`
      INSERT INTO Content (type, title, description, video_url, cover_image_url)
      VALUES (?, ?, ?, ?, ?)
    `).bind(type, title, description, videoUrl || null, coverImageUrl || null).run()
  }

  async getContentByType(type: string) {
    if (type === 'all') {
      return this.db.prepare('SELECT * FROM Content ORDER BY created_at DESC').all()
    }
    return this.db.prepare('SELECT * FROM Content WHERE type = ? ORDER BY created_at DESC').bind(type).all()
  }

  async getContentById(id: number) {
    return this.db.prepare('SELECT * FROM Content WHERE id = ?').bind(id).first()
  }

  // Submission operations
  async createSubmission(studentId: number, contentId: number, videoProofUrl: string) {
    return this.db.prepare(`
      INSERT INTO Submissions (student_id, content_id, video_proof_url, status)
      VALUES (?, ?, ?, 'pending')
    `).bind(studentId, contentId, videoProofUrl).run()
  }

  async getSubmissionsByStatus(status: string) {
    return this.db.prepare(`
      SELECT s.*, u.name as student_name, c.title as task_title
      FROM Submissions s
      JOIN Users u ON s.student_id = u.id
      JOIN Content c ON s.content_id = c.id
      WHERE s.status = ?
      ORDER BY s.submitted_at DESC
    `).bind(status).all()
  }

  async updateSubmissionScore(id: number, score: number) {
    return this.db.prepare(`
      UPDATE Submissions SET secret_score = ?, status = 'approved' WHERE id = ?
    `).bind(score, id).run()
  }

  // TheLab operations
  async createPost(authorId: number, content: string, type: string = 'post') {
    return this.db.prepare(`
      INSERT INTO TheLab (author_id, content, type) VALUES (?, ?, ?)
    `).bind(authorId, content, type).run()
  }

  async getPosts() {
    return this.db.prepare(`
      SELECT t.*, u.name as author_name
      FROM TheLab t
      JOIN Users u ON t.author_id = u.id
      WHERE t.type = 'post'
      ORDER BY t.created_at DESC
      LIMIT 50
    `).all()
  }

  async likePost(userId: number, postId: number) {
    return this.db.prepare(`
      INSERT OR IGNORE INTO LabLikes (user_id, post_id) VALUES (?, ?)
    `).bind(userId, postId).run()
  }

  async savePost(userId: number, postId: number) {
    return this.db.prepare(`
      INSERT OR IGNORE INTO Saves (user_id, post_id) VALUES (?, ?)
    `).bind(userId, postId).run()
  }

  async repostPost(authorId: number, originalPostId: number) {
    return this.db.prepare(`
      INSERT INTO TheLab (author_id, content, repost_id, type) 
      VALUES (?, 'Reposted', ?, 'post')
    `).bind(authorId, originalPostId).run()
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10) {
    return this.db.prepare(`
      SELECT u.name, u.total_badges, SUM(s.secret_score) as total_score
      FROM Users u
      LEFT JOIN Submissions s ON u.id = s.student_id AND s.status = 'approved'
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT ?
    `).bind(limit).all()
  }
}

// Factory function to create database instance
export function createDatabase(env: Env): Database {
  return new Database(env.DB)
}
