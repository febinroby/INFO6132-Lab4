import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import EventCard from '../../components/EventCard';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function EventListScreen({ navigation }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const q = query(collection(db, 'events'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            });

            return unsubscribe;
        };

        fetchEvents();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Events</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EventCard
                        event={item}
                        onEdit={(event) => navigation.navigate('AddEditEvent', { eventId: event.id, existingEvent: event })}
                        onDelete={(eventId) => console.log('Delete event logic here')}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
});