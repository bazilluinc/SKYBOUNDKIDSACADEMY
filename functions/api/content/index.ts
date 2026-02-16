interface Env {
    DB: any
}

// GET - Fetch content by type
export async function onRequestGet(context: { env: Env; url: URL }) {
    const { env, url } = context

    try {
        const type = url.searchParams.get('type') || 'all'
        let result: any

        if (type === 'all') {
            result = await env.DB.prepare(
                'SELECT * FROM Content ORDER BY created_at DESC LIMIT 100'
            ).all()
        } else {
            result = await env.DB.prepare(
                'SELECT * FROM Content WHERE type = ? ORDER BY created_at DESC LIMIT 100'
            ).bind(type).all()
        }

        const content = result.results || []

        return new Response(JSON.stringify({ content }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// POST - Create new content (admin only)
export async function onRequestPost(context: { env: Env; request: Request }) {
    const { env, request } = context

    try {
        const body = await request.json()
        const { type, title, description, videoUrl, coverImageUrl, resourceLinks } = body

        if (!type || !title) {
            return new Response(JSON.stringify({ error: 'Type and title are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const result = await env.DB.prepare(
            'INSERT INTO Content (type, title, description, video_url, cover_image_url, resource_links) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
            type,
            title,
            description || '',
            videoUrl || null,
            coverImageUrl || null,
            JSON.stringify(resourceLinks || [])
        ).run()

        return new Response(JSON.stringify({
            success: true,
            id: result.meta.last_row_id,
            message: 'Content created successfully'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
