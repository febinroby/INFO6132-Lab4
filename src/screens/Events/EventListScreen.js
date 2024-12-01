import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import EventCard from '../../components/EventCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc, getDocs, addDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EventListScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState(new Set());

    const fetchEvents = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'events'), where('createdBy', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedEvents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setEvents(fetchedEvents);
        });

        return unsubscribe;
    };

    const fetchFavorites = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favoriteEventIds = new Set();
            snapshot.docs.forEach((doc) => {
                favoriteEventIds.add(doc.data().eventId);
            });
            setFavorites(favoriteEventIds);
        });

        return unsubscribe;
    };

    useEffect(() => {
        fetchEvents();
        fetchFavorites();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchEvents();
            fetchFavorites();
        }, [])
    );

    const deleteEvent = async (eventId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await deleteDoc(eventRef);

            const favoritesRef = collection(db, 'favorites');
            const favoritesQuery = query(favoritesRef, where('eventId', '==', eventId));
            const querySnapshot = await getDocs(favoritesQuery);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            alert('Your event has been deleted successfully.');
        } catch (error) {
            alert('There was an issue deleting your event.');
        }
    };

    const toggleFavorite = async (eventId) => {
        const user = auth.currentUser;
        if (!user) return;

        const favoritesRef = collection(db, 'favorites');
        const favoriteDoc = query(favoritesRef, where('userId', '==', user.uid), where('eventId', '==', eventId));
        const querySnapshot = await getDocs(favoriteDoc);

        if (querySnapshot.empty) {
            await addDoc(favoritesRef, {
                userId: user.uid,
                eventId: eventId,
            });
        } else {
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }

        fetchFavorites();
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditEvent')}
                    style={styles.addButton}
                >
                    <Ionicons name="add-circle-outline" size={28} color="#007bff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            {auth.currentUser ? (
                <>
                    <Text style={styles.title}>Your Events</Text>
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                event={item}
                                isFavorite={favorites.has(item.id)}
                                onFavoriteToggle={() => toggleFavorite(item.id)}
                                onEdit={(event) => navigation.navigate('AddEditEvent', { eventId: event.id, existingEvent: event })}
                                onDelete={(eventId) => {
                                    Alert.alert(
                                        'Delete Event',
                                        'Are you sure you want to delete this event?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Delete', onPress: () => deleteEvent(eventId), style: 'destructive' },
                                        ]
                                    );
                                }}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No events found. Start by adding one!</Text>}
                    />
                </>
            ) : (
                <Text style={styles.errorMessage}>Please log in to view events.</Text>
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
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    errorMessage: {
        fontSize: 16,
        color: '#d9534f',
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        marginRight: 10,
    },
});
