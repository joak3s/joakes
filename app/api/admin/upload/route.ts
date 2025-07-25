import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/supabase-server'
import { getAdminClient } from '@/lib/database/supabase-admin'
import { uploadJourneyImage, uploadProjectImage } from "@/app/actions/admin"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Authenticate
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get form data from request
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'project' // Default to project uploads
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }
    
    // Check file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, GIF, WEBP, or SVG image" },
        { status: 400 }
      )
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Image must be less than 5MB" },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    
    // Use the appropriate server action based on the type
    let result;
    if (type === 'journey') {
      // Use journey upload action 
      result = await uploadJourneyImage(
        fileBuffer,
        file.name,
        file.type
      )
    } else {
      // Use project upload action (default)
      result = await uploadProjectImage(
        fileBuffer,
        file.name,
        file.type
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 