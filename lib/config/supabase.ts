/**
 * Supabase configuration for admin app
 * Centralized configuration for all Supabase clients
 */

export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Cookie configuration
  COOKIE_NAME: 'sb-admin-auth-token',
  COOKIE_OPTIONS: {
    name: 'sb-admin-auth-token',
    lifetime: 60 * 60 * 24 * 7, // 7 days
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
}

/**
 * Validates that all required Supabase environment variables are present
 * Throws an error if any required variables are missing
 */
export function validateSupabaseConfig() {
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': SUPABASE_CONFIG.URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': SUPABASE_CONFIG.ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': SUPABASE_CONFIG.SERVICE_ROLE_KEY,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }

  // Validate URL format
  if (SUPABASE_CONFIG.URL && !SUPABASE_CONFIG.URL.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL')
  }

  console.log('✅ Supabase configuration validated successfully')
} 