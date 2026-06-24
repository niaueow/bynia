import { supabase } from './supabase'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

/**
 * Sign in with Google OAuth via Supabase
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin`,
    },
  })
  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current auth session
 * @returns {Promise<{session: object|null, error: object|null}>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session ?? null, error }
}

/**
 * Get the current user
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user ?? null, error }
}

/**
 * Check if a given email is the authorized admin
 * @param {string} email
 * @returns {boolean}
 */
export function isAdmin(email) {
  if (!email || !ADMIN_EMAIL) return false
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

/**
 * Listen for auth state changes
 * @param {Function} callback - Called with (event, session)
 * @returns {Function} unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange(callback)
  return data.subscription.unsubscribe
}
