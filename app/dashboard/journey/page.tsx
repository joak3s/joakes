"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Edit, Trash2, X, Upload, Image as ImageIcon, MoreHorizontal, Map, Calendar, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabaseClient } from "@/lib/database/supabase-browser"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Import types from database
import type { Database } from '@/lib/types/database'

// Define our local types based on database types
type JourneyEntry = Database['public']['Tables']['journey']['Row'] & {
  images?: Database['public']['Tables']['journey_images']['Row'][];
}

interface JourneyFormState {
  id?: string;
  title: string;
  subtitle?: string;
  year: string;
  description: string;
  skills: string[];
  icon: string;
  color: string;
  display_order: number;
  images?: { url: string; alt_text?: string; order_index: number }[];
}

export default function JourneyPage() {
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<JourneyFormState>({
    title: '',
    year: '',
    description: '',
    skills: [],
    icon: '',
    color: '#3B82F6',
    display_order: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [skillInput, setSkillInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<JourneyEntry | null>(null)

  // Fetch journey entries
  useEffect(() => {
    fetchJourneyEntries()
  }, [])

  const fetchJourneyEntries = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabaseClient
        .from('journey')
        .select(`
          *,
          images:journey_images(*)
        `)
        .order('display_order', { ascending: true })

      if (fetchError) throw fetchError

      setJourneyEntries(data || [])
    } catch (err) {
      console.error("Error fetching journey entries:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch journey entries")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch journey entries."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentEntry({
      title: '',
      year: '',
      description: '',
      skills: [],
      icon: '',
      color: '#3B82F6',
      display_order: 0
    })
    setSkillInput('')
    setActiveTab("general")
  }

  const handleCreate = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (entry: JourneyEntry) => {
    setCurrentEntry({
      id: entry.id,
      title: entry.title,
      subtitle: entry.subtitle || '',
      year: entry.year,
      description: entry.description,
      skills: entry.skills || [],
      icon: entry.icon,
      color: entry.color,
      display_order: entry.display_order,
      images: entry.images?.map(img => ({
        url: img.url,
        alt_text: img.alt_text || '',
        order_index: img.order_index || 0
      })) || []
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!currentEntry.title || !currentEntry.year || !currentEntry.description || !currentEntry.icon || !currentEntry.color) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill out all required fields."
        })
        return
      }

      if (currentEntry.id) {
        // Update existing entry
        const { updateJourneyEntry } = await import('@/app/actions/journey-milestone')
        const result = await updateJourneyEntry(currentEntry.id, {
          title: currentEntry.title,
          subtitle: currentEntry.subtitle,
          year: currentEntry.year,
          description: currentEntry.description,
          skills: currentEntry.skills,
          icon: currentEntry.icon,
          color: currentEntry.color,
          display_order: currentEntry.display_order
        })

        if (!result.success) {
          throw new Error(result.error || 'Update failed')
        }

        toast({
          title: "Success",
          description: "Journey entry updated successfully."
        })
      } else {
        // Create new entry
        const { createJourneyEntry } = await import('@/app/actions/journey-milestone')
        const result = await createJourneyEntry({
          title: currentEntry.title,
          subtitle: currentEntry.subtitle,
          year: currentEntry.year,
          description: currentEntry.description,
          skills: currentEntry.skills,
          icon: currentEntry.icon,
          color: currentEntry.color,
          display_order: currentEntry.display_order
        })

        if (!result.success) {
          throw new Error(result.error || 'Creation failed')
        }

        toast({
          title: "Success",
          description: "Journey entry created successfully."
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchJourneyEntries()
    } catch (err) {
      console.error("Error saving journey entry:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save journey entry."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (entry: JourneyEntry) => {
    setEntryToDelete(entry)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!entryToDelete) return

    try {
      setIsDeleting(true)

      const { deleteJourneyEntry } = await import('@/app/actions/journey-milestone')
      const result = await deleteJourneyEntry(entryToDelete.id)

      if (!result.success) {
        throw new Error(result.error || 'Delete failed')
      }

      toast({
        title: "Success",
        description: "Journey entry deleted successfully."
      })

      fetchJourneyEntries()
      setDeleteConfirmOpen(false)
      setEntryToDelete(null)
    } catch (err) {
      console.error("Error deleting journey entry:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete journey entry."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentEntry.skills.includes(skillInput.trim())) {
      handleInputChange('skills', [...currentEntry.skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    handleInputChange('skills', currentEntry.skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading journey entries...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Journey Management</h1>
            <p className="text-muted-foreground">Manage your professional journey timeline and milestones.</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Journey Entry
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journeyEntries.length}</div>
              <p className="text-xs text-muted-foreground">Journey milestones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Years Covered</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journeyEntries.length > 0 
                  ? Math.max(...journeyEntries.map(e => parseInt(e.year))) - Math.min(...journeyEntries.map(e => parseInt(e.year))) + 1
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {journeyEntries.length > 0 
                  ? `${Math.min(...journeyEntries.map(e => parseInt(e.year)))} - ${Math.max(...journeyEntries.map(e => parseInt(e.year)))}`
                  : 'No entries'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
              <Badge className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journeyEntries.reduce((total, entry) => total + (entry.skills?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journeyEntries.reduce((total, entry) => total + (entry.images?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Supporting visuals</p>
            </CardContent>
          </Card>
        </div>

        {journeyEntries.length === 0 && !isLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-12">
                <p className="mb-6 text-muted-foreground">No journey entries found.</p>
                <Button onClick={handleCreate}>Create Your First Journey Entry</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journeyEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: entry.color }}
                          >
                            {entry.icon}
                          </div>
                          <div>
                            <div className="font-medium">{entry.title}</div>
                            {entry.subtitle && (
                              <div className="text-sm text-muted-foreground">{entry.subtitle}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{entry.year}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {entry.skills?.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {entry.skills && entry.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{entry.display_order}</TableCell>
                      <TableCell>{entry.images?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(entry)}
                            title="Edit entry"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(entry)}
                            title="Delete entry"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 md:hidden gap-4">
              {journeyEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: entry.color }}
                        >
                          {entry.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{entry.title}</CardTitle>
                          <CardDescription>{entry.year}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(entry)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(entry)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
                    {entry.skills && entry.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentEntry.id ? "Edit Journey Entry" : "Create Journey Entry"}</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={currentEntry.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Senior Developer at TechCorp"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      value={currentEntry.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="e.g., 2023"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={currentEntry.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Optional subtitle or company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={currentEntry.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your role, achievements, and experiences"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon *</Label>
                    <Input
                      id="icon"
                      value={currentEntry.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      placeholder="e.g., 💼 or 🎓"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input
                      id="color"
                      type="color"
                      value={currentEntry.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={currentEntry.display_order}
                      onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Skills</Label>
                    <p className="text-sm text-muted-foreground mb-3">Add skills and technologies used</p>
                    
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a skill and press Enter"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddSkill} variant="outline">
                        Add
                      </Button>
                    </div>
                    
                    {currentEntry.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentEntry.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveSkill(skill)}
                              className="h-auto p-0 ml-1 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? (currentEntry.id ? 'Updating...' : 'Creating...') : (currentEntry.id ? 'Update Entry' : 'Create Entry')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Journey Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{entryToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  )
} 