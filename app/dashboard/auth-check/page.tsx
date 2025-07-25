"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/database/supabase-browser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function AuthCheckPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [cookieInfo, setCookieInfo] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check session directly
      const { data, error: sessionError } = await supabaseClient.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }
      
      setSession(data.session)
      
      // Try to get cookie info
      getCookieInfo()
    } catch (err) {
      console.error("Auth check error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getCookieInfo = () => {
    try {
      // Get all cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=')
        acc[name] = value
        return acc
      }, {} as Record<string, string>)
      
      // Look for Supabase-related cookies
      const supabaseCookies = Object.keys(cookies)
        .filter(name => 
          name.includes('supabase') || 
          name.includes('auth') || 
          name.includes('sb-')
        )
        .reduce((acc, name) => {
          acc[name] = cookies[name] ? 
            `${cookies[name].substring(0, 10)}...` : 
            'No value'
          return acc
        }, {} as Record<string, string>)
      
      setCookieInfo({
        hasCookies: Object.keys(supabaseCookies).length > 0,
        cookieCount: Object.keys(supabaseCookies).length,
        cookieNames: Object.keys(supabaseCookies),
        cookieDetails: supabaseCookies
      })
    } catch (err) {
      console.error("Cookie check error:", err)
      setCookieInfo({
        error: err instanceof Error ? err.message : "Unknown error"
      })
    }
  }
  
  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabaseClient.auth.signOut()
      setSession(null)
      setCookieInfo(null)
      
      // Force reload to clear any cached state
      window.location.reload()
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Authentication Checker</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <Button 
              onClick={checkAuth} 
              variant="outline" 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Status
            </Button>
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error checking authentication</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Checking authentication status...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Authentication Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-medium">Authenticated</p>
                    </div>

                    <div className="rounded-md bg-muted p-4 text-sm space-y-2">
                      <p className="font-medium">User Info:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="truncate">{session.user.id}</span>
                        
                        <span className="text-muted-foreground">Email:</span>
                        <span>{session.user.email}</span>
                        
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{new Date(session.expires_at * 1000).toLocaleString()}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={signOut}
                          className="w-full"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-5 w-5" />
                      <p className="font-medium">Not authenticated</p>
                    </div>
                    
                    <div className="rounded-md bg-muted p-4 text-sm">
                      <p>No active session found. Try signing in again:</p>
                      <Button 
                        variant="outline" 
                        className="mt-2 w-full"
                        asChild
                      >
                        <Link href="/login?returnUrl=/dashboard/auth-check">
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookie Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                {cookieInfo ? (
                  <div className="space-y-4">
                    {cookieInfo.error ? (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Cookie check failed</AlertTitle>
                        <AlertDescription>{cookieInfo.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          {cookieInfo.hasCookies ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <p className="font-medium">
                            {cookieInfo.hasCookies
                              ? `Found ${cookieInfo.cookieCount} auth cookies`
                              : "No auth cookies found"}
                          </p>
                        </div>

                        {cookieInfo.hasCookies && (
                          <div className="rounded-md bg-muted p-4 text-sm space-y-2">
                            <p className="font-medium">Cookie Names:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {cookieInfo.cookieNames.map((name: string) => (
                                <li key={name} className="text-xs">
                                  <span className="font-mono">{name}</span>
                                  <span className="text-muted-foreground ml-2">
                                    = {cookieInfo.cookieDetails[name]}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-4 pt-2 border-t border-border">
                              <p className="font-medium">Cookie Format Analysis:</p>
                              <div className="mt-2">
                                {cookieInfo.cookieNames.some((name: string) => 
                                  cookieInfo.cookieDetails[name]?.includes('base64-')
                                ) ? (
                                  <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 p-2">
                                    <p className="text-xs">
                                      <strong>Base64 format detected</strong> - These cookies use the newer Supabase cookie format 
                                      starting with "base64-". This may require using the <code>@supabase/ssr</code> package 
                                      instead of <code>auth-helpers-nextjs</code>.
                                    </p>
                                  </Alert>
                                ) : (
                                  <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 p-2">
                                    <p className="text-xs">
                                      <strong>Standard format detected</strong> - These cookies appear to use the older JSON format
                                      compatible with <code>auth-helpers-nextjs</code>.
                                    </p>
                                  </Alert>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <Alert className="text-sm">
                      <AlertTitle>Debug Suggestion</AlertTitle>
                      <AlertDescription>
                        <p>
                          You are now using the standardized Supabase SSR implementation. 
                          All authentication should be properly working with the base64 cookie format.
                        </p>
                        <p className="mt-2">
                          If you're still experiencing issues:
                        </p>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                          <li>Clear your browser cookies and sign in again</li>
                          <li>Check that environment variables are correctly set</li>
                          <li>Verify that Supabase is correctly configured in your project</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="flex justify-center py-6">
                    <p className="text-muted-foreground">No cookie information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 