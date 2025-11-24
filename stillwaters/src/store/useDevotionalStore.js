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
            // Use local date string to match the user's day
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            console.log('Fetching devotional for date:', today);

            // Call the RPC function to get or assign a devotional for today
            const { data, error } = await supabase
                .rpc('get_daily_stream', { target_date: today });

            if (error) throw error;

            if (!data) {
                // If RPC returns null, it means the library is empty or something went wrong
                set({ todayDevotional: null });
                return;
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
