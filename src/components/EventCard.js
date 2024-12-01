import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../config/firebaseConfig';

const EventCard = ({ event, onEdit, onDelete }) => {
    const user = auth.currentUser;

    // Validate event data
    if (!event) {
        console.warn('Event is undefined');
        return null;
    }

    // Validate user authentication
    if (!user) {
        console.warn('User is not logged in');
        return null;
    }

    const isOwner = user.uid === event.createdBy;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{event.name || 'Untitled Event'}</Text>
            <Text style={styles.description}>{event.description || 'No description provided'}</Text>

            {isOwner && (
                <View style={styles.buttonContainer}>
                    <Button title="Edit" onPress={() => onEdit(event)} />
                    <Button title="Delete" onPress={() => onDelete(event.id)} color="red" />
                </View>
            )}
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
    },
});

export default EventCard;