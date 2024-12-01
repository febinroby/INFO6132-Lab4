import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
                        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(event)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(event.id)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                )}
                <TouchableOpacity onPress={onFavoriteToggle}>
                    <FontAwesome
                        name={isFavorite ? 'heart' : 'heart-o'}
                        size={24}
                        color={isFavorite ? '#e74c3c' : '#bdc3c7'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
        marginVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2c3e50',
    },
    description: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#3498db',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EventCard;
