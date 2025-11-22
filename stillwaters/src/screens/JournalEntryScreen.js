import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useJournalStore from '../store/useJournalStore';

/**
 * Journal Entry Screen
 * 
 * Allows users to create a new journal entry or edit an existing one.
 * Handles saving and deleting entries via the journal store.
 */
const JournalEntryScreen = ({ navigation, route }) => {
    const { entryId } = route.params || {};
    const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Load entry data if editing
    useEffect(() => {
        if (entryId) {
            const entry = entries.find(e => e.id === entryId);
            if (entry) {
                setTitle(entry.title);
                setContent(entry.content);
                navigation.setOptions({ title: 'Edit Entry' });
            }
        }
    }, [entryId, entries, navigation]);

    /**
     * Handle saving the entry (create or update).
     */
    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (entryId) {
            updateEntry(entryId, { title, content });
        } else {
            addEntry({ title, content });
        }
        navigation.goBack();
    };

    /**
     * Handle deleting the entry with confirmation.
     */
    const handleDelete = () => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this reflection?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteEntry(entryId);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Title Input */}
            <Input
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                inputContainerStyle={styles.titleInput}
                inputStyle={styles.titleText}
                placeholderTextColor={colors.secondary.medium}
            />

            {/* Content Input */}
            <Input
                placeholder="Write your reflection here..."
                value={content}
                onChangeText={setContent}
                multiline
                inputContainerStyle={styles.contentInput}
                inputStyle={styles.contentText}
                placeholderTextColor={colors.secondary.medium}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Save Reflection"
                    onPress={handleSave}
                    buttonStyle={styles.saveButton}
                    containerStyle={styles.buttonWrapper}
                />

                {entryId && (
                    <Button
                        title="Delete"
                        type="outline"
                        onPress={handleDelete}
                        buttonStyle={styles.deleteButton}
                        titleStyle={{ color: colors.semantic.error }}
                        containerStyle={styles.buttonWrapper}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        padding: spacing.m,
        backgroundColor: colors.white,
    },
    titleInput: {
        borderBottomWidth: 0,
        marginBottom: spacing.s,
    },
    titleText: {
        fontSize: typography.sizes.h2,
        fontWeight: typography.weights.bold,
        color: colors.primary.dark,
    },
    contentInput: {
        borderBottomWidth: 0,
        minHeight: 200,
    },
    contentText: {
        fontSize: typography.sizes.body,
        color: colors.secondary.dark,
        lineHeight: 24,
    },
    buttonContainer: {
        marginTop: spacing.xl,
        marginBottom: spacing.xxl,
    },
    buttonWrapper: {
        marginBottom: spacing.m,
    },
    saveButton: {
        backgroundColor: colors.primary.blue,
        borderRadius: 24,
        paddingVertical: spacing.m,
    },
    deleteButton: {
        borderColor: colors.semantic.error,
        borderRadius: 24,
        paddingVertical: spacing.m,
    },
});

export default JournalEntryScreen;
