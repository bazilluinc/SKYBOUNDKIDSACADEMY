interface Env {
  DB: D1Database
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  const { env, request } = context
  
  try {
    const body = await request.json()
    const { name, email, niches, socialLinks } = body

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if user exists
    const existing = await env.DB.prepare(
      'SELECT id FROM Users WHERE email = ?'
    ).bind(email).first()

    if (existing) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create user with student role
    const result = await env.DB.prepare(
      'INSERT INTO Users (name, email, niches, social_links, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      name, 
      email, 
      JSON.stringify(niches || []), 
      JSON.stringify(socialLinks || {}),
      'student'
    ).run()

    // Get the created user
    const user = await env.DB.prepare(
      'SELECT id, name, email, role, niches, social_links, total_badges, created_at FROM Users WHERE id = ?'
    ).bind(result.meta.last_row_id).first()

    const responseUser = {
      ...user,
      niches: JSON.parse(user?.niches || '[]'),
      socialLinks: JSON.parse(user?.social_links || '{}')
    }

    return new Response(JSON.stringify({ user: responseUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Signup failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
