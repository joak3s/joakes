'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from '../types/database'
import { SUPABASE_CONFIG, validateSupabaseConfig } from '../config/supabase'

// Validate configuration on import
validateSupabaseConfig();

/**
 * Creates a server-side Supabase client with cookie handling
 * For use in Server Components and Route Handlers
 * Uses the anonymous key by default, but with server-side auth
 */
export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  console.log(`Creating server Supabase client with URL: ${SUPABASE_CONFIG.URL?.substring(0, 20)}...`)

  return createServerClient<Database>(
    SUPABASE_CONFIG.URL!,
    SUPABASE_CONFIG.ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle Next.js ReadonlyHeaders error in middleware or Server Actions
            console.error(`Cookie set error for ${name}:`, error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', {
              ...options,
              maxAge: 0,
              expires: new Date(0)
            })
          } catch (error) {
            console.error(`Cookie remove error for ${name}:`, error)
          }
        },
      },
    }
  )
}

/**
 * Get the current user session from server context
 */
export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting server session:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

/**
 * Get the current user from server context
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting server user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting server user:', error)
    return null
  }
} 