import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
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
            <View style={styles.card}>
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
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{eventId ? 'Update' : 'Add'} Event</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#343a40' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#495057',
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    saveButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
