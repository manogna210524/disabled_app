import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase'; // adjust path if needed

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Success', 'Check your email for confirmation!');
      router.replace('/login');
    }
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => router.replace('/login')}>
        <Ionicons name="arrow-back" size={28} color="#31374b" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.label}></Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#a1aec6"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}></Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#a1aec6"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}></Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a1aec6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.createButtonText}>Sign Up</Text>
          }
        </TouchableOpacity>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f7fbff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 22,
    zIndex: 2,
  },
  card: {
    width: 340,
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#d7dfea',
    shadowOpacity: 0.17,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#31374b',
    marginBottom: 18,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif',
  },
  label: {
    fontSize: 16,
    color: '#31374b',
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    width: '100%',
    fontSize: 17,
    borderRadius: 12,
    backgroundColor: '#eef2f6',
    marginBottom: 8,
    paddingVertical: 11,
    paddingHorizontal: 15,
    color: '#272f44',
    borderWidth: 1.2,
    borderColor: '#e8eaf0',
  },
  createButton: {
    width: '100%',
    backgroundColor: '#2982f8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 7,
    borderWidth: 0,
    shadowColor: '#82b4ff',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  footerText: {
    color: '#31374b',
    fontSize: 15,
  },
  loginLink: {
    color: '#1573e8',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
  