import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';

export default function EventCard({ event, onEdit, onDelete }) {
    const handleAddToFavorites = async () => {
        try {
            await addDoc(collection(db, 'favorites'), {
                name: event.name,
                description: event.description,
                userId: auth.currentUser.uid,
            });
            alert('Event added to favorites!');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
            {event.createdBy === auth.currentUser.uid && (
                <View style={styles.actions}>
                    <Button title="Edit" onPress={() => onEdit(event)} />
                    <Button title="Delete" onPress={() => onDelete(event.id)} />
                </View>
            )}
            <Button title="Favorite" onPress={handleAddToFavorites} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});