'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/database/supabase-admin';

interface CreateJourneyInput {
  title: string;
  subtitle?: string;
  year: string;
  description: string;
  skills: string[];
  icon: string;
  color: string;
  display_order: number;
  image_url?: string;
}

/**
 * Get a Supabase admin client with service role
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return getAdminClient();
}

/**
 * Server action to create a journey entry
 * This handles the journey entry creation (image should be uploaded separately)
 */
export async function createJourneyEntry(
  data: CreateJourneyInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log('Creating journey entry with data:', {
      title: data.title,
      subtitle: data.subtitle || '',
      year: data.year,
      skills: data.skills?.length || 0,
      hasImageUrl: !!data.image_url
    });
    
    // Get admin Supabase client
    const supabase = getSupabaseAdmin();
    
    // Validate required fields
    if (!data.title || !data.year || !data.description || 
        !data.skills || !data.skills.length || !data.icon || !data.color) {
      console.error('Missing required fields:', { 
        title: !data.title, 
        year: !data.year,
        description: !data.description,
        skills: !data.skills || !data.skills.length,
        icon: !data.icon,
        color: !data.color
      });
      throw new Error('Missing required fields');
    }
    
    // Create journey entry
    console.log('Creating journey entry in database');

    // Use a direct insert instead of RPC if causing issues
    const { data: journeyData, error: journeyError } = await supabase
      .from('journey')
      .insert({
        title: data.title,
        subtitle: data.subtitle || null,
        year: data.year,
        description: data.description,
        skills: data.skills,
        icon: data.icon,
        color: data.color,
        display_order: data.display_order
      })
      .select('*')
      .single();
    
    if (journeyError) {
      console.error('Error creating journey entry:', journeyError);
      throw new Error(`Failed to create journey entry: ${journeyError.message}`);
    }
    
    console.log('Journey entry created with ID:', journeyData.id);
    
    // If we have an image URL, associate it with the journey entry
    if (data.image_url) {
      console.log('Adding image to journey entry');
      
      // Use direct insert instead of RPC
      const { error: imageError } = await supabase
        .from('journey_images')
        .insert({
          journey_id: journeyData.id,
          url: data.image_url,
          order_index: 1
        });
      
      if (imageError) {
        console.error('Error adding journey image:', imageError);
        // We don't throw here, as the journey entry was created successfully
      } else {
        console.log('Image added successfully to journey entry');
      }
    }
    
    // Revalidate the path
    revalidatePath('/admin/journey');
    
    return {
      success: true,
      data: journeyData
    };
    
  } catch (error: any) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Server action to update a journey entry
 */
export async function updateJourneyEntry(
  id: string,
  data: Partial<CreateJourneyInput>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log('Updating journey entry with ID:', id);
    
    // Get admin Supabase client
    const supabase = getSupabaseAdmin();
    
    // First, update the journey entry
    console.log('Updating journey entry data');
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.year) updateData.year = data.year;
    if (data.description) updateData.description = data.description;
    if (data.skills) updateData.skills = data.skills;
    if (data.icon) updateData.icon = data.icon;
    if (data.color) updateData.color = data.color;
    if (data.display_order !== undefined) updateData.display_order = data.display_order;
    
    const { data: journeyData, error: updateError } = await supabase
      .from('journey')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating journey entry:', updateError);
      throw new Error(`Failed to update journey entry: ${updateError.message}`);
    }
    
    console.log('Journey entry updated successfully');
    
    // If we have a new image URL, add it to journey_images
    if (data.image_url) {
      console.log('Adding new image to updated journey entry');
      // First, get current images to determine highest order_index
      const { data: existingImages, error: fetchError } = await supabase
        .from('journey_images')
        .select('order_index')
        .eq('journey_id', id)
        .order('order_index', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching existing images:', fetchError);
      }
      
      const nextOrderIndex = existingImages && existingImages.length > 0 
        ? existingImages[0].order_index + 1 
        : 1;
      
      console.log('Adding image with order index:', nextOrderIndex);
      const { error: imageError } = await supabase
        .from('journey_images')
        .insert({
          journey_id: id,
          url: data.image_url,
          order_index: nextOrderIndex
        });
      
      if (imageError) {
        console.error('Error adding journey image:', imageError);
      } else {
        console.log('Image added successfully to updated journey entry');
      }
    }
    
    // Revalidate the path
    revalidatePath('/admin/journey');
    
    return {
      success: true,
      data: journeyData
    };
    
  } catch (error: any) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Server action to delete a journey entry
 */
export async function deleteJourneyEntry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Deleting journey entry with ID:', id);
    
    // Get admin Supabase client
    const supabase = getSupabaseAdmin();
    
    // First, delete any associated images from journey_images
    console.log('Deleting associated images');
    const { error: imagesError } = await supabase
      .from('journey_images')
      .delete()
      .eq('journey_id', id);
    
    if (imagesError) {
      console.error('Error deleting journey images:', imagesError);
      // Continue with deletion even if image deletion fails
    } else {
      console.log('Journey images deleted successfully');
    }
    
    // Then delete the journey entry
    console.log('Deleting journey entry');
    const { error: deleteError } = await supabase
      .from('journey')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting journey entry:', deleteError);
      return {
        success: false,
        error: `Failed to delete journey entry: ${deleteError.message}`
      };
    }
    
    console.log('Journey entry deleted successfully');
    
    // Revalidate the path
    revalidatePath('/admin/journey');
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
} 