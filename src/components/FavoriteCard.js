import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteCard({ favorite, onRemove }) {
    // Log the favorite object for debugging purposes
    console.log("Favorite object received:", favorite);

    // Validate that the required fields exist in the favorite object
    if (!favorite || !favorite.eventData || !favorite.eventId || !favorite.userId) {
        console.error('Invalid favorite object:', favorite);
        return <Text style={styles.errorText}>Invalid favorite object</Text>; // Display error message in UI
    }

    const handleRemoveFavorite = async () => {
        try {
            const favoritesRef = collection(db, 'favorites');
            const q = query(
                favoritesRef,
                where('userId', '==', favorite.userId),
                where('eventId', '==', favorite.eventData.id)  // Use eventData.id for event reference
            );

            // Fetch the matching document
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Favorite not found!');
                return;
            }

            // Since no duplicates are allowed, safely delete the single document
            const docId = querySnapshot.docs[0].id;
            await deleteDoc(doc(db, 'favorites', docId));

            alert('Event removed from favorites!');
            if (onRemove) onRemove(); // Trigger callback to refresh UI
        } catch (error) {
            console.error('Error removing favorite:', error.message);
            alert('Failed to remove favorite. Please try again.');
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{favorite.eventData.name || 'Untitled Event'}</Text>
            <Text style={styles.description}>
                {favorite.eventData.description || 'No description provided'}
            </Text>
            <Button title="Remove" onPress={handleRemoveFavorite} />
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
    createdBy: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    }
});
