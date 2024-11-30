import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db } from '../config/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteCard({ favorite, onRemove }) {
    const handleRemoveFavorite = async () => {
        try {
            await deleteDoc(doc(db, 'favorites', favorite.id));
            alert('Event removed from favorites!');
            if (onRemove) onRemove();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{favorite.name}</Text>
            <Text style={styles.description}>{favorite.description}</Text>
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
});