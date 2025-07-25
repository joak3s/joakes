import type { Database } from './database'

export type Tool = Database['public']['Tables']['tools']['Row']

export type ToolInsert = Database['public']['Tables']['tools']['Insert']

export type ToolUpdate = Database['public']['Tables']['tools']['Update']

export type ToolsApiResponse = {
  data?: Tool[];
  error?: string;
} 