import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Button } from 'react-native';
import EventCard from '../../components/EventCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook

export default function EventListScreen({ navigation }) {
    const [events, setEvents] = useState([]);

    // Function to fetch events from Firestore
    const fetchEvents = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user is logged in');
            return;
        }

        const q = query(collection(db, 'events'), where('createdBy', '==', user.uid));  // Filter events by owner
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedEvents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setEvents(fetchedEvents);
        });

        return unsubscribe;
    };

    useEffect(() => {
        // Initial fetch when the component mounts
        fetchEvents();
    }, []);

    // Use useFocusEffect to reload the events when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchEvents(); // Fetch events when the screen is focused
        }, [])
    );

    // Function to delete the event
    const deleteEvent = async (eventId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await deleteDoc(eventRef);
            console.log('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    };

    // Set the header options for the Add button
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
                                onEdit={(event) => navigation.navigate('AddEditEvent', { eventId: event.id, existingEvent: event })}
                                onDelete={(eventId) => {
                                    // Confirm deletion
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
