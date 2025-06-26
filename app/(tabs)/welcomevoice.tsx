import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PermissionModal from '../../components/PermissionModal';

const permissionOrder = ['location', 'contacts', 'microphone', 'notifications'] as const;

export default function WelcomeVoiceScreen() {
  const router = useRouter();
  const [permStep, setPermStep] = useState<number | null>(null);
  const [permanentDenials, setPermanentDenials] = useState<Set<string>>(new Set());

  // Check permissions and onboarding status
  useEffect(() => {
    const checkPermissions = async () => {
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');
      if (onboardingComplete === 'true') {
        router.push('/listening');
        return;
      }

      for (let i = 0; i < permissionOrder.length; i++) {
        const type = permissionOrder[i];
        const status = await AsyncStorage.getItem(`perm_${type}`);
        if (status !== 'granted') {
          setPermStep(i);
          return;
        }
      }
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.push('/listening');
    };
    checkPermissions();
  }, []);

  // Request permission and store status
  const askPermission = async (type: string) => {
    let status;
    try {
      if (type === 'location') {
        const { status: locStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        status = locStatus;
        if (!canAskAgain) permanentDenials.add(type);
      } 
      else if (type === 'contacts') {
        const { status: contactStatus, canAskAgain } = await Contacts.requestPermissionsAsync();
        status = contactStatus;
        if (!canAskAgain) permanentDenials.add(type);
      } 
      else if (type === 'microphone') {
        const { status: micStatus, canAskAgain } = await Audio.requestPermissionsAsync();
        status = micStatus;
        if (!canAskAgain) permanentDenials.add(type);
      } 
      else if (type === 'notifications') {
        const { status: notifStatus, canAskAgain } = await Notifications.requestPermissionsAsync();
        status = notifStatus;
        if (!canAskAgain) permanentDenials.add(type);
      }
      
      await AsyncStorage.setItem(`perm_${type}`, status || 'undetermined');
      return status;
    } catch (error) {
      console.error(`Permission error for ${type}:`, error);
      return 'undetermined';
    }
  };

  const handleAllow = async () => {
    if (permStep === null) return;
    const type = permissionOrder[permStep];
    const status = await askPermission(type);

    if (status === 'granted') {
      if (permStep < permissionOrder.length - 1) {
        setPermStep(permStep + 1);
      } else {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        setPermStep(null);
        router.push('/listening');
      }
    } else {
      handleDeny();
    }
  };

  const handleDeny = async () => {
    if (permStep === null) return;
    const type = permissionOrder[permStep];
    await AsyncStorage.setItem(`perm_${type}`, 'denied');
    
    if (permStep < permissionOrder.length - 1) {
      setPermStep(permStep + 1);
    } else {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      setPermStep(null);
      router.push('/listening');
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
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

      {permStep !== null && (
        <PermissionModal
          visible={true}
          type={permissionOrder[permStep]}
          onAllow={handleAllow}
          onDeny={handleDeny}
          onSettings={handleOpenSettings}
          isPermanentlyDenied={permanentDenials.has(permissionOrder[permStep])}
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

