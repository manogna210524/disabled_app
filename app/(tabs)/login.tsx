import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      {/* Mobile Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Mobile No."
        placeholderTextColor="#0a1663"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
        maxLength={10}
      />

      {/* Get OTP Button */}
      <TouchableOpacity style={styles.button} onPress={() => {/* handle OTP send */}}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>

      {/* OTP Input */}
      <TextInput
        style={styles.input}
        placeholder="OTP"
        placeholderTextColor="#0a1663"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      {/* Verify OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/welcomevoice')}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.linkText, styles.linkBold]}>Sign up.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a1663',
    marginBottom: 32,
    fontFamily: 'serif',
  },
  input: {
    width: '100%',
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#0a1663',
    marginBottom: 24,
    paddingVertical: 8,
    color: '#0a1663',
    backgroundColor: 'transparent',
  },
  button: {
    width: '100%',
    backgroundColor: '#0a1663',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#0a1663',
    fontSize: 15,
  },
  linkBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
