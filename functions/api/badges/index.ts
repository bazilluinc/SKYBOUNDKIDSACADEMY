interface Env {
    DB: any
}

// GET - Fetch user badges
export async function onRequestGet(context: { env: Env; url: URL }) {
    const { env, url } = context
    
    try {
        const userId = url.searchParams.get('userId')
        
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        const result = await env.DB.prepare(`
            SELECT b.id, b.name, b.icon_url, b.description, ub.earned_at
            FROM Badges b
            LEFT JOIN UserBadges ub ON b.id = ub.badge_id AND ub.user_id = ?
            ORDER BY b.id
        `).bind(userId).all()
        
        const badges = (result.results || []).map((badge: any) => ({
            id: badge.id,
            name: badge.name,
            icon: badge.icon_url || '🏆',
            description: badge.description,
            earned: !!badge.earned_at,
            earnedAt: badge.earned_at
        }))
        
        return new Response(JSON.stringify({ badges }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch badges' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// POST - Award badge to user
export async function onRequestPost(context: { env: Env; request: Request }) {
    const { env, request } = context
    
    try {
        const body = await request.json()
        const { userId, badgeId } = body
        
        if (!userId || !badgeId) {
            return new Response(JSON.stringify({ error: 'User ID and badge ID are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        await env.DB.prepare(
            'INSERT OR IGNORE INTO UserBadges (user_id, badge_id) VALUES (?, ?)'
        ).bind(userId, badgeId).run()
        
        return new Response(JSON.stringify({ 
            success: true,
            message: 'Badge awarded successfully'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to award badge' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
