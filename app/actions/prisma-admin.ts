'use server'

import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Type definitions for project data
 */
interface ProjectTag {
  tags: {
    id: string;
    name: string;
    slug: string;
    created_at: Date;
    updated_at: Date | null;
  };
}

interface ProjectTool {
  tools: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    created_at: Date;
    updated_at: Date | null;
  };
}

interface ProjectWithRelations {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  summary: string | null;
  featured_order: number | null;
  status: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  project_images: {
    id: string;
    url: string;
    alt_text: string | null;
    order_index: number | null;
    project_id: string;
    created_at: Date | null;
    updated_at: Date | null;
  }[];
  project_tags: ProjectTag[];
  project_tools: ProjectTool[];
}

// Image input type
interface ImageInput {
  url: string;
  alt_text?: string;
  order_index?: number;
}

/**
 * PROJECTS
 */

// Get all projects with images, tools, and tags
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        },
        tools: {
          include: {
            tool: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    // Transform data to match your current format
    return projects.map((project) => ({
      ...project,
      tags: project.tags.map(pt => pt.tag),
      tools: project.tools.map(pt => pt.tool)
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }
}

// Get a specific project by slug
export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        },
        tools: {
          include: {
            tool: true
          }
        }
      }
    })
    
    if (!project) return null
    
    // Transform data to match your current format
    return {
      ...project,
      tags: project.tags.map(pt => pt.tag),
      tools: project.tools.map(pt => pt.tool)
    }
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    throw new Error('Failed to fetch project')
  }
}

// Update a project
export async function updateProject(id: string, projectData: any) {
  try {
    const { tags: tagIds, tools: toolIds, images, ...projectFields } = projectData
    
    // Check if the summary is being cleared, and preserve it if so
    if (projectFields.summary === '' || projectFields.summary === null) {
      // Fetch the current project to preserve its summary if it exists
      const existingProject = await prisma.project.findUnique({
        where: { id },
        select: { summary: true }
      })
      
      if (existingProject?.summary) {
        console.log(`Prevented summary loss for project ID: ${id}`)
        projectFields.summary = existingProject.summary
      }
    }
    
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update project
      await tx.project.update({
        where: { id },
        data: projectFields
      })
      
      // Update tags if provided
      if (tagIds) {
        // Remove existing tags
        await tx.projectTag.deleteMany({
          where: { project_id: id }
        })
        
        // Add new tags
        if (tagIds.length > 0) {
          await Promise.all(
            tagIds.map((tagId: string) =>
              tx.projectTag.create({
                data: {
                  project_id: id,
                  tag_id: tagId
                }
              })
            )
          )
        }
      }
      
      // Update tools if provided
      if (toolIds) {
        // Remove existing tools
        await tx.projectTool.deleteMany({
          where: { project_id: id }
        })
        
        // Add new tools
        if (toolIds.length > 0) {
          await Promise.all(
            toolIds.map((toolId: string) =>
              tx.projectTool.create({
                data: {
                  project_id: id,
                  tool_id: toolId
                }
              })
            )
          )
        }
      }
      
      // Update images if provided
      if (images) {
        // Remove existing images
        await tx.projectImage.deleteMany({
          where: { project_id: id }
        })
        
        // Add new images
        if (images.length > 0) {
          await Promise.all(
            images.map((img: ImageInput, index: number) =>
              tx.projectImage.create({
                data: {
                  project_id: id,
                  url: img.url,
                  alt_text: img.alt_text || '',
                  order_index: img.order_index || index
                }
              })
            )
          )
        }
      }
    })
    
    revalidatePath('/admin')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    revalidatePath(`/projects/${projectData.slug}`)
    
    return { success: true }
  } catch (error: unknown) {
    console.error('Error updating project:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to update project: ${errorMessage}`)
  }
}

// Create a new project
export async function createProject(projectData: any) {
  try {
    const { tags: tagIds, tools: toolIds, images, ...projectFields } = projectData
    
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create project
      const project = await tx.project.create({
        data: projectFields
      })
      
      // Add tags
      if (tagIds && tagIds.length > 0) {
        await Promise.all(
          tagIds.map((tagId: string) =>
            tx.projectTag.create({
              data: {
                project_id: project.id,
                tag_id: tagId
              }
            })
          )
        )
      }
      
      // Add tools
      if (toolIds && toolIds.length > 0) {
        await Promise.all(
          toolIds.map((toolId: string) =>
            tx.projectTool.create({
              data: {
                project_id: project.id,
                tool_id: toolId
              }
            })
          )
        )
      }
      
      // Add images
      if (images && images.length > 0) {
        await Promise.all(
          images.map((img: ImageInput, index: number) =>
            tx.projectImage.create({
              data: {
                project_id: project.id,
                url: img.url,
                alt_text: img.alt_text || '',
                order_index: img.order_index || index
              }
            })
          )
        )
      }
      
      return project
    })
    
    revalidatePath('/admin')
    revalidatePath('/admin/projects')
    revalidatePath('/projects')
    
    return result
  } catch (error: unknown) {
    console.error('Error creating project:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to create project: ${errorMessage}`)
  }
}

// Delete a project
export async function deleteProject(id: string) {
  try {
    // Using cascade delete, we don't need to manually delete related records
    await prisma.project.delete({
      where: { id }
    })
    
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
 * TAGS
 */

// Get all tags
export async function getTags() {
  try {
    return await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to fetch tags')
  }
}

// Create a tag
export async function createTag(name: string, slug: string) {
  try {
    return await prisma.tag.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-')
      }
    })
  } catch (error) {
    console.error('Error creating tag:', error)
    throw new Error('Failed to create tag')
  }
}

/**
 * TOOLS
 */

// Get all tools
export async function getTools() {
  try {
    return await prisma.tool.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    throw new Error('Failed to fetch tools')
  }
}

// Create a tool
export async function createTool(name: string, slug: string, icon?: string) {
  try {
    return await prisma.tool.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        icon
      }
    })
  } catch (error) {
    console.error('Error creating tool:', error)
    throw new Error('Failed to create tool')
  }
} 