import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/language');
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <View style={styles.logoCircle}>
          <MaterialIcons name="handshake" size={34} color="#178CFD" />
        </View>
        <Text style={styles.brand}>CareMate</Text>
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888"
            keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888"
            secureTextEntry value={password} onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.inputIcon}>
            <MaterialIcons name="visibility-off" size={22} color="#178CFD" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.otpBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.otpBtnText}>LOGIN</Text>}
        </TouchableOpacity>
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f7faff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '92%',
    maxWidth: 410,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 38,
    paddingHorizontal: 22,
    shadowColor: '#b6caf8',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 26,
    elevation: 8,
    marginVertical: 35,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  brand: {
    color: '#232E43',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 18,
    marginTop: 0,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#232E43',
    marginBottom: 24,
    marginTop: 0,
    letterSpacing: 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f8fd',
    borderRadius: 16,
    borderWidth: 1.3,
    borderColor: '#e3e9f9',
    elevation: 2,
    shadowColor: '#dde5fa',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: '100%',
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#232E43',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  inputIcon: {
    marginLeft: 6,
  },
  otpBtn: {
    backgroundColor: '#178CFD',
    borderRadius: 18,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 33,
    elevation: 1,
    shadowColor: '#477dca',
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
  otpBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
    marginBottom: 7,
  },
  signupText: {
    fontSize: 14,
    color: '#6C7493',
  },
  signupLink: {
    fontWeight: 'bold',
    color: '#178CFD',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginLeft: 1,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ececec',
    marginTop: 4,
    shadowColor: '#e4e4ec',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleBtnText: {
    color: '#717171',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
