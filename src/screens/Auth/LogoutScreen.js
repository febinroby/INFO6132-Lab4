import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../config/firebaseConfig';

export default function LogoutScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: async () => {
                try {
                    await auth.signOut();
                    Alert.alert('Success', 'You have been logged out.');
                    navigation.navigate('Login');
                } catch (error) {
                    Alert.alert('Error', error.message);
                }
            }},
        ]
    );
  };

  return (
    <View style={styles.container}>
        <View style={styles.card}>
            <Button title="Logout" onPress={handleLogout} color="#fff" />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '80%',
        backgroundColor: '#d9534f', // Red color for logout button
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
});
