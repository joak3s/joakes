import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client with service role key for backend operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define interfaces for type safety
interface DailyCount {
  date: string;
  count: number;
}

export async function GET(request: Request) {
  try {
    // Parse URL for query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const period = searchParams.get('period') || '7d'; // Default to 7 days
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    // Format dates for Postgres
    const startDateStr = startDate.toISOString();
    
    // Fetch session metrics
    const { data: sessions, error: sessionsError } = await supabase
      .from('conversation_sessions')
      .select('id, title, created_at, last_updated')
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch session data' }, { status: 500 });
    }
    
    // Get message counts
    const { count: totalMessages } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: false })
      .gte('created_at', startDateStr);
    
    // Count user messages
    const { count: userMessages } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: false })
      .eq('message_type', 'user')
      .gte('created_at', startDateStr);
    
    // Count assistant messages
    const { count: assistantMessages } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: false })
      .eq('message_type', 'assistant')
      .gte('created_at', startDateStr);
    
    // Calculate message statistics manually
    const messageStats = {
      totalMessages: totalMessages || 0,
      userMessages: userMessages || 0,
      assistantMessages: assistantMessages || 0,
      averageLength: 0 // To be calculated later
    };
    
    // Fetch most recent messages with analytics data
    const { data: recentMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select(`
        id, 
        session_id,
        message_type,
        content,
        created_at,
        prompt_tokens,
        completion_tokens,
        response_time_ms,
        context_count,
        max_similarity,
        model_name,
        search_results,
        metadata,
        message_contexts (
          id,
          context_type,
          content_id,
          relevance
        )
      `)
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false })
      .limit(25);
    
    if (messagesError) {
      console.error('Error fetching recent messages:', messagesError);
      return NextResponse.json({ error: 'Failed to fetch message data' }, { status: 500 });
    }
    
    // Calculate average message length
    if (recentMessages && recentMessages.length > 0) {
      const totalLength = recentMessages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
      messageStats.averageLength = Math.round(totalLength / recentMessages.length);
    }
    
    // Get session counts per day
    const { data: sessionsByDay, error: sessionsByDayError } = await supabase
      .from('conversation_sessions')
      .select('created_at')
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: true });
    
    // Transform into daily counts format
    const dailyCounts: DailyCount[] = [];
    if (sessionsByDay) {
      const dayMap = new Map<string, number>();
      
      sessionsByDay.forEach(session => {
        const date = new Date(session.created_at).toISOString().split('T')[0];
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
      });
      
      // Convert map to array of objects
      dayMap.forEach((count, date) => {
        dailyCounts.push({ date, count });
      });
    }
    
    // Get all messages (for manual counting per session)
    const { data: allMessages, error: allMessagesError } = await supabase
      .from('chat_messages')
      .select('id, session_id')
      .gte('created_at', startDateStr);
    
    // Count messages per session manually
    const sessionMessageCounts = new Map<string, number>();
    if (allMessages) {
      allMessages.forEach(msg => {
        const sessionId = msg.session_id;
        sessionMessageCounts.set(sessionId, (sessionMessageCounts.get(sessionId) || 0) + 1);
      });
    }
    
    // Add message counts to sessions
    const sessionsWithCounts = sessions?.map(session => {
      const messageCount = sessionMessageCounts.get(session.id) || 0;
      return {
        ...session,
        message_count: messageCount
      };
    }) || [];
    
    // Return compiled analytics data
    return NextResponse.json({
      sessions: sessionsWithCounts,
      messageStats,
      recentMessages,
      dailyCounts,
      period
    });
    
  } catch (error) {
    console.error('Error in chat analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 