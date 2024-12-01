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
            const favoriteData = await Promise.all(
                favoriteDocs.map(async (favDoc) => {
                    const { userId, eventId } = favDoc;
                    const eventDoc = await getDoc(doc(db, 'events', eventId));

                    if (eventDoc.exists()) {
                        const eventData = eventDoc.data();

                        return {
                            id: favDoc.id,
                            userId,
                            eventId,
                            eventData,
                        };
                    }
                    return null;
                })
            );
            setFavorites(favoriteData.filter(Boolean));
            setLoading(false);
        };

        const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favoriteDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            fetchEventDetails(favoriteDocs);
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
                <>
                    <Text style={styles.title}>Your Favorites</Text>
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <FavoriteCard favorite={item} onRemove={fetchFavoritesWithDetails} />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No favorites found!</Text>}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});
