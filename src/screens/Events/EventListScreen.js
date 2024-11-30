import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import EventCard from '../../components/EventCard';

export default function EventListScreen({ navigation }) {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const querySnapshot = await getDocs(collection(db, 'events'));
        setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Events</Text>
            <Button title="Logout" onPress={handleLogout} />
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EventCard
                  event={item}
                  onEdit={(event) => navigation.navigate('AddEditEvent', { eventId: event.id, existingEvent: event })}
                  onDelete={(eventId) => handleDelete(eventId)}
                />
              )}
            />
            <Button title="Add Event" onPress={() => navigation.navigate('AddEditEvent')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    event: { padding: 10, borderBottomWidth: 1 },
});