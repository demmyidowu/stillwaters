import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { spacing, typography } from '../utils/theme';

/**
 * FAQ Detail Screen
 * 
 * Displays the full answer for a selected FAQ.
 * Includes summary, detailed explanation, and key scripture references.
 */
const FAQDetailScreen = ({ route }) => {
    const { faq } = route.params;
    const { theme } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.card, { backgroundColor: theme.colors.white, shadowColor: theme.colors.black }]}>
                <Text style={[styles.category, { color: theme.colors.primary }]}>{faq.category.toUpperCase()}</Text>
                <Text h4 style={[styles.question, { color: theme.colors.black }]}>{faq.question}</Text>

                <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Summary</Text>
                <Text style={[styles.answer, { color: theme.colors.black }]}>{faq.answer.summary}</Text>

                <View style={[styles.divider, { backgroundColor: theme.colors.grey0 }]} />

                <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Detailed Explanation</Text>
                <Text style={[styles.answer, { color: theme.colors.black }]}>{faq.answer.detailed}</Text>

                {faq.answer.scriptures && faq.answer.scriptures.length > 0 && (
                    <View style={styles.scriptureContainer}>
                        <Text style={[styles.scriptureTitle, { color: theme.colors.grey1 }]}>Related Scripture:</Text>
                        {faq.answer.scriptures.map((scripture, index) => (
                            <Text key={index} style={[styles.scripture, { color: theme.colors.grey2 }]}>• {scripture}</Text>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    card: {
        borderRadius: 8,
        padding: spacing.m,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    category: {
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    question: {
        marginBottom: spacing.m,
    },
    divider: {
        height: 1,
        marginBottom: spacing.m,
    },
    sectionTitle: {
        fontSize: typography.sizes.body,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    answer: {
        fontSize: typography.sizes.body,
        lineHeight: 24,
        marginBottom: spacing.l,
    },
    scriptureContainer: {
        marginTop: spacing.m,
    },
    scriptureTitle: {
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
        textTransform: 'uppercase',
    },
    scripture: {
        fontSize: typography.sizes.body,
        fontStyle: 'italic',
        marginBottom: 4,
    },
});

export default FAQDetailScreen;
