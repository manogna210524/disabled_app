import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // For microphone permissions
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PermissionModal from '../../components/PermissionModal';

const permissionOrder = ['location', 'contacts', 'microphone', 'notifications'] as const;

export default function WelcomeVoiceScreen() {
  const router = useRouter();
  const [permStep, setPermStep] = useState<number | null>(null);

  const askPermission = async (type: string) => {
    if (type === 'location') {
      await Location.requestForegroundPermissionsAsync();
    } else if (type === 'contacts') {
      await Contacts.requestPermissionsAsync();
    } else if (type === 'microphone') {
      await Audio.requestPermissionsAsync();
    } else if (type === 'notifications') {
      await Notifications.requestPermissionsAsync();
    }
  };

  const handleAllow = async () => {
    if (permStep !== null) {
      await askPermission(permissionOrder[permStep]);
      if (permStep < permissionOrder.length - 1) {
        setPermStep(permStep + 1);
      } else {
        setPermStep(null);
        router.push('/listening'); // Go to Listening screen
      }
    }
  };

  const handleDeny = () => {
    if (permStep !== null) {
      if (permStep < permissionOrder.length - 1) {
        setPermStep(permStep + 1);
      } else {
        setPermStep(null);
        router.push('/listening');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.micCircle}>
        <Ionicons name="mic" size={64} color="#0a1663" />
      </View>
      <Text style={styles.subtitle}>How can I assist you today?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setPermStep(0)}
      >
        <Text style={styles.buttonText}>TAP TO START</Text>
      </TouchableOpacity>

      {/* Permission Popups */}
      {permStep !== null && (
        <PermissionModal
          visible={true}
          type={permissionOrder[permStep]}
          onAllow={handleAllow}
          onDeny={handleDeny}
        />
      )}
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
    marginBottom: 36,
    fontFamily: 'serif',
  },
  micCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 2,
    borderColor: '#0a1663',
  },
  subtitle: {
    fontSize: 16,
    color: '#0a1663',
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    borderWidth: 2,
    borderColor: '#0a1663',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#0a1663',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});