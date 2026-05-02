/**
 * Centralized authentication utilities for Vave Fragrances.
 */

/**
 * Translates raw Supabase/Auth errors into user-friendly messages.
 */
export function friendlyError(raw: string): { message: string; action?: 'login' | 'signup' } {
  const r = raw?.toLowerCase() || '';
  
  if (r.includes('invalid login credentials') || r.includes('invalid email or password'))
    return { message: 'Incorrect email or password. Please try again.' };
    
  if (r.includes('email not confirmed'))
    return { message: 'Please verify your email first. Check your inbox for a confirmation link.' };
    
  if (r.includes('user already registered') || r.includes('already registered') || r.includes('already exists'))
    return { message: 'An account with this email already exists.', action: 'login' };
    
  if (r.includes('user not found'))
    return { message: 'No account found with this email. Please sign up.', action: 'signup' };
    
  if (r.includes('too many requests') || r.includes('rate limit'))
    return { message: 'Too many attempts. Please wait a few minutes and try again.' };
    
  if (r.includes('network') || r.includes('fetch'))
    return { message: 'Network error. Please check your connection and try again.' };
    
  if (r.includes('invalid otp') || r.includes('token has expired') || r.includes('otp expired'))
    return { message: 'Invalid or expired code. Please request a new OTP.' };
    
  if (r.includes('sms') || r.includes('phone'))
    return { message: 'Could not send OTP. Please check your phone number or try email login.' };
    
  if (r.includes('password') && r.includes('short'))
    return { message: 'Password must be at least 6 characters long.' };
    
  return { message: raw || 'Something went wrong. Please try again.' };
}

/**
 * Normalizes phone numbers for Supabase (assumes India +91 if no prefix).
 */
export function normalizePhone(phone: string): string {
  // Remove all non-numeric characters except '+'
  let clean = phone.replace(/[^\d+]/g, "");
  
  // If it starts with '0', remove it
  if (clean.startsWith('0')) clean = clean.substring(1);
  
  // If it's 10 digits and doesn't start with '+', add +91
  if (clean.length === 10 && !clean.startsWith('+')) {
    return `+91${clean}`;
  }
  
  // If it already has +91 but duplicated or messy
  if (clean.startsWith('91') && clean.length === 12) {
    return `+${clean}`;
  }
  
  return clean.startsWith('+') ? clean : `+91${clean}`;
}

/**
 * Validates a 10-digit Indian mobile number.
 */
export function isValidIndianPhone(phone: string): boolean {
  const raw = phone.replace(/[^\d]/g, "");
  // If it has 91 prefix, check last 10
  if (raw.length === 12 && raw.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(raw.substring(2));
  }
  return /^[6-9]\d{9}$/.test(raw);
}
