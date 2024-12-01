import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ event, isFavorite, onFavoriteToggle, onEdit, onDelete, canEditDelete }) => {
    if (!event) return null;

    return (
      <View style={styles.card}>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <TouchableOpacity onPress={onFavoriteToggle} style={styles.favoriteButton}>
              <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? '#e74c3c' : '#7f8c8d'}
              />
          </TouchableOpacity>

          {canEditDelete && (
              <View style={styles.actions}>
                  <TouchableOpacity onPress={() => onEdit(event)} style={styles.actionButton}>
                      <Ionicons name="pencil" size={24} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(event.id)} style={styles.actionButton}>
                      <Ionicons name="trash" size={24} color="#e74c3c" />
                  </TouchableOpacity>
              </View>
          )}
      </View>
  );
};

const styles = StyleSheet.create({
    card: {
        padding: 20,
        marginVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 18,
        lineHeight: 22,
    },
    favoriteButton: {
        position: 'absolute',
        top: 15,
        right: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionButton: {
        marginLeft: 15,
    },
});

export default EventCard;
