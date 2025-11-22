import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, SearchBar, Icon } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useFAQStore from '../store/useFAQStore';

/**
 * FAQ Item Component
 * 
 * Renders a single FAQ item in the list.
 * Displays category and question text.
 */
const FAQItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.question}>{item.question}</Text>
            </View>
            <Icon name="chevron-forward" type="ionicon" color={colors.secondary.medium} />
        </View>
    </TouchableOpacity>
);

/**
 * FAQ Screen (The Well)
 * 
 * Displays a searchable list of Frequently Asked Questions.
 * Fetches data from Supabase via the FAQ store.
 */
const FAQScreen = ({ navigation }) => {
    const { faqs, searchQuery, setSearchQuery, fetchFAQs, isLoading } = useFAQStore();

    // Fetch FAQs on mount
    useEffect(() => {
        fetchFAQs();
    }, []);

    // Filter FAQs based on search query (case-insensitive)
    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text h4 style={styles.title}>The Well</Text>
                <Text style={styles.subtitle}>Common questions, deep answers.</Text>
            </View>

            {/* Search Bar */}
            <SearchBar
                placeholder="Search topics..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                platform="default"
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
                inputStyle={styles.searchInput}
                lightTheme
                round
            />

            {/* FAQ List */}
            <FlatList
                data={filteredFAQs}
                renderItem={({ item }) => (
                    <FAQItem
                        item={item}
                        onPress={() => navigation.navigate('FAQDetail', { faq: item })}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    header: {
        padding: spacing.l,
        paddingBottom: spacing.m,
        backgroundColor: colors.white,
    },
    title: {
        color: colors.primary.dark,
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: colors.secondary.medium,
        fontSize: typography.sizes.body,
    },
    searchContainer: {
        backgroundColor: colors.white,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.m,
    },
    searchInputContainer: {
        backgroundColor: colors.secondary.light,
    },
    searchInput: {
        fontSize: typography.sizes.body,
    },
    listContent: {
        padding: spacing.m,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: spacing.s,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemContent: {
        flex: 1,
        marginRight: spacing.m,
    },
    category: {
        fontSize: typography.sizes.small,
        color: colors.primary.blue,
        fontWeight: typography.weights.bold,
        marginBottom: 4,
    },
    question: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        fontWeight: typography.weights.medium,
    },
    separator: {
        height: spacing.xs,
    },
});

export default FAQScreen;
