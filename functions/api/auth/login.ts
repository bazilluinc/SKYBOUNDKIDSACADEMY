interface Env {
  DB: D1Database
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  const { env, request } = context
  
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get user by email
    const user = await env.DB.prepare(
      'SELECT id, name, email, role, niches, social_links, total_badges, created_at FROM Users WHERE email = ?'
    ).bind(email).first()

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse JSON fields
    const responseUser = {
      ...user,
      niches: JSON.parse(user.niches || '[]'),
      socialLinks: JSON.parse(user.social_links || '{}')
    }

    return new Response(JSON.stringify({ user: responseUser }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
