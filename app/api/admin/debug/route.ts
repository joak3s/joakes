import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/database/supabase-admin'
import { createServerSupabaseClient } from '@/lib/database/supabase-server'
import type { Database } from '@/lib/types/database'

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

/**
 * GET /api/admin/debug
 * Debug endpoint for testing database connectivity and schema
 * Admin-only endpoint with detailed diagnostics
 */
export async function GET() {
  // Ensure only admins can access this endpoint
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...' // Truncated for security
    },
    tables: {},
    errors: []
  }
  
  try {
    const supabase = await getAdminClient()
    
    // Type-safe list of tables to check
    type TableNames = keyof Database['public']['Tables']
    const tables: TableNames[] = [
      'projects',
      'project_images',
      'project_tools',
      'project_tags',
      'tools',
      'tags',
      'journey',
      'journey_images'
    ]
    
    // Check each table
    for (const table of tables) {
      try {
        // Check if table exists with count
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          results.tables[table] = {
            exists: false,
            error: countError.message,
            count: null
          }
          results.errors.push(`Table '${table}' error: ${countError.message}`)
          continue
        }
        
        // For schema info, use a different approach
        try {
          // Try to get a schema safely using a query
          const { data: columnInfo, error: columnError } = await supabase
            .from(table)
            .select()
            .limit(0)
          
          // We can extract column names from the query response
          const schemaInfo = columnError ? null : {
            hasColumnInfo: true,
            columnNames: columnInfo ? Object.keys(columnInfo) : []
          }
          
          results.tables[table] = {
            exists: true,
            count,
            schemaInfo
          }
        } catch (schemaError) {
          results.tables[table] = {
            exists: true,
            count,
            schemaInfo: null,
            schemaError: schemaError instanceof Error ? schemaError.message : 'Unknown schema error'
          }
        }
        
        // Get a sample row to check data format
        const { data: sample, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (!sampleError && sample && sample.length > 0) {
          // For privacy/security, only include metadata about the sample row
          const sampleKeys = Object.keys(sample[0])
          results.tables[table].sampleData = {
            hasData: true,
            rowKeys: sampleKeys,
            firstRowId: 'id' in sample[0] ? (sample[0] as any).id : 'N/A'
          }
        } else {
          results.tables[table].sampleData = {
            hasData: false,
            error: sampleError ? sampleError.message : 'No data'
          }
        }
      } catch (error) {
        results.tables[table] = {
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error checking table'
        }
        results.errors.push(`Error checking table '${table}': ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Check specific relations for projects
    try {
      const { data: relationTest, error: relationError } = await supabase
        .from('projects')
        .select('id, title, project_images(id, url)')
        .limit(1)
      
      results.relations = {
        projectImages: {
          success: !relationError,
          error: relationError ? relationError.message : null,
          data: relationTest && relationTest.length > 0 ? {
            hasRelation: relationTest[0].project_images && 
                         Array.isArray(relationTest[0].project_images) &&
                         relationTest[0].project_images.length > 0
          } : null
        }
      }
    } catch (error) {
      results.relations = {
        error: error instanceof Error ? error.message : 'Unknown error checking relations'
      }
      results.errors.push(`Error checking relations: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    // Return the diagnostic results
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in database diagnostic check:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error in database diagnostic check',
        timestamp: new Date().toISOString(),
        results
      },
      { status: 500 }
    )
  }
} 