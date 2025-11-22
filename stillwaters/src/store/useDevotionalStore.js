import { create } from 'zustand';
import { supabase } from '../services/supabase';

/**
 * Devotional Store
 * 
 * Manages the state for the Daily Devotional feature ("Daily Streams").
 * Fetches the devotional for the current date from Supabase.
 */
const useDevotionalStore = create((set) => ({
    // State Variables
    todayDevotional: null, // The devotional object for today
    isLoading: false, // Loading state
    error: null, // Error state
    streak: 3, // Mock streak count (In a real app, this would be calculated from user activity logs)

    /**
     * Fetch the devotional for the current date (UTC).
     * If no devotional exists for today, sets state to null.
     */
    fetchTodayDevotional: async () => {
        set({ isLoading: true, error: null });
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('devotionals')
                .select('*')
                .eq('date', today)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No devotional found for today (PGRST116 is the code for 0 rows from .single())
                    set({ todayDevotional: null });
                    return;
                }
                throw error;
            }

            // Format the data for the UI
            const formattedDevotional = {
                id: data.id,
                date: new Date(data.date).toLocaleDateString(),
                title: data.title,
                content: data.content,
                scripture: data.scripture_json,
                prayer: data.prayer
            };

            set({ todayDevotional: formattedDevotional });
        } catch (error) {
            console.error('Error fetching devotional:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Increment the user's streak.
     * Currently a local state update only.
     */
    markRead: () => set((state) => ({ streak: state.streak + 1 })),
}));

export default useDevotionalStore;
