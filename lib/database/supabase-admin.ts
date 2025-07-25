/**
 * Admin Supabase Client
 * 
 * This client uses the service role key and bypasses RLS (Row Level Security).
 * It should ONLY be used in server-side admin operations.
 * 
 * NEVER import this in client-side code or public-facing components.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import { SUPABASE_CONFIG, validateSupabaseConfig } from '../config/supabase'

// Validate configuration on import
validateSupabaseConfig()

let adminClient: SupabaseClient<Database> | null = null

/**
 * Custom fetch function with timeout and error handling
 */
const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
}

/**
 * Get or create the admin Supabase client
 * Uses service role key for elevated privileges
 */
export function getAdminClient(): SupabaseClient<Database> {
  if (!adminClient) {
    console.log('🔧 Creating new Supabase admin client...')
    
    if (!SUPABASE_CONFIG.SERVICE_ROLE_KEY) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is required for admin operations. ' +
        'Please check your environment variables.'
      )
    }

    adminClient = createClient<Database>(
      SUPABASE_CONFIG.URL!,
      SUPABASE_CONFIG.SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          fetch: customFetch,
        },
      }
    )

    console.log('✅ Admin Supabase client created successfully')
  }

  return adminClient
}

/**
 * Test the admin client connection
 */
export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 Testing admin client connection...')
    const client = getAdminClient()
    
    // Test with a simple query
    const { error } = await client
      .from('projects')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Admin client connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('✅ Admin client connection test successful')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Admin client connection test failed:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * Execute a query with retry logic
 */
export async function executeWithRetry<T>(
  operation: (client: SupabaseClient<Database>) => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  const client = getAdminClient()
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Executing operation (attempt ${attempt}/${maxRetries})`)
      return await operation(client)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`⚠️ Operation failed on attempt ${attempt}:`, lastError.message)

      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Operation failed after all retries')
}

/**
 * Execute database operations using Supabase's built-in methods
 * Note: This replaces the previous raw SQL approach with type-safe operations
 */
export async function executeDatabaseOperation<T>(
  operation: (client: SupabaseClient<Database>) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  try {
    console.log('🔍 Executing database operation...')
    const client = getAdminClient()
    
    const result = await operation(client)

    if (result.error) {
      console.error('❌ Database operation failed:', result.error)
      return result
    }

    console.log('✅ Database operation executed successfully')
    return result
  } catch (error) {
    console.error('❌ Database operation execution failed:', error)
    return { data: null, error }
  }
}

/**
 * Utility functions for common admin operations
 */
export const AdminUtils = {
  /**
   * Get table row count
   */
  async getRowCount(tableName: string): Promise<number> {
    const client = getAdminClient()
    const { count, error } = await client
      .from(tableName as any)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error(`Error getting row count for ${tableName}:`, error)
      return 0
    }

    return count || 0
  },

  /**
   * Clear all data from a table (use with extreme caution)
   */
  async clearTable(tableName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = getAdminClient()
      const { error } = await client
        .from(tableName as any)
        .delete()
        .neq('id', '')

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  },

  /**
   * Backup table data
   */
  async backupTable(tableName: string): Promise<any[] | null> {
    try {
      const client = getAdminClient()
      const { data, error } = await client
        .from(tableName as any)
        .select('*')

      if (error) {
        console.error(`Error backing up ${tableName}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Error backing up ${tableName}:`, error)
      return null
    }
  }
} 