"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, MessageSquare, User, Bot, Clock, BarChart4, Eye, Filter, CalendarDays, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface ChatSession {
  id: string
  title: string
  created_at: string
  last_updated: string
  message_count: number
}

interface SessionMessage {
  id: string
  message_type: 'user' | 'assistant'
  content: string
  sequence_number: number
  created_at: string
  metadata?: any
  search_results?: any
  message_contexts?: any[]
}

interface ChatAnalytics {
  sessions: ChatSession[]
  messageStats: {
    totalMessages: number
    userMessages: number
    assistantMessages: number
    averageLength: number
  }
  recentMessages: any[]
  dailyCounts: { date: string; count: number }[]
  period: string
}

interface SessionDetails {
  session: any
  messages: SessionMessage[]
  stats: {
    totalMessages: number
    userMessages: number
    assistantMessages: number
    duration: number
    avgResponseTime: number
  }
}

export default function ChatPage() {
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedSession, setSelectedSession] = useState<SessionDetails | null>(null)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/chat-analytics?period=${selectedPeriod}&limit=100`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch chat analytics."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      setIsLoadingSession(true)
      
      const response = await fetch(`/api/admin/session-messages/${sessionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch session details')
      }
      
      const data = await response.json()
      setSelectedSession(data)
      setIsSessionDialogOpen(true)
    } catch (err) {
      console.error('Error fetching session details:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch session details."
      })
    } finally {
      setIsLoadingSession(false)
    }
  }

  const formatDuration = (milliseconds: number) => {
    if (milliseconds < 60000) {
      return `${Math.round(milliseconds / 1000)}s`
    } else if (milliseconds < 3600000) {
      return `${Math.round(milliseconds / 60000)}m`
    } else {
      return `${Math.round(milliseconds / 3600000)}h`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getFilteredAndSortedSessions = () => {
    if (!analytics?.sessions) return []

    let filtered = analytics.sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'message_count':
          aValue = a.message_count
          bValue = b.message_count
          break
        case 'last_updated':
          aValue = new Date(a.last_updated).getTime()
          bValue = new Date(b.last_updated).getTime()
          break
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading chat analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chat Analytics</h1>
            <p className="text-muted-foreground">Monitor and analyze chat interactions and AI responses.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.messageStats.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.messageStats.userMessages || 0} user, {analytics?.messageStats.assistantMessages || 0} assistant
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.sessions.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                In selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Message Length</CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.messageStats.averageLength || 0}</div>
              <p className="text-xs text-muted-foreground">
                Characters per message
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.dailyCounts ? Math.round(analytics.dailyCounts.reduce((sum, day) => sum + day.count, 0) / Math.max(analytics.dailyCounts.length, 1)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Sessions per day
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sessions">Chat Sessions</TabsTrigger>
            <TabsTrigger value="messages">Recent Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Chat Sessions</CardTitle>
                    <CardDescription>Recent chat interactions and their details</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Created Date</SelectItem>
                        <SelectItem value="last_updated">Last Updated</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="message_count">Message Count</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredAndSortedSessions().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No sessions found for the selected period.
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredAndSortedSessions().map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{session.title}</div>
                              <div className="text-sm text-muted-foreground">ID: {session.id.slice(0, 8)}...</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {session.message_count}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(session.created_at)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(session.last_updated)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fetchSessionDetails(session.id)}
                              disabled={isLoadingSession}
                            >
                              {isLoadingSession ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest messages across all sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentMessages.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No recent messages found.</p>
                  ) : (
                    analytics?.recentMessages.slice(0, 10).map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {message.message_type === 'user' ? (
                              <User className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Bot className="h-4 w-4 text-green-500" />
                            )}
                            <Badge variant={message.message_type === 'user' ? 'default' : 'secondary'}>
                              {message.message_type}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Session Details Dialog */}
        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription>
                {selectedSession?.session.title} - {selectedSession ? formatDate(selectedSession.session.created_at) : ''}
              </DialogDescription>
            </DialogHeader>
            
            {selectedSession && (
              <div className="space-y-4">
                {/* Session Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedSession.stats.totalMessages}</div>
                    <div className="text-xs text-muted-foreground">Total Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedSession.stats.userMessages}</div>
                    <div className="text-xs text-muted-foreground">User Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedSession.stats.assistantMessages}</div>
                    <div className="text-xs text-muted-foreground">AI Responses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatDuration(selectedSession.stats.duration)}</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h4 className="font-medium mb-4">Message History</h4>
                  <div className="space-y-3">
                    {selectedSession.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.message_type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${message.message_type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
} 