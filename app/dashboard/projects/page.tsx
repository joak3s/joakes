"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Edit, Trash2, X, ArrowLeft, Upload, Image as ImageIcon, MoreHorizontal, Check, FolderKanban, GripVertical, Move } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabaseClient } from "@/lib/database/supabase-browser"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Import types from database
import type { Database } from '@/lib/types/database'

// Define our local types based on database types
type LocalProject = Database['public']['Tables']['projects']['Row'] & {
  project_images?: Database['public']['Tables']['project_images']['Row'][];
  tools?: Database['public']['Tables']['tools']['Row'][];
  tags?: Database['public']['Tables']['tags']['Row'][];
}

type Tool = Database['public']['Tables']['tools']['Row']
type Tag = Database['public']['Tables']['tags']['Row']

interface ProjectFormState {
  id?: string;
  title: string;
  slug: string;
  description: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  results?: string;
  summary?: string;
  featured_order: number;
  status?: 'draft' | 'published';
  website_url?: string;
  priority?: number;
  images?: { url: string; alt_text?: string; order_index: number }[];
  tool_ids?: string[];
  tag_ids?: string[];
  tools?: Tool[];
  tags: Tag[];
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<LocalProject[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<ProjectFormState>({
    title: '',
    slug: '',
    description: '',
    featured_order: 0,
    tags: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<LocalProject | null>(null)

  // Fetch data
  useEffect(() => {
    fetchProjects()
    fetchTools()
    fetchTags()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabaseClient
        .from('projects')
        .select(`
          *,
          project_images(*),
          project_tools(tools(*)),
          project_tags(tags(*))
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Transform the data to match our expected format
      const transformedProjects = data?.map(project => ({
        ...project,
        tools: project.project_tools?.map((pt: any) => pt.tools).filter(Boolean) || [],
        tags: project.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
      })) || []

      setProjects(transformedProjects)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch projects")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch projects."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTools = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('tools')
        .select('*')
        .order('name')

      if (error) throw error
      setTools(data || [])
    } catch (err) {
      console.error("Error fetching tools:", err)
    }
  }

  const fetchTags = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('tags')
        .select('*')
        .order('name')

      if (error) throw error
      setTags(data || [])
    } catch (err) {
      console.error("Error fetching tags:", err)
    }
  }

  const resetForm = () => {
    setCurrentProject({
      title: '',
      slug: '',
      description: '',
      featured_order: 0,
      tags: []
    })
    setActiveTab("general")
  }

  const handleCreate = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (project: LocalProject) => {
    setCurrentProject({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      challenge: project.challenge || '',
      approach: project.approach || '',
      solution: project.solution || '',
      results: project.results || '',
      summary: project.summary || '',
      featured_order: project.featured_order || 0,
      status: (project.status as 'draft' | 'published') || 'draft',
      website_url: project.website_url || '',
      priority: project.priority || 0,
      images: project.project_images?.map(img => ({
        url: img.url,
        alt_text: img.alt_text || '',
        order_index: img.order_index || 0
      })) || [],
      tools: project.tools || [],
      tags: project.tags || [],
      tool_ids: project.tools?.map(t => t.id) || [],
      tag_ids: project.tags?.map(t => t.id) || []
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!currentProject.title || !currentProject.slug || !currentProject.description) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill out all required fields."
        })
        return
      }

      const projectData = {
        title: currentProject.title,
        slug: currentProject.slug,
        description: currentProject.description,
        challenge: currentProject.challenge || null,
        approach: currentProject.approach || null,
        solution: currentProject.solution || null,
        results: currentProject.results || null,
        summary: currentProject.summary || null,
        featured_order: currentProject.featured_order || null,
        status: currentProject.status || 'draft',
        website_url: currentProject.website_url || null,
        priority: currentProject.priority || null
      }

      if (currentProject.id) {
        // Update existing project
        const { error } = await supabaseClient
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Project updated successfully."
        })
      } else {
        // Create new project
        const { error } = await supabaseClient
          .from('projects')
          .insert([projectData])

        if (error) throw error

        toast({
          title: "Success",
          description: "Project created successfully."
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchProjects()
    } catch (err) {
      console.error("Error saving project:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save project."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (project: LocalProject) => {
    setProjectToDelete(project)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return

    try {
      setIsDeleting(true)

      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Project deleted successfully."
      })

      fetchProjects()
      setDeleteConfirmOpen(false)
      setProjectToDelete(null)
    } catch (err) {
      console.error("Error deleting project:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete project."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setCurrentProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value)
    if (!currentProject.id) {
      handleInputChange('slug', generateSlug(value))
    }
  }

  // Image handling functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !currentProject.id) return

    try {
      const formData = new FormData()
      formData.append('projectId', currentProject.id)
      
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      // Import the upload function dynamically
      const { uploadProjectImages } = await import('@/app/actions/upload-image')
      const result = await uploadProjectImages(formData)

      if (result.success && result.images) {
        // Update the current project with new images
        const newImages = result.images.map(img => ({
          url: img.url,
          alt_text: img.alt_text || '',
          order_index: img.order_index || 0
        }))
        
        handleInputChange('images', [...(currentProject.images || []), ...newImages])
        
        toast({
          title: "Success",
          description: `${result.images.length} image(s) uploaded successfully.`
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload images."
      })
    }

    // Clear the input
    event.target.value = ''
  }

  const handleImageDelete = async (index: number) => {
    if (!currentProject.images || !currentProject.images[index]) return

    try {
      const imageToDelete = currentProject.images[index]
      
      // If this is an existing image with an ID, delete from server
      if (currentProject.id && imageToDelete.url) {
        // For now, just remove from local state
        // In a real implementation, you'd call deleteProjectImage with the image ID
        const updatedImages = currentProject.images.filter((_, i) => i !== index)
        handleInputChange('images', updatedImages)
        
        toast({
          title: "Success",
          description: "Image removed successfully."
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: "Failed to remove image."
      })
    }
  }

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    if (!currentProject.images) return

    const updatedImages = [...currentProject.images]
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    updatedImages.splice(toIndex, 0, movedImage)

    // Update order indices
    updatedImages.forEach((img, i) => {
      img.order_index = i
    })

    handleInputChange('images', updatedImages)
  }

  const handleImageAltUpdate = (index: number, altText: string) => {
    if (!currentProject.images) return

    const updatedImages = [...currentProject.images]
    updatedImages[index] = { ...updatedImages[index], alt_text: altText }
    handleInputChange('images', updatedImages)
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects.</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {projects.length === 0 && !isLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-12">
                <p className="mb-6 text-muted-foreground">No projects found.</p>
                <Button onClick={handleCreate}>Create Your First Project</Button>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Featured Order</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-muted-foreground">{project.slug}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                          {project.status || 'draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.featured_order || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.tools?.slice(0, 2).map((tool) => (
                            <Badge key={tool.id} variant="outline" className="text-xs">
                              {tool.name}
                            </Badge>
                          ))}
                          {project.tools && project.tools.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tools.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                          {project.tags && project.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(project)}
                            title="Delete project"
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
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.slug}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                          {project.status || 'draft'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(project)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(project)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    {project.tools && project.tools.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Tools:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tools.map((tool) => (
                            <Badge key={tool.id} variant="outline" className="text-xs">
                              {tool.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
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
              <DialogTitle>{currentProject.id ? "Edit Project" : "Create Project"}</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={currentProject.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., E-commerce Dashboard"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={currentProject.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="e.g., ecommerce-dashboard"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={currentProject.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the project"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      value={currentProject.website_url || ''}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={currentProject.status || 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="featured_order">Featured Order</Label>
                    <Input
                      id="featured_order"
                      type="number"
                      value={currentProject.featured_order}
                      onChange={(e) => handleInputChange('featured_order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={currentProject.priority || 0}
                      onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={currentProject.summary || ''}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief project summary"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">Challenge</Label>
                  <Textarea
                    id="challenge"
                    value={currentProject.challenge || ''}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    placeholder="What problem did this project solve?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approach">Approach</Label>
                  <Textarea
                    id="approach"
                    value={currentProject.approach || ''}
                    onChange={(e) => handleInputChange('approach', e.target.value)}
                    placeholder="How did you approach solving this problem?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea
                    id="solution"
                    value={currentProject.solution || ''}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="What was your solution?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Results</Label>
                  <Textarea
                    id="results"
                    value={currentProject.results || ''}
                    onChange={(e) => handleInputChange('results', e.target.value)}
                    placeholder="What were the outcomes and impact?"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Project Images</Label>
                    <p className="text-sm text-muted-foreground mb-3">Upload and manage images for this project</p>
                    
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">Upload images</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB each</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2"
                        >
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image Previews */}
                    {currentProject.images && currentProject.images.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium mb-2 block">Current Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(currentProject.images || [])
                            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                            .map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                                <Image
                                  src={image.url}
                                  alt={image.alt_text || 'Project image'}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleImageDelete(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-1">
                                  {index > 0 && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleImageReorder(index, index - 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <ArrowLeft className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {index < (currentProject.images || []).length - 1 && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleImageReorder(index, index + 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <ArrowLeft className="h-3 w-3 rotate-180" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="mt-1">
                                <Input
                                  placeholder="Alt text"
                                  value={image.alt_text || ''}
                                  onChange={(e) => handleImageAltUpdate(index, e.target.value)}
                                  className="text-xs h-7"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meta" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Tools</Label>
                    <p className="text-sm text-muted-foreground mb-3">Technologies and tools used in this project</p>
                    <div className="space-y-2">
                      {tools.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                          {tools.map((tool) => {
                            const isSelected = currentProject.tool_ids?.includes(tool.id) || false
                            return (
                              <label key={tool.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const toolIds = currentProject.tool_ids || []
                                    const newToolIds = e.target.checked
                                      ? [...toolIds, tool.id]
                                      : toolIds.filter(id => id !== tool.id)
                                    
                                    const selectedTools = tools.filter(t => newToolIds.includes(t.id))
                                    
                                    handleInputChange('tool_ids', newToolIds)
                                    handleInputChange('tools', selectedTools)
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{tool.name}</span>
                              </label>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tools available. Create some tools first.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Tags</Label>
                    <p className="text-sm text-muted-foreground mb-3">Categories and labels for this project</p>
                    <div className="space-y-2">
                      {tags.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                          {tags.map((tag) => {
                            const isSelected = currentProject.tag_ids?.includes(tag.id) || false
                            return (
                              <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const tagIds = currentProject.tag_ids || []
                                    const newTagIds = e.target.checked
                                      ? [...tagIds, tag.id]
                                      : tagIds.filter(id => id !== tag.id)
                                    
                                    const selectedTags = tags.filter(t => newTagIds.includes(t.id))
                                    
                                    handleInputChange('tag_ids', newTagIds)
                                    handleInputChange('tags', selectedTags)
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{tag.name}</span>
                              </label>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags available. Create some tags first.</p>
                      )}
                    </div>
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
                {isSubmitting ? (currentProject.id ? 'Updating...' : 'Creating...') : (currentProject.id ? 'Update Project' : 'Create Project')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
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