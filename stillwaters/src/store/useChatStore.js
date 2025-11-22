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

            // Update state with the new conversation ID and add to list
            const newConversation = data;
            set(state => ({
                conversationId: newConversation.id,
                conversations: [newConversation, ...state.conversations]
            }));
            return newConversation.id;
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
     * Send a message from the user and get a response from the AI.
     * Handles optimistic updates, API calls, and error states.
     * 
     * @param {string} text - The user's message text.
     */
    sendUserMessage: async (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        // 1. Optimistically add user message
        get().addMessage(userMessage);
        set({ isLoading: true });

        try {
            // 2. Call the backend API
            const { sendMessage } = require('../services/api');
            const response = await sendMessage(userMessage.text);

            // 3. Create bot message from response (Explanation)
            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: response.interpretations[0].view,
                sender: 'bot',
                timestamp: new Date(),
                data: response
            };

            // 4. Add bot message
            get().addMessage(botMessage);

            // 5. Create separate message for the verse
            let scripture = null;
            if (response.interpretations?.[0]?.scriptures?.length > 0) {
                scripture = response.interpretations[0].scriptures[0];
            } else if (response.primary_scripture) {
                // Fallback for legacy/mock structure
                scripture = response.primary_scripture;
            }

            if (scripture) {
                const verseMessage = {
                    id: (Date.now() + 2).toString(),
                    text: `"${scripture.text}"\n\n— ${scripture.reference} (${scripture.translation || ''})`,
                    sender: 'bot',
                    timestamp: new Date(Date.now() + 100), // Slight delay
                    data: { isVerse: true } // Mark as verse for potential styling
                };
                get().addMessage(verseMessage);
            }

            // 6. Auto-generate title if needed
            const currentConversationId = get().conversationId;
            if (currentConversationId) {
                // Find conversation in local state
                const conversationIndex = get().conversations.findIndex(c => c.id === currentConversationId);
                const conversation = get().conversations[conversationIndex];

                // If conversation is "New Conversation" (default), update it
                if (conversation && conversation.summary === 'New Conversation') {
                    const newTitle = text.length > 30 ? text.substring(0, 30) + '...' : text;

                    // Update in Supabase
                    await supabase
                        .from('conversations')
                        .update({ summary: newTitle })
                        .eq('id', currentConversationId);

                    // Update local state
                    const updatedConversations = [...get().conversations];
                    updatedConversations[conversationIndex] = { ...conversation, summary: newTitle };
                    set({ conversations: updatedConversations });
                }
            }

        } catch (error) {
            console.error('Chat Error:', error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the waters right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
            };
            get().addMessage(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Delete a conversation.
     * @param {string} conversationId 
     */
    deleteConversation: async (conversationId) => {
        try {
            const { error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', conversationId);

            if (error) throw error;

            // Remove from local state
            set(state => ({
                conversations: state.conversations.filter(c => c.id !== conversationId),
                // If deleting current conversation, clear messages
                messages: state.conversationId === conversationId ? [] : state.messages,
                conversationId: state.conversationId === conversationId ? null : state.conversationId
            }));
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    },

    conversations: [], // List of past conversations

    /**
     * Fetch all conversations for the current user.
     */
    fetchConversations: async () => {
        set({ isLoading: true });
        try {
            const user = useUserStore.getState().user;
            if (!user) return;

            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({ conversations: data });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Load a specific conversation and its messages.
     * @param {string} conversationId 
     */
    loadConversation: async (conversationId) => {
        set({ isLoading: true, conversationId, messages: [] });
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Transform messages to match UI structure
            const formattedMessages = data.map(msg => ({
                id: msg.id,
                text: msg.text,
                sender: msg.sender,
                timestamp: new Date(msg.created_at),
                data: msg.metadata
            }));

            set({ messages: formattedMessages });
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Clear all messages and reset the conversation ID.
     * Used when starting a fresh chat session.
     */
    clearMessages: () => set({ messages: [], conversationId: null }),
}));

export default useChatStore;
