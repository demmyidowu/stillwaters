import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FAB, Icon, useTheme, ListItem } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useChatStore from '../store/useChatStore';
import Swipeable from 'react-native-gesture-handler/Swipeable';

/**
 * Chat List Screen
 * 
 * Displays a list of past conversations ("Journeys").
 * Allows users to start a new conversation or resume an old one.
 */
const ChatListScreen = ({ navigation }) => {
    const { conversations, fetchConversations, isLoading, clearMessages, deleteConversation } = useChatStore();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleNewChat = () => {
        clearMessages();
        navigation.navigate('Chat');
    };

    const handleSelectChat = (conversationId) => {
        navigation.navigate('Chat', { conversationId });
    };

    const handleDeleteChat = (conversationId) => {
        deleteConversation(conversationId);
    };

    const renderRightActions = (progress, dragX, itemId) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: theme.colors.error,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: '100%',
                }}
                onPress={() => handleDeleteChat(itemId)}
            >
                <Animated.View style={{ transform: [{ scale: trans }] }}>
                    <Icon name="trash-outline" type="ionicon" color="white" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
            containerStyle={{ backgroundColor: theme.colors.white }}
        >
            <ListItem
                containerStyle={{ backgroundColor: theme.colors.white }}
                onPress={() => handleSelectChat(item.id)}
                bottomDivider
            >
                <Icon name="chatbubble-ellipses-outline" type="ionicon" color={theme.colors.primary} />
                <ListItem.Content>
                    <ListItem.Title style={{ color: theme.colors.black, fontWeight: typography.weights.bold }}>
                        {item.summary || 'New Conversation'}
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ color: theme.colors.grey1, fontSize: typography.sizes.small }}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color={theme.colors.grey1} />
            </ListItem>
        </Swipeable>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.white }]}>
                <Text h4 style={[styles.title, { color: theme.colors.primary }]}>Your Journeys</Text>
                <Text style={[styles.subtitle, { color: theme.colors.grey1 }]}>Past conversations with The Guide</Text>
            </View>

            {isLoading && conversations.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="water-outline" type="ionicon" size={64} color={theme.colors.grey2} />
                            <Text style={[styles.emptyText, { color: theme.colors.grey1 }]}>No journeys yet.</Text>
                            <Text style={[styles.emptySubtext, { color: theme.colors.grey2 }]}>Start a new conversation to begin.</Text>
                        </View>
                    }
                />
            )}

            <FAB
                icon={{ name: 'add', color: 'white' }}
                color={theme.colors.primary}
                placement="right"
                onPress={handleNewChat}
                title="New Chat"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.l,
        paddingBottom: spacing.m,
    },
    title: {
        fontWeight: typography.weights.bold,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: typography.sizes.body,
    },
    listContent: {
        paddingBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: spacing.m,
        fontSize: typography.sizes.h3,
        fontWeight: typography.weights.bold,
    },
    emptySubtext: {
        marginTop: spacing.s,
        fontSize: typography.sizes.body,
    },
});

export default ChatListScreen;
