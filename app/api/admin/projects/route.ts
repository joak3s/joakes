import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'
import type { Database } from '@/lib/types/database'

type ProjectImageInput = {
  url: string
  alt_text?: string
  order_index: number
}

async function verifyAdmin() {
  // For now, just return true - implement proper admin verification later
  // In production, you would check the user's role/permissions here
  return true
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getAdminClient()
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images(*),
        project_tools(
          tool_id,
          tools(*)
        ),
        project_tags(
          tag_id,
          tags(*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to flatten the relationships
    const transformedProjects = projects?.map(project => ({
      ...project,
      tools: project.project_tools?.map((pt: any) => pt.tools).filter(Boolean) || [],
      tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
    })) || []

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Error in GET /api/admin/projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      challenge,
      approach,
      solution,
      results,
      summary,
      featured_order,
      status = 'draft',
      website_url,
      priority,
      images = [],
      tool_ids = [],
      tag_ids = []
    } = body

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, description' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()

    // Check if slug already exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }

    // Create the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        description,
        challenge,
        approach,
        solution,
        results,
        summary,
        featured_order,
        status,
        website_url,
        priority
      })
      .select()
      .single()

    if (projectError) {
      console.error('Error creating project:', projectError)
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    // Add images if provided
    if (images.length > 0) {
      const imageInserts = images.map((img: ProjectImageInput) => ({
        project_id: project.id,
        url: img.url,
        alt_text: img.alt_text,
        order_index: img.order_index
      }))

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageInserts)

      if (imagesError) {
        console.error('Error adding project images:', imagesError)
      }
    }

    // Add tool relationships if provided
    if (tool_ids.length > 0) {
      const toolInserts = tool_ids.map((toolId: string) => ({
        project_id: project.id,
        tool_id: toolId
      }))

      const { error: toolsError } = await supabase
        .from('project_tools')
        .insert(toolInserts)

      if (toolsError) {
        console.error('Error adding project tools:', toolsError)
      }
    }

    // Add tag relationships if provided
    if (tag_ids.length > 0) {
      const tagInserts = tag_ids.map((tagId: string) => ({
        project_id: project.id,
        tag_id: tagId
      }))

      const { error: tagsError } = await supabase
        .from('project_tags')
        .insert(tagInserts)

      if (tagsError) {
        console.error('Error adding project tags:', tagsError)
      }
    }

    // Fetch the complete project with relationships
    const { data: completeProject } = await supabase
      .from('projects')
      .select(`
        *,
        project_images(*),
        project_tools(
          tool_id,
          tools(*)
        ),
        project_tags(
          tag_id,
          tags(*)
        )
      `)
      .eq('id', project.id)
      .single()

    return NextResponse.json(completeProject, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 