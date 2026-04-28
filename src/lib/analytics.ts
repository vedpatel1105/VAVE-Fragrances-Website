import { getSupabaseClient } from './supabaseClient'

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type EventName = 'add_to_cart' | 'remove_from_cart' | 'add_to_wishlist' | 'begin_checkout' | 'purchase' | 'page_view' | 'contact_click' | 'login' | 'signup'

export const analytics = {
  /**
   * Tracks an event both in GA4 and Supabase
   */
  async trackEvent(eventName: EventName, eventData: any = {}) {
    // 1. GA4 Tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventData)
    }

    // 2. Supabase Tracking (Async)
    try {
      const client = getSupabaseClient();
      
      // Get current user if exists
      const { data: { user } } = await client.auth.getUser()
      
      const payload = {
        event_name: eventName,
        event_data: eventData,
        user_id: user?.id || null,
        url: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
      }

      // We use 'vave_analytics' as the table name
      await client.from('vave_analytics').insert(payload)
    } catch (error) {
      // Fail silently for analytics to not disturb user flow
      console.warn('Analytics Error:', error)
    }
  },

  /**
   * Special helper for Page View tracking
   */
  trackPageView(url: string) {
    this.trackEvent('page_view', { page_path: url })
  }
}
