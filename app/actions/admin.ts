'use server'

import { revalidatePath } from 'next/cache'
import { getAdminClient } from '@/lib/database/supabase-admin'
import type { Database } from '@/lib/types/database'
import type { 
  CreateJourneyInput, 
  UpdateJourneyInput,
  AddJourneyImageInput 
} from '@/lib/types/journey'
import { 
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  mapDatabaseToProject
} from '@/lib/types/project'
import { createErrorResponse, createSuccessResponse, type ActionResponse, handleActionError } from '@/lib/error-utils'

// Type definitions
type JourneyEntry = Database['public']['Tables']['journey']['Row'] & {
  journey_images?: Database['public']['Tables']['journey_images']['Row'][];
}

/**
 * PROJECTS
 */

// Get all projects with images, tools, and tags
export async function getProjects(): Promise<ActionResponse<Project[]>> {
  try {
    const supabase = await getAdminClient()
    
    // Log the query attempt
    console.log('Attempting to fetch projects from database...')
    
    // First check if the table exists with a simple count query
    const { data: tableCheck, error: tableError } = await supabase
      .from('projects')
      .select('count(*)', { count: 'exact', head: true })
    
    if (tableError) {
      console.error('Error checking projects table:', tableError)
      return await createErrorResponse('Error verifying projects table exists', {
        error: tableError.message,
        status: 500,
        details: tableError
      })
    }
    
    // Then perform the full query with relations
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (*),
        project_tools (*, tools(*)),
        project_tags (*, tags(*))
      `)
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching projects data:', error)
      throw error
    }
    
    if (!data || data.length === 0) {
      console.log('No projects found in database')
      return await createSuccessResponse([])
    }
    
    // Safe mapping with additional error handling
    const projects = await Promise.all((data || []).map(async (project) => {
      try {
        return mapDatabaseToProject(project as any)
      } catch (mapError) {
        console.error(`Error mapping project ${project.id}:`, mapError)
        // Return a minimal valid project object instead of failing completely
        return {
          id: project.id,
          title: project.title || 'Untitled Project',
          slug: project.slug || `project-${project.id}`,
          description: project.description || '',
          approach: project.approach || null,
          challenge: project.challenge || null,
          solution: project.solution || null,
          results: project.results || null,
          summary: project.summary || null,
          created_at: project.created_at,
          updated_at: project.updated_at || null,
          featured_order: project.featured_order || null,
          status: project.status || null,
          website_url: project.website_url || null,
          priority: project.priority || null,
          project_images: [],
          tools: [],
          tags: []
        } as Project
      }
    }))
    
    console.log(`Successfully fetched ${projects.length} projects`)
    return await createSuccessResponse(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return await handleActionError(error, 'Failed to fetch projects')
  }
}

// Get a specific project by slug
export async function getProjectBySlug(slug: string): Promise<ActionResponse<Project>> {
  try {
    const supabase = await getAdminClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (*),
        project_tools (*, tools(*)),
        project_tags (*, tags(*))
      `)
      .eq('slug', slug)
      .single()
      
    if (error) throw error
    
    if (!data) {
      return await createErrorResponse(`Project with slug "${slug}" not found`, {
        error: 'NotFound',
        status: 404
      })
    }
    
    // Map database result to our Project type
    const project = mapDatabaseToProject(data as any)
    
    return await createSuccessResponse(project)
  } catch (error) {
    return await handleActionError(error, `Failed to fetch project with slug ${slug}`)
  }
}

