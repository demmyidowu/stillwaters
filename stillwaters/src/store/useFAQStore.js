import { create } from 'zustand';
import { supabase } from '../services/supabase';

/**
 * FAQ Store
 * 
 * Manages the state for the Frequently Asked Questions feature ("The Well").
 * Fetches questions from Supabase and handles client-side searching/filtering.
 */
const useFAQStore = create((set, get) => ({
    // State Variables
    faqs: [], // Array of FAQ objects
    isLoading: false, // Loading state for fetching FAQs
    error: null, // Error state
    searchQuery: '', // Current search text input by user

    /**
     * Update the search query state.
     * @param {string} query 
     */
    setSearchQuery: (query) => set({ searchQuery: query }),

    /**
     * Fetch all FAQs from Supabase.
     * Data is ordered by category.
     */
    fetchFAQs: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('category');

            if (error) throw error;

            // Transform data to match expected shape if needed, 
            // but our table structure matches the mock structure closely.
            // We just need to map answer_json to answer.
            const formattedFAQs = data.map(item => ({
                id: item.id,
                category: item.category,
                question: item.question,
                answer: item.answer_json // JSON object containing the answer structure
            }));

            set({ faqs: formattedFAQs });
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Selector to get FAQs filtered by the current search query.
     * Filters by both question text and category.
     * 
     * @returns {Function} A selector function that takes state and returns filtered FAQs.
     */
    getFilteredFAQs: () => {
        return (state) => {
            const query = state.searchQuery.toLowerCase();
            if (!query) return state.faqs;

            return state.faqs.filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.category.toLowerCase().includes(query)
            );
        };
    }
}));

export default useFAQStore;
