interface Env {
  DB: any
}

// GET - Fetch submissions by status
export async function onRequestGet(context: { env: Env; url: URL }) {
  const { env, url } = context
  
  try {
    const status = url.searchParams.get('status') || 'pending'
    const result = await env.DB.prepare(`
      SELECT s.*, u.name as student_name, c.title as task_title
      FROM Submissions s
      JOIN Users u ON s.student_id = u.id
      JOIN Content c ON s.content_id = c.id
      WHERE s.status = ?
      ORDER BY s.submitted_at DESC
      LIMIT 100
    `).bind(status).all()

    return new Response(JSON.stringify({ submissions: result.results || [] }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch submissions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// POST - Create new submission
export async function onRequestPost(context: { env: Env; request: Request }) {
  const { env, request } = context
  
  try {
    const body = await request.json()
    const { studentId, contentId, videoProofUrl } = body

    if (!studentId || !contentId || !videoProofUrl) {
      return new Response(JSON.stringify({ error: 'Student ID, content ID, and video URL are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await env.DB.prepare(
      'INSERT INTO Submissions (student_id, content_id, video_proof_url, status) VALUES (?, ?, ?, ?)'
    ).bind(studentId, contentId, videoProofUrl, 'pending').run()

    return new Response(JSON.stringify({ 
      success: true,
      id: result.meta.last_row_id,
      message: 'Submission created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create submission' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// PATCH - Grade a submission
export async function onRequestPatch(context: { env: Env; request: Request }) {
  const { env, request } = context
  
  try {
    const body = await request.json()
    const { submissionId, score } = body

    if (!submissionId || score === undefined) {
      return new Response(JSON.stringify({ error: 'Submission ID and score are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update submission
    await env.DB.prepare(
      'UPDATE Submissions SET secret_score = ?, status = ? WHERE id = ?'
    ).bind(score, 'approved', submissionId).run()

    // Get submission to find student_id
    const submission = await env.DB.prepare(
      'SELECT student_id FROM Submissions WHERE id = ?'
    ).bind(submissionId).first()

    if (submission) {
      // Update user badges
      await env.DB.prepare(
        'UPDATE Users SET total_badges = total_badges + 1 WHERE id = ?'
      ).bind(submission.student_id).run()
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Submission graded successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to grade submission' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
