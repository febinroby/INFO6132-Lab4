import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

export default function FavoriteListScreen() {
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setFavorites(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleRemoveFavorite = async (favoriteId) => {
        try {
            await deleteDoc(doc(db, 'favorites', favoriteId));
            fetchFavorites();
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorite Events</Text>
            <FlatList
                data={favorites}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.event}>
                        <Text>{item.name}</Text>
                        <Button title="Remove" onPress={() => handleRemoveFavorite(item.id)} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    event: { padding: 10, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },
});