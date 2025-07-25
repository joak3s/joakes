'use client'

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/database"
import { SUPABASE_CONFIG } from "../config/supabase"

/**
 * Browser-safe Supabase client for admin client components
 * Uses the anonymous key for authentication and session management
 */
export const supabaseClient = createBrowserClient<Database>(
  SUPABASE_CONFIG.URL!,
  SUPABASE_CONFIG.ANON_KEY!
)

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Sign out user
 */
export async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: 'Failed to sign out' }
  }
} 