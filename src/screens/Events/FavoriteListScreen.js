import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import FavoriteCard from '../../components/FavoriteCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoriteListScreen() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoritesWithDetails = useCallback(() => {
        const fetchEventDetails = async (favoriteDocs) => {
            console.log("Fetched favoriteDocs:", favoriteDocs); // Debugging line
            const favoriteData = await Promise.all(
                favoriteDocs.map(async (favDoc) => {
                    const { userId, eventId } = favDoc;  // Extract userId and eventId from favorite
                    const eventDoc = await getDoc(doc(db, 'events', eventId));  // Fetch event using eventId

                    if (eventDoc.exists()) {
                        const eventData = eventDoc.data(); // Get event data
                        console.log("Fetched event data:", eventData); // Debugging line

                        return {
                            id: favDoc.id, // The favorite document ID
                            userId, 
                            eventId,
                            eventData, // Merge event data
                        };
                    }
                    return null;
                })
            );
            setFavorites(favoriteData.filter(Boolean)); // Filter out null results
            setLoading(false);
        };

        const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favoriteDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            console.log("Favorite docs from Firestore:", favoriteDocs); // Debugging line
            fetchEventDetails(favoriteDocs); // Fetch detailed event data using eventId
        });

        return unsubscribe;
    }, []);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = fetchFavoritesWithDetails();
            return () => unsubscribe();
        }, [fetchFavoritesWithDetails])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : favorites.length === 0 ? (
                <Text style={styles.emptyText}>No favorites yet!</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <FavoriteCard favorite={item} onRemove={fetchFavoritesWithDetails} />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    loadingText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
    emptyText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
});
