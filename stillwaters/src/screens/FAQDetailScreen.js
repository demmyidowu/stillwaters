import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Divider } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';

/**
 * FAQ Detail Screen
 * 
 * Displays the full answer for a selected FAQ.
 * Includes summary, detailed explanation, and key scripture references.
 */
const FAQDetailScreen = ({ route }) => {
    const { faq } = route.params;

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.category}>{faq.category.toUpperCase()}</Text>
                <Text h3 style={styles.question}>{faq.question}</Text>
            </View>

            {/* Answer Content */}
            <Card containerStyle={styles.card}>
                <Text style={styles.summaryLabel}>Summary</Text>
                <Text style={styles.summaryText}>{faq.answer.summary}</Text>

                <Divider style={styles.divider} />

                <Text style={styles.detailedLabel}>Detailed Explanation</Text>
                <Text style={styles.detailedText}>{faq.answer.detailed}</Text>

                {/* Scripture References */}
                <View style={styles.scriptureContainer}>
                    <Text style={styles.scriptureLabel}>Key Scriptures</Text>
                    {faq.answer.scriptures.map((scripture, index) => (
                        <Text key={index} style={styles.scriptureItem}>• {scripture}</Text>
                    ))}
                </View>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    header: {
        padding: spacing.l,
        backgroundColor: colors.primary.blue,
    },
    category: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    question: {
        color: colors.white,
        fontSize: typography.sizes.h2,
    },
    card: {
        ...commonStyles.card,
        marginTop: -spacing.l,
        marginHorizontal: spacing.m,
        marginBottom: spacing.l,
        padding: spacing.l,
    },
    summaryLabel: {
        color: colors.primary.dark,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    summaryText: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        lineHeight: 24,
        marginBottom: spacing.m,
    },
    divider: {
        marginVertical: spacing.m,
    },
    detailedLabel: {
        color: colors.primary.dark,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    detailedText: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        lineHeight: 24,
        marginBottom: spacing.l,
    },
    scriptureContainer: {
        backgroundColor: colors.primary.light,
        padding: spacing.m,
        borderRadius: 8,
    },
    scriptureLabel: {
        color: colors.primary.dark,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
    },
    scriptureItem: {
        color: colors.primary.dark,
        fontSize: typography.sizes.body,
        marginBottom: 4,
    },
});

export default FAQDetailScreen;
