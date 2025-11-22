import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, SearchBar, Icon, ListItem, useTheme } from '@rneui/themed';
import { typography, spacing } from '../utils/theme';
import useFAQStore from '../store/useFAQStore';

/**
 * FAQ Screen (The Well)
 * 
 * Displays a searchable list of Frequently Asked Questions.
 * Fetches data from Supabase via the FAQ store.
 */
const FAQScreen = ({ navigation }) => {
    const { faqs, searchQuery, setSearchQuery, fetchFAQs } = useFAQStore();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

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
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.white }]}>
                <Text h4 style={[styles.title, { color: theme.colors.black }]}>The Well</Text>
                <Text style={[styles.subtitle, { color: theme.colors.grey1 }]}>Common questions, deep answers.</Text>
            </View>

            {/* Search Bar */}
            <SearchBar
                placeholder="Search topics..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                platform="default"
                containerStyle={[styles.searchContainer, { backgroundColor: theme.colors.white }]}
                inputContainerStyle={[styles.searchInputContainer, { backgroundColor: theme.colors.grey0 }]}
                inputStyle={[styles.searchInput, { color: theme.colors.black }]}
                placeholderTextColor={theme.colors.grey1}
                lightTheme={theme.mode === 'light'}
                round
            />

            {/* FAQ List */}
            <FlatList
                data={filteredFAQs}
                renderItem={({ item }) => (
                    <ListItem
                        bottomDivider
                        onPress={() => navigation.navigate('FAQDetail', { faq: item })}
                        containerStyle={{ backgroundColor: theme.colors.white }}
                    >
                        <Icon name="help-circle-outline" type="ionicon" color={theme.colors.primary} />
                        <ListItem.Content>
                            <ListItem.Title style={[styles.title, { color: theme.colors.black }]}>{item.question}</ListItem.Title>
                            <ListItem.Subtitle style={{ color: theme.colors.grey1 }} numberOfLines={1}>
                                {item.answer.summary}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron color={theme.colors.grey1} />
                    </ListItem>
                )}
                keyExtractor={item => item.id}
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
    searchContainer: {
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.m,
    },
    searchInputContainer: {
        // Background color handled by theme
    },
    searchInput: {
        fontSize: typography.sizes.body,
    },
});

export default FAQScreen;
