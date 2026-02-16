interface Env {
    DB: any
}

// GET - Fetch lab posts
export async function onRequestGet(context: { env: Env; url: URL }) {
    const { env } = context
    
    try {
        const result = await env.DB.prepare(`
            SELECT t.*, u.name as author_name
            FROM TheLab t
            JOIN Users u ON t.author_id = u.id
            WHERE t.type = 'post'
            ORDER BY t.created_at DESC
            LIMIT 50
        `).all()
        
        const posts = result.results || []
        
        return new Response(JSON.stringify({ posts }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// POST - Create a new post
export async function onRequestPost(context: { env: Env; request: Request }) {
    const { env, request } = context
    
    try {
        const body = await request.json()
        const { authorId, content, type = 'post' } = body
        
        if (!authorId || !content) {
            return new Response(JSON.stringify({ error: 'Author ID and content are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        const result = await env.DB.prepare(
            'INSERT INTO TheLab (author_id, content, type) VALUES (?, ?, ?)'
        ).bind(authorId, content, type).run()
        
        return new Response(JSON.stringify({ 
            success: true,
            id: result.meta.last_row_id,
            message: 'Post created successfully'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// PUT - Like a post
export async function onRequestPut(context: { env: Env; request: Request }) {
    const { env, request } = context
    
    try {
        const body = await request.json()
        const { action, userId, postId } = body
        
        if (action === 'like' && userId && postId) {
            await env.DB.prepare(
                'INSERT OR IGNORE INTO LabLikes (user_id, post_id) VALUES (?, ?)'
            ).bind(userId, postId).run()
            
            return new Response(JSON.stringify({ success: true, message: 'Post liked' }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'save' && userId && postId) {
            await env.DB.prepare(
                'INSERT OR IGNORE INTO Saves (user_id, post_id) VALUES (?, ?)'
            ).bind(userId, postId).run()
            
            return new Response(JSON.stringify({ success: true, message: 'Post saved' }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'repost' && userId && postId) {
            await env.DB.prepare(
                'INSERT INTO TheLab (author_id, content, repost_id, type) VALUES (?, ?, ?, ?)'
            ).bind(userId, 'Reposted', postId, 'post').run()
            
            return new Response(JSON.stringify({ success: true, message: 'Post reposted' }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to perform action' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
