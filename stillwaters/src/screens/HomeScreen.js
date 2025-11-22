import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text, Input, Button, Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useChatStore from '../store/useChatStore';
import { sendMessage } from '../services/api';

/**
 * MessageBubble Component
 * 
 * Renders a single chat message.
 * Differentiates between user messages (right-aligned, blue) and bot messages (left-aligned, white).
 * Displays scripture references if available in the message metadata.
 */
const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <View style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble
        ]}>
            <Text style={[
                styles.messageText,
                isUser ? styles.userText : styles.botText
            ]}>
                {message.text}
            </Text>
            {/* Render scripture metadata if present */}
            {message.data && (
                <View style={styles.scriptureContainer}>
                    <Text style={styles.scriptureReference}>
                        {message.data.primary_scripture.reference} ({message.data.primary_scripture.translation})
                    </Text>
                    <Text style={styles.scriptureText}>
                        "{message.data.primary_scripture.text}"
                    </Text>
                </View>
            )}
        </View>
    );
};

/**
 * HomeScreen (The Guide)
 * 
 * The main chat interface for the application.
 * Allows users to send messages to the AI chatbot and view the conversation history.
 */
const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    // Access chat store state and actions
    const { messages, isLoading, addMessage, setLoading } = useChatStore();

    /**
     * Handle sending a message.
     * 1. Adds user message to the store.
     * 2. Calls the backend API to get a response.
     * 3. Adds the bot's response to the store.
     */
    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInputText('');
        setLoading(true);

        try {
            // Call the backend API (Gemini)
            const response = await sendMessage(userMessage.text);

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: response.interpretations[0].view, // Display first interpretation as main text for now
                sender: 'bot',
                timestamp: new Date(),
                data: response // Store full response data
            };

            addMessage(botMessage);
        } catch (error) {
            // Handle API errors
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the waters right now. Please try again.",
                sender: 'bot',
                timestamp: new Date(),
            };
            addMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Message List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="water-outline" type="ionicon" size={64} color={colors.primary.light} />
                        <Text style={styles.emptyText}>Ask a question to begin...</Text>
                    </View>
                }
            />

            {/* Loading Indicator */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary.blue} />
                    <Text style={styles.loadingText}>Seeking wisdom...</Text>
                </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Ask a theological question..."
                        value={inputText}
                        onChangeText={setInputText}
                        containerStyle={styles.inputFieldContainer}
                        inputContainerStyle={styles.inputField}
                        rightIcon={
                            <Icon
                                name="send"
                                type="ionicon"
                                color={inputText.trim() ? colors.primary.blue : colors.secondary.medium}
                                onPress={handleSend}
                                disabled={!inputText.trim() || isLoading}
                            />
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.light,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: colors.secondary.medium,
        marginTop: spacing.m,
        fontSize: typography.sizes.body,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.m,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary.blue,
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: colors.white,
        borderBottomLeftRadius: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: typography.sizes.body,
        lineHeight: 22,
    },
    userText: {
        color: colors.white,
    },
    botText: {
        color: colors.secondary.dark,
    },
    scriptureContainer: {
        marginTop: spacing.s,
        paddingTop: spacing.s,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.light,
    },
    scriptureReference: {
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        color: colors.primary.dark,
        marginBottom: 2,
    },
    scriptureText: {
        fontSize: typography.sizes.caption,
        fontStyle: 'italic',
        color: colors.secondary.medium,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.s,
    },
    loadingText: {
        marginLeft: spacing.s,
        color: colors.secondary.medium,
        fontSize: typography.sizes.caption,
    },
    inputContainer: {
        backgroundColor: colors.white,
        paddingTop: spacing.s,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.light,
    },
    inputFieldContainer: {
        paddingHorizontal: spacing.s,
    },
    inputField: {
        borderBottomWidth: 0,
        backgroundColor: colors.secondary.light,
        borderRadius: 24,
        paddingHorizontal: spacing.m,
        height: 48,
    },
});

export default HomeScreen;
