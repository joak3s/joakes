import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'
import { createServerSupabaseClient } from '@/lib/database/supabase-server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Helper function to verify admin authentication
async function verifyAdmin() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Authentication verification error:', error)
    return false
  }
}

// GET /api/admin/tags - Get all tags
export async function GET() {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseAdmin = await getAdminClient()
    const { data: tags, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching tags:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error in GET /api/admin/tags:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tags - Create a new tag
export async function POST(request: NextRequest) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const tagData = await request.json()
    
    if (!tagData.name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }
    
    const supabaseAdmin = await getAdminClient()
    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .insert([tagData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating tag:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error in POST /api/admin/tags:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tags?id={id} - Update a tag
export async function PUT(request: NextRequest) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }
    
    const tagData = await request.json()
    
    const supabaseAdmin = await getAdminClient()
    const { error } = await supabaseAdmin
      .from('tags')
      .update(tagData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating tag:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Tag updated successfully' })
  } catch (error) {
    console.error('Error in PUT /api/admin/tags:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tags?id={id} - Delete a tag
export async function DELETE(request: NextRequest) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }
    
    const supabaseAdmin = await getAdminClient()
    const { error } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting tag:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/tags:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 