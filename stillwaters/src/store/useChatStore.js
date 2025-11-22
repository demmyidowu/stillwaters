import { create } from 'zustand';
import { supabase } from '../services/supabase';
import useUserStore from './useUserStore';

/**
 * Chat Store
 * 
 * Manages the state for the chatbot feature ("StillWaters").
 * Handles sending messages, receiving responses (via backend), and persisting conversations to Supabase.
 */
const useChatStore = create((set, get) => ({
    // State Variables
    messages: [], // Array of message objects { id, text, sender, ... }
    isLoading: false, // Loading state for API requests
    conversationId: null, // ID of the current active conversation in Supabase

    /**
     * Initialize a new conversation in Supabase.
     * Creates a new row in the 'conversations' table linked to the current user.
     * 
     * @returns {Promise<string|null>} The new conversation ID or null if failed.
     */
    initConversation: async () => {
        try {
            const user = useUserStore.getState().user;
            if (!user) return;

            // Create a new conversation entry
            const { data, error } = await supabase
                .from('conversations')
                .insert([{ user_id: user.id, summary: 'New Conversation' }])
                .select()
                .single();

            if (error) throw error;

            // Update state with the new conversation ID
            set({ conversationId: data.id });
            return data.id;
        } catch (error) {
            console.error('Error creating conversation:', error);
            return null;
        }
    },

    /**
     * Add a message to the local store and persist it to Supabase.
     * If no conversation exists, it initializes one first.
     * 
     * @param {Object} message - The message object to add.
     */
    addMessage: async (message) => {
        // Optimistically update the UI
        set((state) => ({
            messages: [...state.messages, message]
        }));

        // Log the message to Supabase for persistence
        try {
            const user = useUserStore.getState().user;
            if (!user) return;

            // Get current conversation ID or create a new one
            let chatId = get().conversationId;
            if (!chatId) {
                chatId = await get().initConversation();
            }

            if (chatId) {
                // Insert message into the 'messages' table
                await supabase.from('messages').insert([{
                    conversation_id: chatId,
                    sender: message.sender,
                    text: message.text,
                    metadata: message.data || null, // Store extra data (e.g., scripture references)
                }]);
            }
        } catch (error) {
            console.error('Error logging message:', error);
        }
    },

    /**
     * Set the loading state manually.
     * Useful for showing typing indicators or loading spinners.
     * 
     * @param {boolean} loading 
     */
    setLoading: (loading) => set({ isLoading: loading }),

    /**
     * Clear all messages and reset the conversation ID.
     * Used when starting a fresh chat session.
     */
    clearMessages: () => set({ messages: [], conversationId: null }),
}));

export default useChatStore;
