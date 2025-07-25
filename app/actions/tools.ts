'use server';

import { createServerSupabaseClient } from '@/lib/database/supabase-server';
import { getAdminClient } from '@/lib/database/supabase-admin';
import { Tool } from '@/lib/types/tool';
import { revalidatePath } from 'next/cache';

export type ToolsApiResponse = {
  data?: Tool[];
  error?: string;
}

/**
 * Get all tools from the database
 */
export async function getTools(): Promise<ToolsApiResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching tools:', error);
      return { error: error.message };
    }

    return { data: data as Tool[] };
  } catch (error) {
    console.error('Error in getTools:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    };
  }
}

/**
 * Get tool by ID
 */
export async function getToolById(id: string): Promise<{ data?: Tool, error?: string }> {
  if (!id) return { error: 'Tool ID is required' };

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching tool ${id}:`, error);
      return { error: error.message };
    }

    return { data: data as Tool };
  } catch (error) {
    console.error(`Error in getToolById (${id}):`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Create a new tool (admin only)
 */
export async function createTool(
  toolData: { name: string; slug: string; show_in_filter?: boolean }
): Promise<{ data?: Tool, error?: string }> {
  try {
    // Get admin client for authenticated operations
    const adminSupabase = await getAdminClient();
    
    // Validate data
    if (!toolData.name?.trim()) {
      return { error: 'Tool name is required' };
    }
    
    if (!toolData.slug?.trim()) {
      return { error: 'Tool slug is required' };
    }
    
    // Create the tool
    const { data, error } = await adminSupabase
      .from('tools')
      .insert({
        name: toolData.name,
        slug: toolData.slug,
        show_in_filter: toolData.show_in_filter || false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating tool:', error);
      return { error: error.message };
    }
    
    // Revalidate data
    revalidatePath('/admin');
    revalidatePath('/work');
    
    return { data: data as Tool };
  } catch (error) {
    console.error('Error in createTool:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Update a tool (admin only)
 */
export async function updateTool(
  id: string,
  toolData: Partial<Omit<Tool, 'id' | 'created_at'>>
): Promise<{ data?: Tool, error?: string }> {
  if (!id) return { error: 'Tool ID is required' };
  
  try {
    const adminSupabase = await getAdminClient();
    
    const { data, error } = await adminSupabase
      .from('tools')
      .update(toolData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating tool ${id}:`, error);
      return { error: error.message };
    }
    
    // Revalidate data
    revalidatePath('/admin');
    revalidatePath('/work');
    
    return { data: data as Tool };
  } catch (error) {
    console.error(`Error in updateTool (${id}):`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Delete a tool (admin only)
 */
export async function deleteTool(id: string): Promise<{ success?: boolean, error?: string }> {
  if (!id) return { error: 'Tool ID is required' };
  
  try {
    const adminSupabase = await getAdminClient();
    
    // First check if tool exists
    const { data: existingTool, error: checkError } = await adminSupabase
      .from('tools')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError || !existingTool) {
      return { error: 'Tool not found' };
    }
    
    // Delete the tool
    const { error } = await adminSupabase
      .from('tools')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting tool ${id}:`, error);
      return { error: error.message };
    }
    
    // Revalidate data
    revalidatePath('/admin');
    revalidatePath('/work');
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteTool (${id}):`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 