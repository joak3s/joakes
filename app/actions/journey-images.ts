'use server';

import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/database/supabase-admin';

/**
 * Delete a journey image from a journey entry
 */
export async function deleteJourneyImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get admin Supabase client
    const supabase = getAdminClient();
    
    // First, get the image details so we can delete from storage if needed
    const { data: imageData, error: fetchError } = await supabase
      .from('journey_images')
      .select('*')
      .eq('id', imageId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching image data:', fetchError);
      return { 
        success: false, 
        error: `Error fetching image data: ${fetchError.message}` 
      };
    }
    
    // Delete the database record
    const { error: deleteError } = await supabase
      .from('journey_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      console.error('Error deleting journey image record:', deleteError);
      return { 
        success: false, 
        error: `Error deleting image: ${deleteError.message}` 
      };
    }
    
    // After successfully deleting the image record, reorder remaining images
    // to ensure there are no gaps in order_index values
    if (imageData) {
      await reorderJourneyImagesAfterDeletion(
        supabase, 
        imageData.journey_id
      );
    }
    
    // Revalidate the admin journey page
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

/**
 * Update the order of images for a journey entry
 */
export async function updateJourneyImageOrder(
  journeyId: string,
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get admin Supabase client
    const supabase = getAdminClient();
    
    // Update each image with its new order
    for (let i = 0; i < imageIds.length; i++) {
      const { error } = await supabase
        .from('journey_images')
        .update({ order_index: i + 1 })
        .eq('id', imageIds[i])
        .eq('journey_id', journeyId);
      
      if (error) {
        console.error(`Error updating image order for ${imageIds[i]}:`, error);
        return { 
          success: false, 
          error: `Error updating image order: ${error.message}` 
        };
      }
    }
    
    // Revalidate the admin journey page
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

/**
 * After deleting an image, reorder the remaining images for a journey entry
 * to ensure there are no gaps in order_index values
 */
async function reorderJourneyImagesAfterDeletion(
  supabase: any,
  journeyId: string
): Promise<void> {
  try {
    // Get all remaining images for this journey entry, sorted by current order
    const { data: images, error: fetchError } = await supabase
      .from('journey_images')
      .select('id, order_index')
      .eq('journey_id', journeyId)
      .order('order_index', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching images for reordering:', fetchError);
      return;
    }
    
    // Update each image with a sequential order_index starting from 1
    for (let i = 0; i < images.length; i++) {
      const newIndex = i + 1;
      
      // Only update if the order has changed
      if (images[i].order_index !== newIndex) {
        const { error } = await supabase
          .from('journey_images')
          .update({ order_index: newIndex })
          .eq('id', images[i].id);
        
        if (error) {
          console.error(`Error reordering image ${images[i].id}:`, error);
        }
      }
    }
    
  } catch (error) {
    console.error('Error in reorderJourneyImagesAfterDeletion:', error);
  }
} 