import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';

export default function AddEditEventScreen({ route, navigation }) {
    const { eventId, existingEvent } = route.params || {};
    const [eventName, setEventName] = useState(existingEvent?.name || '');
    const [eventDescription, setEventDescription] = useState(existingEvent?.description || '');

    const handleSave = async () => {
        if (!eventName.trim()) {
            alert('Event name is required.');
            return;
        }

        try {
            if (eventId) {
                // Update event
                const eventDoc = doc(db, 'events', eventId);
                await updateDoc(eventDoc, { name: eventName, description: eventDescription });
            } else {
                // Add new event
                await addDoc(collection(db, 'events'), {
                    name: eventName,
                    description: eventDescription,
                    createdBy: auth.currentUser.uid,
                });
            }
            navigation.goBack();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{eventId ? 'Edit Event' : 'Add Event'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Event Description"
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10 },
    textArea: { height: 100, textAlignVertical: 'top' },
});