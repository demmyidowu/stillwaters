import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Icon, useTheme } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useJournalStore from '../store/useJournalStore';

/**
 * Journal Screen (Reflection Pool)
 * 
 * Displays a list of the user's journal entries.
 * Allows navigation to create or edit entries.
 */
const JournalScreen = ({ navigation }) => {
    const { entries } = useJournalStore();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Entry List */}
            <FlatList
                data={entries}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('JournalEntry', { entry: item })}
                    >
                        <View style={[styles.entryCard, { backgroundColor: theme.colors.white, shadowColor: theme.colors.black }]}>
                            <View style={styles.entryHeader}>
                                <Text style={[styles.entryDate, { color: theme.colors.grey1 }]}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </Text>
                                <Icon name="chevron-forward" type="ionicon" size={20} color={theme.colors.grey2} />
                            </View>
                            <Text h4 style={[styles.entryTitle, { color: theme.colors.black }]} numberOfLines={1}>{item.title}</Text>
                            <Text style={[styles.entryPreview, { color: theme.colors.grey1 }]} numberOfLines={2}>{item.content}</Text>
                            {item.tags && item.tags.length > 0 && (
                                <View style={styles.tagsContainer}>
                                    {item.tags.map((tag, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: theme.colors.grey0 }]}>
                                            <Text style={[styles.tagText, { color: theme.colors.grey2 }]}>#{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="book-outline" type="ionicon" size={64} color={theme.colors.grey2} />
                        <Text style={[styles.emptyText, { color: theme.colors.grey1 }]}>Your reflection pool is empty.</Text>
                        <Text style={[styles.emptySubtext, { color: theme.colors.grey2 }]}>Tap + to add your first entry.</Text>
                    </View>
                }
            />

            <FAB
                icon={{ name: 'add', color: 'white' }}
                color={theme.colors.primary}
                placement="right"
                onPress={() => navigation.navigate('JournalEntry')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: 80, // Space for FAB
    },
    entryCard: {
        borderRadius: 12,
        padding: spacing.m,
        marginBottom: spacing.m,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    entryDate: {
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    entryTitle: {
        marginBottom: spacing.s,
    },
    entryPreview: {
        fontSize: typography.sizes.body,
        marginBottom: spacing.m,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: typography.sizes.caption,
        fontWeight: typography.weights.medium,
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

export default JournalScreen;
