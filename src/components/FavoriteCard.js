import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteCard({ favorite, onRemove }) {
    if (!favorite || !favorite.eventData || !favorite.eventId || !favorite.userId) {
        console.error('Invalid favorite object:', favorite);
        return <Text style={styles.errorText}>Invalid favorite object</Text>;
    }

    const handleRemoveFavorite = async () => {
        try {
            const favoritesRef = collection(db, 'favorites');
            const q = query(
                favoritesRef,
                where('userId', '==', favorite.userId),
                where('eventId', '==', favorite.eventId)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Favorite not found!');
                return;
            }

            const docId = querySnapshot.docs[0].id;
            await deleteDoc(doc(db, 'favorites', docId));

            alert('Event removed from favorites!');
            if (onRemove) onRemove(favorite.eventId);
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFavorite}>
                    <Text style={styles.buttonText}>Remove from Favorites</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 20,
        marginBottom: 15,
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
        alignItems: 'flex-start',
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});
