import { create } from 'zustand';
import { supabase } from '../services/supabase';

/**
 * User Store
 * 
 * Manages global user state, including authentication and application settings.
 * Integrates directly with Supabase Auth for sign-up, sign-in, and session management.
 */
const useUserStore = create((set, get) => ({
    // State Variables
    user: null, // The authenticated user object
    session: null, // The active Supabase session
    isLoading: false, // Loading state for auth operations
    error: null, // Error messages for auth failures

    // Settings (Local state for now, could be synced to profiles table)
    settings: {
        notifications: true,
        darkMode: false,
        translation: 'NIV', // Preferred Bible translation
    },

    /**
     * Sign up a new user with email and password.
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} fullName 
     * @returns {Promise<{data: any, error: any}>}
     */
    signUp: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // Stored in user_metadata
                    },
                },
            });

            if (error) throw error;

            // Session is null if email confirmation is required
            if (data.session) {
                set({ session: data.session, user: data.user });
            }
            return { data, error: null };
        } catch (error) {
            set({ error: error.message });
            return { data: null, error };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Sign in an existing user.
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{data: any, error: any}>}
     */
    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            set({ session: data.session, user: data.user });
            return { data, error: null };
        } catch (error) {
            set({ error: error.message });
            return { data: null, error };
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Sign out the current user and clear state.
     */
    signOut: async () => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ session: null, user: null });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Restore the user session on app launch.
     * Also sets up a listener for auth state changes (e.g., token refresh, sign out).
     */
    restoreSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null });

        // Listen for changes to auth state
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null });
        });
    },

    // --- Settings Actions ---

    toggleNotifications: () => set((state) => ({
        settings: { ...state.settings, notifications: !state.settings.notifications }
    })),

    toggleDarkMode: () => set((state) => ({
        settings: { ...state.settings, darkMode: !state.settings.darkMode }
    })),

    setTranslation: (translation) => set((state) => ({
        settings: { ...state.settings, translation }
    })),
}));

export default useUserStore;
