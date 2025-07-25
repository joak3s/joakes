import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminClient()
    
    // Get content usage statistics
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count(*)', { count: 'exact', head: true })

    const { data: journey, error: journeyError } = await supabase
      .from('journey')
      .select('count(*)', { count: 'exact', head: true })

    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('count(*)', { count: 'exact', head: true })

    if (projectsError || journeyError || toolsError) {
      throw new Error('Failed to fetch content usage data')
    }

    return NextResponse.json({
      projects: projects || 0,
      journey: journey || 0,
      tools: tools || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching content usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content usage' },
      { status: 500 }
    )
  }
} 