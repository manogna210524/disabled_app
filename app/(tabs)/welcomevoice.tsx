import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PermissionModal from '../../components/PermissionModal';

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MIC_SIZE = 130;

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
        if (!canAskAgain) setPermanentDenials(prev => new Set(prev).add(type));
      } else if (type === 'contacts') {
        const { status: contactStatus, canAskAgain } = await Contacts.requestPermissionsAsync();
        status = contactStatus;
        if (!canAskAgain) setPermanentDenials(prev => new Set(prev).add(type));
      } else if (type === 'microphone') {
        const { status: micStatus, canAskAgain } = await Audio.requestPermissionsAsync();
        status = micStatus;
        if (!canAskAgain) setPermanentDenials(prev => new Set(prev).add(type));
      } else if (type === 'notifications') {
        const { status: notifStatus, canAskAgain } = await Notifications.requestPermissionsAsync();
        status = notifStatus;
        if (!canAskAgain) setPermanentDenials(prev => new Set(prev).add(type));
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
      {/* Blue half-screen top background */}
      <View style={styles.topBlue}>
        <Ionicons name="star-outline" size={22} color="#fff" style={styles.starIcon} />
        <View style={styles.micRing}>
          <Ionicons name="mic" size={92} color="#fff" />
        </View>
      </View>
      {/* Speech bubble card */}
      <View style={styles.speechCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
          <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
        <Text style={styles.speechText}>What's on my calendar for tomorrow?</Text>
      </View>
      {/* Tap to Start button */}
      <TouchableOpacity style={styles.startBtn} onPress={() => setPermStep(0)}>
        <Text style={styles.startText}>TAP TO START</Text>
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
    backgroundColor: '#fafdff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBlue: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#2da7f8',
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: 42,
    right: 22,
    zIndex: 10,
    opacity: 0.98,
  },
  micRing: {
    marginTop: 16,
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    backgroundColor: '#2da7f8',
    borderWidth: 9,
    borderColor: '#79d3ff44',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1985ea',
    shadowOpacity: 0.15,
    shadowRadius: 11,
    elevation: 9,
  },
  speechCard: {
    marginTop: -51,
    marginBottom: 36,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH * 0.85,
    borderRadius: 14,
    paddingVertical: 21,
    paddingHorizontal: 16,
    shadowColor: '#93cdff',
    shadowOpacity: 0.13,
    shadowRadius: 11,
    elevation: 7,
    alignSelf: 'center',
  },
  avatar: {
    width: 29,
    height: 29,
    borderRadius: 14.5,
    marginRight: 9,
  },
  listeningText: {
    fontWeight: 'bold',
    color: '#2da7f8',
    fontSize: 16,
    marginBottom: 1,
  },
  speechText: {
    color: '#232750',
    fontSize: 17,
    marginLeft: 2,
    marginTop: 2,
  },
  startBtn: {
    backgroundColor: '#2da7f8',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 54,
    paddingVertical: 14,
    alignSelf: 'center',
    marginTop: 14,
    shadowColor: '#0099ff',
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 7,
  },
  startText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.7,
  },
});
