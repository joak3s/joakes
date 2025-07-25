import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET all general_info entries
export async function GET() {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('general_info')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching general info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch general info entries' },
      { status: 500 }
    )
  }
}

// POST (Create or Update) a general_info entry
export async function POST(request: Request) {
  try {
    const supabase = await getAdminClient()
    const body = await request.json()

    const { id, ...updateData } = body

    let result

    if (id) {
      // Update existing entry
      const { data, error } = await supabase
        .from('general_info')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      result = data
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('general_info')
        .insert(updateData)
        .select()
        .single()
      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating/updating general info:', error)
    return NextResponse.json(
      { error: 'Failed to save general info entry' },
      { status: 500 }
    )
  }
}

// DELETE a general_info entry
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('general_info')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting general info entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
