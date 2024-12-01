import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons'; // For the heart icon

const EventCard = ({ event, onEdit, onDelete }) => {
    const user = auth.currentUser;

    if (!event || !user) return null;

    const isOwner = user.uid === event.createdBy;
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const checkIfFavorited = async () => {
            const q = query(
                collection(db, 'favorites'),
                where('userId', '==', user.uid),
                where('eventId', '==', event.id)
            );
            const querySnapshot = await getDocs(q);
            setIsFavorited(!querySnapshot.empty);
        };

        checkIfFavorited();
    }, [event.id, user.uid]);

    const toggleFavorite = async () => {
        const favoritesRef = collection(db, 'favorites');

        try {
            if (isFavorited) {
                const q = query(
                    favoritesRef,
                    where('userId', '==', user.uid),
                    where('eventId', '==', event.id)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (docSnapshot) => {
                        await deleteDoc(docSnapshot.ref);
                    });
                }
            } else {
                await setDoc(doc(favoritesRef), {
                    eventId: event.id,
                    userId: user.uid,
                });
            }

            setIsFavorited(!isFavorited);
        } catch (error) {
            console.error('Error toggling favorite: ', error);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{event.name || 'Untitled Event'}</Text>
            <Text style={styles.description}>{event.description || 'No description provided'}</Text>
            <View style={styles.buttonContainer}>
                {isOwner && (
                    <>
                        <Button title="Edit" onPress={() => onEdit(event)} />
                        <Button title="Delete" onPress={() => onDelete(event.id)} color="red" />
                    </>
                )}
                <TouchableOpacity onPress={toggleFavorite}>
                    <FontAwesome
                        name={isFavorited ? 'heart' : 'heart-o'}
                        size={24}
                        color={isFavorited ? 'red' : 'gray'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default EventCard;
