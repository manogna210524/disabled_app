import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TextToSpeechScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const speak = () => {
    if (message.trim()) {
      Speech.speak(message, {
        language: 'en-US',
        pitch: 1.0,
        rate: voiceSpeed ? 1.2 : 0.8,
      });
      setIsSpeaking(true);
    }
  };

  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <View style={[styles.bg, highContrast && { backgroundColor: '#000' }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/home')}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={highContrast ? '#FFD700' : '#2871e6'}
        />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.headerCentered}>
          <View style={[styles.headerIconCircle, highContrast && { backgroundColor: '#FFD700' }]}>
            <Ionicons
              name="mic"
              size={30}
              color={highContrast ? '#000' : '#2871e6'}
            />
          </View>
        </View>
        <Text style={[styles.headerTitle, highContrast && { color: '#FFD700' }]}>
          Text to Speech
        </Text>
        <Text style={[styles.caption, highContrast && { color: '#FFF' }]}>
          Type your message and play it aloud!
        </Text>

        <View style={[styles.inputBox, highContrast && { backgroundColor: '#000' }]}>
          <TextInput
            style={[styles.input, highContrast && { color: '#FFD700' }]}
            placeholder="Your message..."
            placeholderTextColor={highContrast ? '#FFD70099' : '#b2bfd8'}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.playBtn, isSpeaking && styles.disabledBtn, highContrast && { backgroundColor: '#FFD700' }]}
              onPress={speak}
              disabled={isSpeaking}
            >
              <MaterialIcons
                name="play-arrow"
                size={28}
                color={highContrast ? '#000' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stopBtn, !isSpeaking && styles.disabledBtn, highContrast && { backgroundColor: '#FFD700' }]}
              onPress={stop}
              disabled={!isSpeaking}
            >
              <MaterialIcons
                name="stop"
                size={26}
                color={highContrast ? '#000' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingsCard, highContrast && { backgroundColor: '#000', borderColor: '#FFD700' }]}>
          <Text style={[styles.settingsHeader, highContrast && { color: '#FFD700' }]}>Settings</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, highContrast && { color: '#FFD700' }]}>Voice Speed</Text>
            <Switch
              value={voiceSpeed}
              onValueChange={setVoiceSpeed}
              trackColor={{ true: highContrast ? '#FFD700' : '#2871e6' }}
              thumbColor={highContrast ? '#000' : '#fff'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, highContrast && { color: '#FFD700' }]}>High Contrast</Text>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ true: '#FFD700' }}
              thumbColor={highContrast ? '#000' : '#fff'}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f4f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
  },
  backBtn: {
    position: 'absolute',
    top: 38,
    left: 18,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '93%',
    maxWidth: 400,
    borderRadius: 32,
    paddingVertical: 36,
    paddingHorizontal: 20,
    shadowColor: '#2871e6',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 13,
    alignItems: 'center',
    marginTop: 30,
  },
  headerCentered: {
    alignItems: 'center',
    marginBottom: 9,
  },
  headerIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e8f1fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#2871e6',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#2871e6',
    letterSpacing: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  caption: {
    fontSize: 15.5,
    color: '#222b4a',
    fontWeight: '500',
    marginBottom: 21,
    textAlign: 'center',
  },
  inputBox: {
    width: '100%',
    backgroundColor: '#f7fafd',
    borderRadius: 15,
    borderWidth: 1.7,
    borderColor: '#cae1ff',
    padding: 14,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#2871e6',
  },
  input: {
    width: '100%',
    minHeight: 130,
    fontSize: 16,
    color: '#222b4a',
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  playBtn: {
    backgroundColor: '#2871e6',
    width: 56,
    height: 56,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 6,
  },
  stopBtn: {
    backgroundColor: '#e84848',
    width: 56,
    height: 56,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 6,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  settingsCard: {
    width: '100%',
    backgroundColor: '#f7fafd',
    borderRadius: 18,
    padding: 15,
    shadowColor: '#2871e6',
    elevation: 2,
    marginTop: 3,
  },
  settingsHeader: {
    fontSize: 16,
    color: '#2871e6',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    borderColor: '#e1e7ed',
    borderWidth: 0.5,
    marginVertical: 6,
  },
  settingLabel: {
    fontSize: 16,
    color: '#222b4a',
    fontWeight: '500',
  },
});
