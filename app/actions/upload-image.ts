'use server';

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

/**
 * Server action to upload an image to Supabase storage
 * @param formData FormData containing the file
 * @returns URL of the uploaded image or throws an error
 */
export async function uploadImageToSupabase(formData: FormData): Promise<string> {
  try {
    console.log('Starting image upload process');
    
    // Get the file from form data
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in FormData');
      throw new Error('No file provided');
    }
    
    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    });
    
    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!acceptedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, WEBP, or SVG image.');
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      throw new Error('File size exceeds the 5MB limit.');
    }
    
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Server configuration error');
    }
    
    // Create a client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExt}`;
    
    // Use a consistent storage path for all journey entries
    const filePath = `journey/${fileName}`;
    
    console.log('Uploading to path:', filePath);
    
    // Convert the file to array buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('public')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Error uploading image: ${error.message}`);
    }
    
    if (!data?.path) {
      console.error('Upload successful but no path returned');
      throw new Error('Upload successful but no path returned');
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(data.path);
    
    console.log('Upload successful, public URL:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Server action upload error:', error);
    throw new Error(error.message || 'Error uploading image');
  }
}

/**
 * Upload multiple project images and save to database
 */
export async function uploadProjectImages(formData: FormData): Promise<{ success: boolean; images?: any[]; error?: string }> {
  try {
    console.log('Starting project images upload process');
    
    const projectId = formData.get('projectId') as string;
    const files = formData.getAll('files') as File[];
    
    if (!projectId) {
      return { success: false, error: 'Project ID is required' };
    }
    
    if (!files || files.length === 0) {
      return { success: false, error: 'No files provided' };
    }
    
    console.log(`Uploading ${files.length} files for project ${projectId}`);
    
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Server configuration error' };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get current max order_index for this project
    const { data: existingImages } = await supabase
      .from('project_images')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1);
    
    const startOrderIndex = existingImages && existingImages.length > 0 
      ? (existingImages[0].order_index || 0) + 1 
      : 0;
    
    const uploadedImages = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!acceptedTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        continue; // Skip invalid files
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('File too large:', file.name);
        continue; // Skip large files
      }
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `projects/${fileName}`;
      
      // Upload to Supabase storage
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Upload error for file:', file.name, uploadError);
        continue; // Skip failed uploads
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      // Save to database
      const { data: imageData, error: dbError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          url: publicUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
          order_index: startOrderIndex + i
        })
        .select()
        .single();
      
      if (dbError) {
        console.error('Database error for file:', file.name, dbError);
        continue; // Skip database failures
      }
      
      uploadedImages.push(imageData);
    }
    
    console.log(`Successfully uploaded ${uploadedImages.length} images`);
    
    return {
      success: true,
      images: uploadedImages
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
 * Update project image order
 */
export async function updateProjectImageOrder(imageId: string, newOrderIndex: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Server configuration error' };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase
      .from('project_images')
      .update({ order_index: newOrderIndex })
      .eq('id', imageId);
    
    if (error) {
      console.error('Update order error:', error);
      return { success: false, error: error.message };
    }
    
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
 * Delete project image
 */
export async function deleteProjectImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return { success: false, error: 'Server configuration error' };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the image data first to delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('project_images')
      .select('url')
      .eq('id', imageId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching image data:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      console.error('Delete error:', deleteError);
      return { success: false, error: deleteError.message };
    }
    
    // Try to delete from storage (extract path from URL)
    if (imageData.url) {
      try {
        const urlParts = imageData.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `projects/${fileName}`;
        
        await supabase.storage
          .from('public')
          .remove([filePath]);
      } catch (storageError) {
        console.error('Storage deletion error (non-critical):', storageError);
        // Don't fail the operation if storage deletion fails
      }
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
} 