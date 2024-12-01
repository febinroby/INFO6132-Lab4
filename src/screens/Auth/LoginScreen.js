import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Main');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to your account</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.signUpText}>
                    Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        marginTop: 10,
    },
    signUpText: {
        fontSize: 14,
        color: '#666',
    },
    signUpLink: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});
