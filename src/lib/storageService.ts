import { supabase } from './supabaseClient';

export const storageService = {
  /**
   * Uploads a file to the 'products' bucket.
   * Path: [category]/[filename]
   */
  async uploadProductImage(file: File, folder: string = 'general'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Deletes a file from the 'products' bucket.
   */
  async deleteProductImage(url: string): Promise<void> {
    try {
      // Extract path from URL
      // Example URL: https://xyz.supabase.co/storage/v1/object/public/products/folder/file.png
      const urlParts = url.split('/products/');
      if (urlParts.length < 2) return;
      
      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};
