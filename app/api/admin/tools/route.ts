import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  // For now, just return true - implement proper admin verification later
  // In production, you would check the user's role/permissions here
  return true
}

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getAdminClient()
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*')
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, icon, show_in_filter = true, display_priority } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const supabase = getAdminClient()
    const { data: tool, error } = await supabase
      .from('tools')
      .insert({
        name,
        slug,
        description,
        icon,
        show_in_filter,
        display_priority
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Tool deleted successfully' })
  } catch (error) {
    console.error('Error deleting tool:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, show_in_filter } = await req.json()

    if (!id || show_in_filter === undefined) {
      return NextResponse.json({ error: 'ID and show_in_filter are required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { data: tool, error } = await supabase
      .from('tools')
      .update({ show_in_filter })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error updating tool:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 