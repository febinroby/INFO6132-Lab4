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
            <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});