import { create } from 'zustand';
import { supabase } from '../services/supabase';
import useUserStore from './useUserStore';

/**
 * Journal Store
 * 
 * Manages the state for the Journal feature ("Reflection Pool").
 * Handles CRUD operations (Create, Read, Update, Delete) for journal entries via Supabase.
 */
const useJournalStore = create((set, get) => ({
    // State Variables
    entries: [], // Array of journal entries
    isLoading: false, // Loading state for async operations
    error: null, // Error state

    /**
     * Fetch all journal entries for the authenticated user.
     * Ordered by creation date (newest first).
     */
    fetchEntries: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ entries: data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Create a new journal entry.
     * 
     * @param {Object} entry - The entry object { title, content, tags }.
     */
    addEntry: async (entry) => {
        set({ isLoading: true, error: null });
        try {
            const user = useUserStore.getState().user;
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('journal_entries')
                .insert([{
                    user_id: user.id,
                    title: entry.title,
                    content: entry.content,
                    tags: entry.tags || [],
                }])
                .select()
                .single();

            if (error) throw error;

            // Optimistically update local state
            set((state) => ({ entries: [data, ...state.entries] }));
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Update an existing journal entry.
     * 
     * @param {string} id - The ID of the entry to update.
     * @param {Object} updates - The fields to update.
     */
    updateEntry: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('journal_entries')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Update local state
            set((state) => ({
                entries: state.entries.map(e => e.id === id ? data : e)
            }));
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete a journal entry.
     * 
     * @param {string} id - The ID of the entry to delete.
     */
    deleteEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('journal_entries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from local state
            set((state) => ({
                entries: state.entries.filter(e => e.id !== id)
            }));
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useJournalStore;
