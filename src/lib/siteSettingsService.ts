import { supabase } from './supabaseClient'

export interface SiteSettings {
  id?: string
  instagram_handle: string
  instagram_widget_code: string | null
  updated_at?: string
}

export interface GalleryImage {
  id: string
  url: string
  title?: string
  order_index: number
}

export const siteSettingsService = {
  async getSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from('vave_settings')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      return data || { instagram_handle: 'vavefragrances', instagram_widget_code: null }
    } catch (err) {
      console.error("Error fetching settings:", err)
      return { instagram_handle: 'vavefragrances', instagram_widget_code: null }
    }
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    const { data: existing } = await supabase.from('vave_settings').select('id').single()
    
    if (existing) {
      const { error } = await supabase
        .from('vave_settings')
        .update(settings)
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('vave_settings')
        .insert([settings])
      if (error) throw error
    }
  },

  async getGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('vave_gallery')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async addGalleryImage(image: Omit<GalleryImage, 'id'>) {
    const { error } = await supabase
      .from('vave_gallery')
      .insert([image])
    if (error) throw error
  },

  async deleteGalleryImage(id: string) {
    const { error } = await supabase
      .from('vave_gallery')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async updateGalleryOrder(images: { id: string, order_index: number }[]) {
    try {
      // In a production app, we would use a Supabase RPC function for batch updates.
      // For now, we execute them in parallel for speed.
      const updates = images.map(img => 
        supabase
          .from('vave_gallery')
          .update({ order_index: img.order_index })
          .eq('id', img.id)
      )
      
      const results = await Promise.all(updates)
      const errors = results.filter(r => r.error)
      
      if (errors.length > 0) {
        console.error("Some gallery order updates failed:", errors)
        throw new Error("Partial failure updating gallery order")
      }
    } catch (err) {
      console.error("Error updating gallery order:", err)
      throw err
    }
  }
}
