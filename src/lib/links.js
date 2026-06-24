import { supabase } from './supabase'

/**
 * Create a new shortened link
 * @param {string} alias - The custom alias for the short URL
 * @param {string} originalUrl - The original long URL
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function createLink(alias, originalUrl) {
  const { data, error } = await supabase
    .from('links')
    .insert([{ alias, original_url: originalUrl }])
    .select()
    .single()

  return { data, error }
}

/**
 * Get a link by its alias
 * @param {string} alias - The alias to look up
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getLinkByAlias(alias) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('alias', alias)
    .single()

  return { data, error }
}

/**
 * Increment the click count for a link using RPC
 * @param {string} alias - The alias of the link
 */
export async function incrementClicks(alias) {
  const { error } = await supabase.rpc('increment_clicks', {
    link_alias: alias,
  })
  return { error }
}

/**
 * Get all links ordered by creation date (admin)
 * @returns {Promise<{data: array|null, error: object|null}>}
 */
export async function getAllLinks() {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Search links by alias or original URL (admin)
 * @param {string} query - The search query
 * @returns {Promise<{data: array|null, error: object|null}>}
 */
export async function searchLinks(query) {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .or(`alias.ilike.%${query}%,original_url.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Delete a single link by ID (admin)
 * @param {string} id - The UUID of the link
 */
export async function deleteLink(id) {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)

  return { error }
}

/**
 * Delete multiple links by IDs (admin)
 * @param {string[]} ids - Array of UUIDs
 */
export async function deleteLinks(ids) {
  const { error } = await supabase
    .from('links')
    .delete()
    .in('id', ids)

  return { error }
}

/**
 * Delete all links (admin)
 */
export async function deleteAllLinks() {
  const { error } = await supabase
    .from('links')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows

  return { error }
}

/**
 * Get total click count across all links (admin)
 * @returns {Promise<{total: number, error: object|null}>}
 */
export async function getTotalClicks() {
  const { data, error } = await supabase
    .from('links')
    .select('clicks')

  if (error) return { total: 0, error }

  const total = data.reduce((sum, link) => sum + (link.clicks || 0), 0)
  return { total, error: null }
}
