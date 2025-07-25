import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Fetch session details
    const { data: session, error: sessionError } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Fetch all messages for this session
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select(`
        id,
        message_type,
        content,
        sequence_number,
        created_at,
        metadata,
        search_results,
        message_contexts (
          id,
          context_type,
          content_id,
          relevance,
          content
        )
      `)
      .eq('session_id', sessionId)
      .order('sequence_number', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json(
        { error: 'Failed to fetch session messages' },
        { status: 500 }
      )
    }

    // Calculate session statistics
    const stats = {
      totalMessages: messages?.length || 0,
      userMessages: messages?.filter(m => m.message_type === 'user').length || 0,
      assistantMessages: messages?.filter(m => m.message_type === 'assistant').length || 0,
      duration: session.last_updated && session.created_at 
        ? new Date(session.last_updated).getTime() - new Date(session.created_at).getTime()
        : 0,
      avgResponseTime: 0 // Could be calculated from metadata if available
    }

    return NextResponse.json({
      session,
      messages,
      stats
    })

  } catch (error) {
    console.error('Error in session messages API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 