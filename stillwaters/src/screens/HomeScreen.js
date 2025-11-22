import React, { useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { Text, Input, Icon, useTheme } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useChatStore from '../store/useChatStore';

/**
 * Message Bubble Component
 * 
 * Displays a single chat message with "flowy" animations and themed styling.
 */
const MessageBubble = ({ item, theme }) => {
    const isUser = item.sender === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[
            styles.messageBubbleContainer,
            isUser ? styles.userBubbleContainer : styles.botBubbleContainer,
            { opacity: fadeAnim, transform: [{ translateY }] }
        ]}>
            <View style={[
                styles.messageBubble,
                isUser ?
                    [styles.userBubble, { backgroundColor: theme.colors.primary }] :
                    [styles.botBubble, { backgroundColor: theme.colors.white }],
                item.data?.isVerse && styles.verseBubble // Apply verse styling
            ]}>
                <Text style={[
                    styles.messageText,
                    isUser ? { color: theme.colors.white } : { color: theme.colors.black },
                    item.data?.isVerse && styles.verseText // Apply verse text styling
                ]}>
                    {item.text}
                </Text>
            </View>
        </Animated.View>
    );
};

/**
 * Chat Screen (The Guide)
 * 
 * The main chat interface.
 * Now supports loading specific conversations and "flowy" animations.
 */
const HomeScreen = ({ route, navigation }) => {
    const { conversationId } = route.params || {};
    const { messages, isLoading, sendUserMessage, loadConversation, clearMessages } = useChatStore();
    const [inputText, setInputText] = React.useState('');
    const flatListRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (conversationId) {
            loadConversation(conversationId);
        } else {
            // New conversation
            clearMessages();
        }
    }, [conversationId]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText('');
        await sendUserMessage(text);
    };

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble item={item} theme={theme} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatContent}
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Icon name="water-outline" type="ionicon" size={80} color={theme.colors.grey2} />
                            <Text style={[styles.emptyText, { color: theme.colors.grey1 }]}>
                                The waters are still. Ask a question to begin.
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    isLoading && (
                        <View style={styles.loadingContainer}>
                            <Text style={[styles.loadingText, { color: theme.colors.grey1 }]}>The Guide is reflecting...</Text>
                        </View>
                    )
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.white, borderTopColor: theme.colors.grey0 }]}>
                    <Input
                        placeholder="Ask a theological question..."
                        placeholderTextColor={theme.colors.grey1}
                        value={inputText}
                        onChangeText={setInputText}
                        containerStyle={styles.inputFieldContainer}
                        inputContainerStyle={[styles.inputField, { backgroundColor: theme.colors.grey0 }]}
                        inputStyle={{ color: theme.colors.black, fontSize: typography.sizes.body }}
                        rightIconContainerStyle={styles.rightIconContainer}
                        rightIcon={
                            <Icon
                                name="send"
                                type="ionicon"
                                size={24}
                                color={inputText.trim() ? theme.colors.primary : theme.colors.grey2}
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
    },
    chatContent: {
        padding: spacing.m,
        paddingBottom: spacing.m,
    },
    messageBubbleContainer: {
        marginBottom: spacing.m,
        width: '100%',
    },
    userBubbleContainer: {
        alignItems: 'flex-end',
    },
    botBubbleContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: spacing.m,
        borderRadius: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userBubble: {
        borderBottomRightRadius: 4, // "Flowy" shape
    },
    botBubble: {
        borderBottomLeftRadius: 4, // "Flowy" shape
    },
    messageText: {
        fontSize: typography.sizes.body,
        lineHeight: 22,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        opacity: 0.7,
    },
    emptyText: {
        marginTop: spacing.m,
        fontSize: typography.sizes.h3,
        textAlign: 'center',
        paddingHorizontal: spacing.l,
    },
    loadingContainer: {
        padding: spacing.m,
        alignItems: 'center',
    },
    loadingText: {
        fontStyle: 'italic',
    },
    inputContainer: {
        padding: spacing.s,
        borderTopWidth: 1,
    },
    inputFieldContainer: {
        paddingHorizontal: 0,
    },
    inputField: {
        borderBottomWidth: 0,
        borderRadius: 24,
        paddingHorizontal: spacing.m,
        height: 48,
    },
    rightIconContainer: {
        marginRight: spacing.xs,
    },
    verseBubble: {
        backgroundColor: '#f0f8ff', // Light blue background for verses (AliceBlue)
        borderLeftWidth: 4,
        borderLeftColor: colors.primary.blue,
        borderRadius: 8,
        borderBottomLeftRadius: 8,
    },
    verseText: {
        fontStyle: 'italic',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
});

export default HomeScreen;
