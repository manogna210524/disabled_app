import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
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
        router.push('/listening');
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
        <Ionicons name="mic" size={80} color="#fff" />
      </View>
      <Text style={styles.subtitle}>How can I assist you{`\n`}today?</Text>
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
    marginBottom: 40,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  micCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0a1663',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  subtitle: {
    fontSize: 18,
    color: '#0a1663',
    marginBottom: 60,
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: '500',
  },
  button: {
    borderWidth: 1,
    borderColor: '#0a1663',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#f4f6fa',
  },
  buttonText: {
    color: '#0a1663',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'serif',
  },
});
