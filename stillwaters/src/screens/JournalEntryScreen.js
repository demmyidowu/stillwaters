import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button, Icon, useTheme } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useJournalStore from '../store/useJournalStore';

/**
 * Journal Entry Screen
 * 
 * Allows users to create a new journal entry or edit an existing one.
 */
const JournalEntryScreen = ({ route, navigation }) => {
    const { entry } = route.params || {};
    const isEditing = !!entry;
    const { theme } = useTheme();

    const [title, setTitle] = useState(entry ? entry.title : '');
    const [content, setContent] = useState(entry ? entry.content : '');
    const [tags, setTags] = useState(entry ? entry.tags.join(', ') : '');

    const { addEntry, updateEntry, deleteEntry, isLoading } = useJournalStore();

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Incomplete Entry', 'Please add a title and some thoughts before saving.');
            return;
        }

        const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (isEditing) {
            await updateEntry(entry.id, { title, content, tags: tagList });
        } else {
            await addEntry({ title, content, tags: tagList });
        }
        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this reflection?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteEntry(entry.id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView}>
                <TextInput
                    style={[styles.titleInput, { color: theme.colors.black }]}
                    placeholder="Title your reflection..."
                    placeholderTextColor={theme.colors.grey1}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />

                <View style={[styles.divider, { backgroundColor: theme.colors.grey0 }]} />

                <TextInput
                    style={[styles.contentInput, { color: theme.colors.black }]}
                    placeholder="Pour out your heart..."
                    placeholderTextColor={theme.colors.grey1}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />

                <View style={[styles.tagsInputContainer, { borderTopColor: theme.colors.grey0 }]}>
                    <Icon name="pricetag-outline" type="ionicon" size={20} color={theme.colors.grey1} style={styles.tagIcon} />
                    <TextInput
                        style={[styles.tagsInput, { color: theme.colors.black }]}
                        placeholder="Tags (comma separated)..."
                        placeholderTextColor={theme.colors.grey1}
                        value={tags}
                        onChangeText={setTags}
                    />
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: theme.colors.grey0, backgroundColor: theme.colors.white }]}>
                {isEditing && (
                    <Button
                        type="clear"
                        icon={<Icon name="trash-outline" type="ionicon" color={theme.colors.error} />}
                        onPress={handleDelete}
                        containerStyle={styles.deleteButton}
                    />
                )}
                <Button
                    title="Save Reflection"
                    onPress={handleSave}
                    loading={isLoading}
                    containerStyle={[styles.saveButton, isEditing ? { flex: 1 } : { width: '100%' }]}
                    buttonStyle={{ backgroundColor: theme.colors.primary }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: spacing.m,
    },
    titleInput: {
        fontSize: typography.sizes.h3,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.s,
        paddingVertical: spacing.s,
    },
    divider: {
        height: 1,
        marginBottom: spacing.m,
    },
    contentInput: {
        fontSize: typography.sizes.body,
        lineHeight: 24,
        minHeight: 200,
        marginBottom: spacing.l,
    },
    tagsInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing.m,
        borderTopWidth: 1,
        marginBottom: spacing.xxl,
    },
    tagIcon: {
        marginRight: spacing.s,
    },
    tagsInput: {
        flex: 1,
        fontSize: typography.sizes.body,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.m,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    deleteButton: {
        marginRight: spacing.m,
    },
    saveButton: {
        // Flex handled dynamically
    },
});

export default JournalEntryScreen;
