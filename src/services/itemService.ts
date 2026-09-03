import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Item } from '../types';
import { INITIAL_ITEMS } from '../data/mockData';

const STORAGE_KEY = 'buynothing_items_v1';

export class ItemService {
  /**
   * Load all items for the neighborhood
   */
  static async getItems(_neighborhoodSlug?: string): Promise<Item[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          giver:user_profiles!giver_id(*),
          requests:item_requests(*),
          messages:messages(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch items from Supabase:', error);
      } else if (data && data.length > 0) {
        return data as unknown as Item[];
      }
    }

    // Local / Dev Fallback
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    return INITIAL_ITEMS;
  }

  /**
   * Save items to local cache / state
   */
  static saveLocal(items: Item[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /**
   * Create a new item
   */
  static async createItem(item: Partial<Item>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('items').insert({
        title: item.title,
        description: item.description,
        category: item.category,
        image_url: item.imageUrl,
        giver_id: item.giverId,
        neighborhood_id: item.neighborhood,
      });

      if (error) console.error('Error creating item in Supabase:', error);
    }
  }

  /**
   * Transition item status (e.g. available -> pending -> picked_up)
   */
  static async updateStatus(itemId: string, status: Item['status'], selectedRequesterId?: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('items')
        .update({
          status,
          selected_requester_id: selectedRequesterId || null,
        })
        .eq('id', itemId);

      if (error) console.error('Error updating status in Supabase:', error);
    }
  }
}
