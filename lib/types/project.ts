import type { Database } from './database'

export type Project = Database['public']['Tables']['projects']['Row'] & {
  project_images?: Database['public']['Tables']['project_images']['Row'][];
  tools?: Database['public']['Tables']['tools']['Row'][];
  tags?: Database['public']['Tables']['tags']['Row'][];
}

export type CreateProjectInput = Database['public']['Tables']['projects']['Insert'] & {
  images?: { url: string; alt_text?: string; order_index: number }[];
  tool_ids?: string[];
  tag_ids?: string[];
}

export type UpdateProjectInput = Database['public']['Tables']['projects']['Update'] & {
  images?: { url: string; alt_text?: string; order_index: number }[];
  tool_ids?: string[];
  tag_ids?: string[];
}

export function mapDatabaseToProject(dbProject: any): Project {
  return {
    ...dbProject,
    tools: dbProject.project_tools?.map((pt: any) => pt.tools).filter(Boolean) || [],
    tags: dbProject.project_tags?.map((pt: any) => pt.tags).filter(Boolean) || []
  }
} 