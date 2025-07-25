"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Tool } from '@/lib/types/tool'
import { Edit, Trash2, Plus, AlertCircle, Loader2, X, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { supabaseClient } from "@/lib/database/supabase-browser"
import { cn } from "@/lib/utils"

export default function ToolsAdminPage() {
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>([])
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newToolName, setNewToolName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabaseClient
        .from('tools')
        .select('*')
        .order('name')

      if (fetchError) throw fetchError
      
      // Ensure required fields are present in the tool data
      const typedTools = (data || []).map((tool: any) => ({
        ...tool,
        slug: tool.slug || tool.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        show_in_filter: tool.show_in_filter || false
      })) as Tool[]
      
      setTools(typedTools)
    } catch (error) {
      console.error("Error fetching tools:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch tools")
      toast({ title: "Error", description: "Failed to fetch tools", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTool = async () => {
    if (!newToolName.trim()) return

    try {
      setIsSaving(true)
      const slug = newToolName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newToolName.trim(),
          slug: slug,
          show_in_filter: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create tool (${response.status})`)
      }

      const newTool = await response.json()
      setTools(prev => [...prev, newTool])
      setNewToolName("")
      
      toast({
        title: "Success",
        description: `Tool "${newToolName.trim()}" has been created.`,
      })
    } catch (error) {
      console.error("Error creating tool:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tool",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveTool = async () => {
    if (!selectedTool) return

    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/admin/tools?id=${selectedTool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedTool.name,
          slug: selectedTool.slug,
          show_in_filter: selectedTool.show_in_filter
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update tool (${response.status})`)
      }

      const updatedTool = await response.json()
      
      setTools(tools.map(tool => 
        tool.id === updatedTool.id ? updatedTool : tool
      ))
      
      setIsDialogOpen(false)
      
      toast({
        title: "Success",
        description: `Tool "${updatedTool.name}" has been updated.`,
      })
    } catch (error) {
      console.error("Error updating tool:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tool",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return

    try {
      const response = await fetch(`/api/admin/tools?id=${toolId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete tool")
      }

      setTools(tools.filter(tool => tool.id !== toolId))
      
      toast({
        title: "Success",
        description: "Tool has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete tool",
        variant: "destructive"
      })
    }
  }

  const handleToggleFilter = async (toolId: string, show: boolean) => {
    try {
      const response = await fetch(`/api/admin/tools?id=${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_in_filter: show
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update tool filter status (${response.status})`)
      }
      
      const updatedTool = await response.json()
      
      // Update the local state to reflect the change
      setTools(tools.map(tool => 
        tool.id === toolId ? { ...tool, show_in_filter: show } : tool
      ))
      
      toast({
        title: show ? "Added to filters" : "Removed from filters",
        description: `Tool will ${show ? 'now' : 'no longer'} appear in work page filters.`,
      })
    } catch (error) {
      console.error('Error updating tool filter status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tool filter status",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading tools...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Tools Management</h1>
            <p className="text-muted-foreground">Manage the tools used in your projects.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Add new tool */}
          <div className="bg-card rounded-lg border-border p-4">
            <h2 className="text-lg font-medium mb-4">Add New Tool</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Input
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="Enter tool name (e.g. React, TypeScript, Figma)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleCreateTool()
                    }
                  }}
                />
              </div>
              <Button onClick={handleCreateTool} disabled={!newToolName.trim() || isSaving}>
                <Plus className="mr-2 h-4 w-4" /> Add Tool
              </Button>
            </div>
          </div>

          {/* Tools list */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-medium">All Tools</h2>
              <p className="text-sm text-muted-foreground">
                {tools.length} {tools.length === 1 ? 'tool' : 'tools'} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-center">Show in Filters</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No tools found. Add a new tool above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">{tool.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {tool.slug}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={tool.show_in_filter || false}
                              onCheckedChange={(checked) => handleToggleFilter(tool.id, checked)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTool(tool)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteTool(tool.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Edit tool dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Tool</DialogTitle>
            </DialogHeader>
            {selectedTool && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedTool.name}
                    onChange={(e) => setSelectedTool({ ...selectedTool, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={selectedTool.slug}
                    onChange={(e) => setSelectedTool({ ...selectedTool, slug: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs and for filtering. Should contain only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-in-filter" className="mr-2">Show in Filters</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      When enabled, this tool will appear in the work page filters.
                    </p>
                  </div>
                  <Switch
                    id="show-in-filter"
                    checked={selectedTool.show_in_filter || false}
                    onCheckedChange={(checked) => setSelectedTool({ ...selectedTool, show_in_filter: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveTool} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
