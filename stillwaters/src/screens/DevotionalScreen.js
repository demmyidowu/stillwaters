import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card, Icon, useTheme } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useDevotionalStore from '../store/useDevotionalStore';

/**
 * Devotional Screen (Daily Streams)
 * 
 * Displays the daily devotional content.
 * Includes scripture, reflection, and prayer.
 */
const DevotionalScreen = ({ navigation }) => {
    const { todayDevotional, fetchTodayDevotional, isLoading, streak } = useDevotionalStore();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchTodayDevotional();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!todayDevotional) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background, padding: 20 }]}>
                <Icon name="water-outline" type="ionicon" size={64} color={theme.colors.grey2} />
                <Text h4 style={{ color: theme.colors.grey1, marginTop: 16, textAlign: 'center' }}>No Stream for Today</Text>
                <Text style={{ color: theme.colors.grey2, marginTop: 8, textAlign: 'center' }}>
                    Check back tomorrow for a new reflection.
                </Text>
            </View>
        );
    }

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            {/* Header / Date */}
            <View style={[styles.header, { backgroundColor: theme.colors.white }]}>
                <Text h4 style={[styles.title, { color: theme.colors.primary }]}>Daily Streams</Text>
                <Text style={[styles.date, { color: theme.colors.grey1 }]}>{today}</Text>
            </View>

            {/* Devotional Content */}
            <View style={[styles.contentContainer, { backgroundColor: theme.colors.white, shadowColor: theme.colors.black }]}>
                <Text h3 style={[styles.devotionalTitle, { color: theme.colors.black }]}>{todayDevotional.title}</Text>

                <View style={[styles.scriptureContainer, { backgroundColor: theme.mode === 'dark' ? theme.colors.grey0 : theme.colors.grey5 }]}>
                    <Text style={[styles.scriptureText, { color: theme.colors.grey2 }]}>"{todayDevotional.scripture.text}"</Text>
                    <Text style={[styles.scriptureReference, { color: theme.colors.primary }]}>
                        {todayDevotional.scripture.reference} ({todayDevotional.scripture.translation})
                    </Text>
                </View>

                <Text style={[styles.bodyText, { color: theme.colors.black }]}>{todayDevotional.content}</Text>

                <View style={[styles.divider, { backgroundColor: theme.colors.grey0 }]} />

                <Text style={[styles.prayerTitle, { color: theme.colors.primary }]}>Prayer</Text>
                <Text style={[styles.prayerText, { color: theme.colors.grey2 }]}>{todayDevotional.prayer}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.l,
        paddingBottom: spacing.m,
        alignItems: 'center',
    },
    title: {
        fontWeight: typography.weights.bold,
        marginBottom: 4,
    },
    date: {
        fontSize: typography.sizes.body,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contentContainer: {
        margin: spacing.m,
        padding: spacing.l,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    devotionalTitle: {
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    scriptureContainer: {
        padding: spacing.m,
        borderRadius: 8,
        marginBottom: spacing.l,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary.blue, // Keep brand color for accent
    },
    scriptureText: {
        fontSize: typography.sizes.body,
        fontStyle: 'italic',
        marginBottom: spacing.s,
        lineHeight: 24,
    },
    scriptureReference: {
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        textAlign: 'right',
    },
    bodyText: {
        fontSize: typography.sizes.body,
        lineHeight: 26,
        marginBottom: spacing.l,
    },
    divider: {
        height: 1,
        marginBottom: spacing.l,
    },
    prayerTitle: {
        fontSize: typography.sizes.h3,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    prayerText: {
        fontSize: typography.sizes.body,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DevotionalScreen;
