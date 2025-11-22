import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Icon } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useDevotionalStore from '../store/useDevotionalStore';

/**
 * Devotional Screen (Daily Streams)
 * 
 * Displays the daily devotional content including scripture, reflection, and prayer.
 * Fetches data from Supabase based on the current date.
 */
const DevotionalScreen = ({ navigation }) => {
    const { todayDevotional, streak, fetchTodayDevotional, isLoading } = useDevotionalStore();

    // Fetch devotional on mount
    useEffect(() => {
        fetchTodayDevotional();
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary.blue} />
            </View>
        );
    }

    // Empty State (No devotional found for today)
    if (!todayDevotional) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.emptyText}>No devotional for today.</Text>
                <Button title="Check again" onPress={fetchTodayDevotional} type="clear" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header with Streak and Date */}
            <View style={styles.header}>
                <View style={styles.streakContainer}>
                    <Icon name="flame" type="ionicon" color={colors.semantic.warning} size={20} />
                    <Text style={styles.streakText}>{streak} Day Streak</Text>
                </View>
                <Text style={styles.date}>{todayDevotional.date}</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text h3 style={styles.title}>{todayDevotional.title}</Text>

                {/* Scripture Card */}
                <Card containerStyle={styles.scriptureCard}>
                    <Text style={styles.scriptureText}>"{todayDevotional.scripture.text}"</Text>
                    <Text style={styles.scriptureReference}>
                        — {todayDevotional.scripture.reference} ({todayDevotional.scripture.translation})
                    </Text>
                </Card>

                {/* Reflection Body */}
                <Text style={styles.bodyText}>{todayDevotional.content}</Text>

                {/* Prayer Section */}
                <View style={styles.prayerContainer}>
                    <Text style={styles.prayerLabel}>Today's Prayer</Text>
                    <Text style={styles.prayerText}>{todayDevotional.prayer}</Text>
                </View>

                {/* Action Button */}
                <Button
                    title="Reflect in Journal"
                    icon={<Icon name="create-outline" type="ionicon" color={colors.white} style={{ marginRight: 10 }} />}
                    buttonStyle={styles.reflectButton}
                    onPress={() => navigation.navigate('Reflection Pool')}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        backgroundColor: colors.white,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.light,
        paddingHorizontal: spacing.s,
        paddingVertical: 4,
        borderRadius: 12,
    },
    streakText: {
        marginLeft: 4,
        fontWeight: typography.weights.bold,
        color: colors.secondary.dark,
        fontSize: typography.sizes.small,
    },
    date: {
        color: colors.secondary.medium,
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
    },
    content: {
        padding: spacing.l,
    },
    title: {
        color: colors.primary.dark,
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    scriptureCard: {
        ...commonStyles.card,
        backgroundColor: colors.primary.light,
        borderColor: 'transparent',
        marginBottom: spacing.l,
        marginHorizontal: 0,
    },
    scriptureText: {
        fontSize: typography.sizes.h3,
        fontFamily: typography.scripture,
        fontStyle: 'italic',
        color: colors.primary.dark,
        textAlign: 'center',
        marginBottom: spacing.s,
    },
    scriptureReference: {
        textAlign: 'center',
        fontWeight: typography.weights.bold,
        color: colors.primary.blue,
    },
    bodyText: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        lineHeight: 26,
        marginBottom: spacing.l,
    },
    prayerContainer: {
        backgroundColor: colors.white,
        padding: spacing.m,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
        marginBottom: spacing.xl,
    },
    prayerLabel: {
        color: colors.accent,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
        textTransform: 'uppercase',
        fontSize: typography.sizes.small,
    },
    prayerText: {
        fontSize: typography.sizes.body,
        fontStyle: 'italic',
        color: colors.secondary.dark,
    },
    reflectButton: {
        backgroundColor: colors.primary.blue,
        borderRadius: 24,
        paddingVertical: spacing.m,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    emptyText: {
        fontSize: typography.sizes.body,
        color: colors.secondary.medium,
        marginBottom: spacing.m,
    },
});

export default DevotionalScreen;

