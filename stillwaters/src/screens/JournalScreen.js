import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, FAB } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useJournalStore from '../store/useJournalStore';

/**
 * Journal Entry Item Component
 * 
 * Renders a single journal entry in the list.
 * Displays date, time, title, preview content, and tags.
 */
const JournalEntryItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.date}>
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.time}>
                    {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            <Text style={styles.title} numberOfLines={1}>{item.title || 'Untitled'}</Text>
            <Text style={styles.preview} numberOfLines={2}>{item.content}</Text>

            {/* Render tags if available */}
            {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {item.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    </TouchableOpacity>
);

/**
 * Journal Screen (Reflection Pool)
 * 
 * Displays a list of the user's journal entries.
 * Allows navigation to create new entries or view existing ones.
 */
const JournalScreen = ({ navigation }) => {
    const { entries } = useJournalStore();

    return (
        <View style={styles.container}>
            {/* Entry List */}
            <FlatList
                data={entries}
                renderItem={({ item }) => (
                    <JournalEntryItem
                        item={item}
                        onPress={() => navigation.navigate('JournalEntry', { entryId: item.id })}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="book-outline" type="ionicon" size={64} color={colors.secondary.light} />
                        <Text style={styles.emptyText}>Your reflection pool is empty.</Text>
                        <Text style={styles.emptySubText}>Tap + to start writing.</Text>
                    </View>
                }
            />

            {/* Floating Action Button for new entry */}
            <FAB
                icon={{ name: 'add', color: 'white' }}
                color={colors.accent}
                placement="right"
                onPress={() => navigation.navigate('JournalEntry')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    listContent: {
        padding: spacing.m,
    },
    itemContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: spacing.m,
        marginBottom: spacing.m,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    date: {
        fontSize: typography.sizes.small,
        color: colors.primary.blue,
        fontWeight: typography.weights.bold,
    },
    time: {
        fontSize: typography.sizes.small,
        color: colors.secondary.medium,
    },
    title: {
        fontSize: typography.sizes.h3,
        fontWeight: typography.weights.bold,
        color: colors.primary.dark,
        marginBottom: 4,
    },
    preview: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: spacing.s,
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: colors.primary.light,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        marginTop: 4,
    },
    tagText: {
        fontSize: 10,
        color: colors.primary.dark,
        fontWeight: typography.weights.bold,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: spacing.m,
        fontSize: typography.sizes.h3,
        color: colors.secondary.medium,
    },
    emptySubText: {
        marginTop: spacing.s,
        fontSize: typography.sizes.body,
        color: colors.secondary.medium,
    },
});

export default JournalScreen;
