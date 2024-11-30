import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import FavoriteCard from '../../components/FavoriteCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function FavoriteListScreen() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setFavorites(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            });

            return unsubscribe;
        };

        fetchFavorites();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <FavoriteCard favorite={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
});