// Update a project
export async function updateProject(id: string, projectData: UpdateProjectInput): Promise<ActionResponse<{success: boolean}>> {
  try {
    const supabase = await getAdminClient()
    
    // Extract database-specific fields and project metadata
    const { 
      images, tool_ids, tag_ids, 
      // Handle any additional properties that might be in the project data
      ...otherProps 
    } = projectData as UpdateProjectInput & { 
      tools?: any[]; 
      tags?: any[]; 
      project_images?: any[]; 
      featuredImage?: string;
      website_url?: string | null;
      challenge?: string | null;
      approach?: string | null;
      solution?: string | null;
      results?: string | null;
      priority?: number | null;
    }
    
    // Only include fields that belong in the database schema
    const dbProjectData = Object.entries(otherProps).reduce((acc, [key, value]) => {
      const validKeys = ['id', 'title', 'slug', 'subtitle', 'description', 'long_description', 
                          'featured', 'github_url', 'live_url', 'display_order', 'summary',
                          'challenge', 'approach', 'solution', 'results', 'featured_order',
                          'status', 'website_url', 'priority'];
      if (validKeys.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Update the basic project data
    const { error } = await supabase
      .from('projects')
      .update(dbProjectData)
      .eq('id', id)
      
    if (error) throw error
    
    // Handle image updates if provided
    if (images && images.length > 0) {
      // First delete existing images if replacing them
      // This is just an example - you might want a more sophisticated approach
      await supabase.from('project_images').delete().eq('project_id', id)
      
      // Then insert the new images
      await supabase.from('project_images').insert(
        images.map((img: any, index: number) => ({
          project_id: id,
          url: img.url,
          alt_text: img.alt_text || null,
          order_index: img.order_index || index,
          is_cover: index === 0 // First image is cover by default
        }))
      )
    }
    
    // Handle tool associations if provided
    if (tool_ids && tool_ids.length > 0) {
      // First delete existing associations
      await supabase.from('project_tools').delete().eq('project_id', id)
      
      // Then insert new associations
      await supabase.from('project_tools').insert(
        tool_ids.map((tool_id: string) => ({
          project_id: id,
          tool_id
        }))
      )
    }
    
    // Handle tag associations if provided
    if (tag_ids && tag_ids.length > 0) {
      // First delete existing associations
      await supabase.from('project_tags').delete().eq('project_id', id)
      
      // Then insert new associations
      await supabase.from('project_tags').insert(
        tag_ids.map((tag_id: string) => ({
          project_id: id,
          tag_id
        }))
      )
    }
    
    revalidatePath('/admin')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    revalidatePath(`/projects/${projectData.slug}`)
    
    return await createSuccessResponse({ success: true }, 'Project updated successfully')
  } catch (error) {
    return await handleActionError(error, 'Failed to update project')
  }
}

// Create a new project
export async function createProject(projectData: CreateProjectInput) {
  try {
    const supabase = await getAdminClient()
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select('*')
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    
    return data[0] || null
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

// Delete a project
export async function deleteProject(id: string) {
  try {
    const supabase = await getAdminClient()
    
    // First delete related records
    await supabase.from('project_images').delete().eq('project_id', id)
    await supabase.from('project_tools').delete().eq('project_id', id)
    await supabase.from('project_tags').delete().eq('project_id', id)
    
    // Then delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}

/**
 * JOURNEY ENTRIES
 */

// Get all journey entries with their images
export async function getJourneyEntries() {
  try {
    const supabase = await getAdminClient()
    
    // Fetch journey entries
    const { data: journeyData, error: journeyError } = await supabase
      .from('journey')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (journeyError) throw journeyError
    
    // If no journeys, return empty array
    if (!journeyData || journeyData.length === 0) {
      return []
    }
    
    // Get IDs to fetch images
    const journeyIds = journeyData.map(entry => entry.id)
    
    // Fetch images for all journey entries
    const { data: imagesData, error: imagesError } = await supabase
      .from('journey_images')
      .select('*')
      .in('journey_id', journeyIds)
      .order('order_index', { ascending: true })
    
    if (imagesError) throw imagesError
    
    // Group images by journey_id
    const imagesByJourneyId = (imagesData || []).reduce((acc, image) => {
      if (!acc[image.journey_id]) {
        acc[image.journey_id] = []
      }
      acc[image.journey_id].push(image)
      return acc
    }, {} as Record<string, any[]>)
    
    // Combine journey entries with their images
    const entriesWithImages = journeyData.map(entry => ({
      ...entry,
      journey_images: imagesByJourneyId[entry.id] || []
    }))
    
    return entriesWithImages as JourneyEntry[]
  } catch (error) {
    console.error('Error fetching journey entries:', error)
    throw new Error('Failed to fetch journey entries')
  }
}

// Get a single journey entry by ID
export async function getJourneyEntry(id: string) {
  try {
    const supabase = await getAdminClient()
    
    // Fetch journey entry
    const { data, error } = await supabase
      .from('journey')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    // Fetch images for this journey entry
    const { data: imagesData, error: imagesError } = await supabase
      .from('journey_images')
      .select('*')
      .eq('journey_id', id)
      .order('order_index', { ascending: true })
    
    if (imagesError) throw imagesError
    
    // Return journey with images
    return {
      ...data,
      journey_images: imagesData || []
    } as JourneyEntry
  } catch (error) {
    console.error(`Error fetching journey entry with ID ${id}:`, error)
    throw new Error('Failed to fetch journey entry')
  }
}

// Create a new journey entry
export async function createJourneyEntry(journeyData: CreateJourneyInput) {
  try {
    const supabase = await getAdminClient()
    
    const { data, error } = await supabase
      .from('journey')
      .insert([journeyData])
      .select('*')
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return data[0] || null
  } catch (error) {
    console.error('Error creating journey entry:', error)
    throw new Error('Failed to create journey entry')
  }
}

// Update a journey entry
export async function updateJourneyEntry(journeyData: UpdateJourneyInput) {
  try {
    const supabase = await getAdminClient()
    const { id, ...updateData } = journeyData
    
    const { error } = await supabase
      .from('journey')
      .update(updateData)
      .eq('id', id)
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating journey entry:', error)
    throw new Error('Failed to update journey entry')
  }
}

// Delete a journey entry
export async function deleteJourneyEntry(id: string) {
  try {
    const supabase = await getAdminClient()
    
    // First delete related images
    await supabase
      .from('journey_images')
      .delete()
      .eq('journey_id', id)
    
    // Then delete the journey entry
    const { error } = await supabase
      .from('journey')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting journey entry:', error)
    throw new Error('Failed to delete journey entry')
  }
}

/**
 * JOURNEY IMAGES
 */

// Add an image to a journey entry
export async function addJourneyImage(imageData: AddJourneyImageInput) {
  try {
    const supabase = await getAdminClient()
    
    // If no order_index provided, get the highest existing one and add 1
    if (imageData.order_index === undefined) {
      const { data: existingImages, error: fetchError } = await supabase
        .from('journey_images')
        .select('order_index')
        .eq('journey_id', imageData.journey_id)
        .order('order_index', { ascending: false })
        .limit(1)
      
      if (fetchError) throw fetchError
      
      const nextOrderIndex = existingImages && existingImages.length > 0
        ? (existingImages[0].order_index || 0) + 1
        : 1
      
      imageData.order_index = nextOrderIndex
    }
    
    // Cast the data to the database schema type to ensure compatibility
    const dataToInsert = {
      journey_id: imageData.journey_id,
      url: imageData.url,
      alt_text: imageData.alt_text,
      order_index: imageData.order_index
    }
    
    const { data, error } = await supabase
      .from('journey_images')
      .insert([dataToInsert])
      .select('*')
      
    if (error) throw error
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return data[0] || null
  } catch (error) {
    console.error('Error adding journey image:', error)
    throw new Error('Failed to add journey image')
  }
}

// Delete a journey image
export async function deleteJourneyImage(imageId: string, journeyId: string) {
  try {
    const supabase = await getAdminClient()
    
    // Delete the image
    const { error } = await supabase
      .from('journey_images')
      .delete()
      .eq('id', imageId)
      
    if (error) throw error
    
    // Reorder remaining images
    await reorderJourneyImages(journeyId)
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting journey image:', error)
    throw new Error('Failed to delete journey image')
  }
}

// Helper function to reorder images after deletion or manual reordering
async function reorderJourneyImages(journeyId: string) {
  try {
    const supabase = await getAdminClient()
    
    // Get all images for this journey, ordered by current order_index
    const { data: images, error } = await supabase
      .from('journey_images')
      .select('*')
      .eq('journey_id', journeyId)
      .order('order_index', { ascending: true })
      
    if (error) throw error
    
    // Update each image with a new sequential order_index
    for (let i = 0; i < (images || []).length; i++) {
      const { error: updateError } = await supabase
        .from('journey_images')
        .update({ order_index: i + 1 })
        .eq('id', images[i].id)
        
      if (updateError) throw updateError
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error reordering journey images:', error)
    throw new Error('Failed to reorder journey images')
  }
}

// Update the order of journey images based on a provided array of image IDs
export async function updateJourneyImageOrder(journeyId: string, imageIds: string[]) {
  try {
    const supabase = await getAdminClient()
    
    // Update each image with its new order_index
    for (let i = 0; i < imageIds.length; i++) {
      const { error } = await supabase
        .from('journey_images')
        .update({ order_index: i + 1 })
        .eq('id', imageIds[i])
        .eq('journey_id', journeyId)
        
      if (error) throw error
    }
    
    revalidatePath('/admin')
    revalidatePath('/admin/journey')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating journey image order:', error)
    throw new Error('Failed to update journey image order')
  }
}

/**
 * Upload a file to Supabase Storage using admin privileges
 */
export async function uploadJourneyImage(fileBuffer: ArrayBuffer, fileName: string, contentType: string) {
  try {
    const supabase = await getAdminClient();
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `journey/${timestamp}-${uniqueId}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('journey-images')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('journey-images')
      .getPublicUrl(data.path);
    
    return { 
      path: data.path, 
      url: urlData.publicUrl 
    };
  } catch (error) {
    console.error('Error in uploadJourneyImage:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error during upload');
  }
}

/**
 * Upload a project image to Supabase Storage using admin privileges
 */
export async function uploadProjectImage(fileBuffer: ArrayBuffer, fileName: string, contentType: string) {
  try {
    const supabase = await getAdminClient();
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `projects/${timestamp}-${uniqueId}.${fileExt}`;
    
    console.log(`Uploading project image to storage: ${filePath}`);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType
      });
    
    if (error) {
      console.error('Error uploading project image:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path);
    
    console.log(`Project image uploaded successfully: ${urlData.publicUrl}`);
    
    return { 
      path: data.path, 
      url: urlData.publicUrl 
    };
  } catch (error) {
    console.error('Error in uploadProjectImage:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error during upload');
  }
} 