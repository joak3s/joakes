'use server';

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase storage for journey entries
 * This server action handles journey image uploads specifically
 */
export async function uploadJourneyImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('Starting journey image upload process');
    
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in FormData');
      return { success: false, error: 'No file provided' };
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
      return { 
        success: false, 
        error: 'Invalid file type. Please upload a JPEG, PNG, GIF, WEBP, or SVG image.' 
      };
    }
    
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return { 
        success: false, 
        error: 'File size exceeds the 5MB limit.' 
      };
    }
    
    // Get Supabase credentials with service role for storage operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return { success: false, error: 'Server configuration error' };
    }
    
    // Create a client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `journey/${fileName}`;
    
    console.log('Uploading to path:', filePath);
    
    // Get file bytes for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { 
        success: false, 
        error: `Error uploading image: ${uploadError.message}` 
      };
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
    
    console.log('Upload successful, public URL:', publicUrl);
    
    return {
      success: true,
      url: publicUrl
    };
    
  } catch (error: any) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
} 