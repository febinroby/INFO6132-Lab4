import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For the heart icon

const EventCard = ({ event, isFavorite, onFavoriteToggle, onEdit, onDelete }) => {
    if (!event) return null;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{event.name || 'Untitled Event'}</Text>
            <Text style={styles.description}>{event.description || 'No description provided'}</Text>
            <View style={styles.buttonContainer}>
                {event.createdBy && (
                    <>
                        <Button title="Edit" onPress={() => onEdit(event)} />
                        <Button title="Delete" onPress={() => onDelete(event.id)} color="red" />
                    </>
                )}
                <TouchableOpacity onPress={onFavoriteToggle}>
                    <FontAwesome
                        name={isFavorite ? 'heart' : 'heart-o'}
                        size={24}
                        color={isFavorite ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default EventCard;
