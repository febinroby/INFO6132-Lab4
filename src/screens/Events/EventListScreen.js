import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Button } from 'react-native';
import EventCard from '../../components/EventCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc, getDocs, addDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function EventListScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState(new Set()); // Track favorites as a Set of eventIds

    // Function to fetch events from Firestore
    const fetchEvents = async () => {
        const user = auth.currentUser;
        if (!user) {
            return;
        }

        const q = query(collection(db, 'events'), where('createdBy', '==', user.uid));  
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedEvents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setEvents(fetchedEvents);
        });

        return unsubscribe;
    };

    // Function to fetch favorite events for the current user
    const fetchFavorites = async () => {
        const user = auth.currentUser;
        if (!user) {
            return;
        }

        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favoriteEventIds = new Set();
            snapshot.docs.forEach(doc => {
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

    // Use useFocusEffect to reload the events and favorites when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchEvents();
            fetchFavorites();
        }, [])
    );

    // Function to delete the event
    const deleteEvent = async (eventId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await deleteDoc(eventRef);
            alert('Your event has been deleted successfully.');
        } catch (error) {
            alert('Your event could not be deleted.');
        }
    };

    // Function to handle toggling favorites
    const toggleFavorite = async (eventId) => {
        const user = auth.currentUser;
        if (!user) {
            return;
        }

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

        // After toggling the favorite, update the favorites state
        fetchFavorites(); // Refresh the favorites list
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate('AddEditEvent')}
                    title="Add Event"
                    color="blue"
                />
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            {auth.currentUser ? (
                <>
                    <Text style={styles.title}>Events</Text>
                    <FlatList
                        data={events}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                event={item}
                                isFavorite={favorites.has(item.id)} // Pass updated favorite status
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
                    />
                </>
            ) : (
                <Text style={styles.errorMessage}>Please log in to view events.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    errorMessage: { fontSize: 16, textAlign: 'center', color: 'red' },
});
