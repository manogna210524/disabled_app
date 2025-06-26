import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid, Platform,
  StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';

async function requestMicrophonePermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone for speech recognition.',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

// Define styles BEFORE using them in the component
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa', paddingHorizontal: 20, paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#071c6b', marginLeft: 16, letterSpacing: 1 },
  micCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#071c6b', justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 24,
  },
  listening: {
    backgroundColor: '#e63946',
  },
  questionBox: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignSelf: 'center',
    minWidth: 220,
    minHeight: 100,
    justifyContent: 'center',
  },
  questionText: { fontSize: 18, color: '#222', textAlign: 'center' },
  placeholderText: { fontSize: 18, color: '#888', textAlign: 'center', fontStyle: 'italic' },
  errorText: { fontSize: 16, color: '#e63946', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 10 },
  speakerBtn: {
    backgroundColor: '#071c6b',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  speakerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  optionalText: { color: '#888', fontSize: 16 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  toggleLabel: { fontSize: 16, color: '#071c6b', fontWeight: 'bold' },
});

export default function SpeechToTextScreen() {
  const router = useRouter();
  const [muteUI, setMuteUI] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Setup voice listeners
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setTranscript(e.value[0]);
      }
    };

    Voice.onSpeechError = (e) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          setError('Microphone permission denied.');
          return;
        }
        setTranscript('');
        setError('');
        await Voice.start('en-US');
        setIsListening(true);
      }
    } catch (e) {
      setError(String(e));
      setIsListening(false);
    }
  };

  const speakTranscript = () => {
    if (transcript.trim()) {
      Speech.speak(transcript);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={28} color="#071c6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SPEECH-TO-TEXT</Text>
      </View>

      {/* Microphone Circle */}
      <TouchableOpacity onPress={toggleListening}>
        <View style={[styles.micCircle, isListening && styles.listening]}>
          <MaterialIcons
            name={isListening ? 'mic-off' : 'mic'}
            size={80}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      {/* Question Display */}
      <View style={styles.questionBox}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : transcript ? (
          <Text style={styles.questionText}>{transcript}</Text>
        ) : (
          <Text style={styles.placeholderText}>What's on my calendar?</Text>
        )}
      </View>

      {/* Speaker Button and Mute Toggle */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.speakerBtn}
          onPress={speakTranscript}
          disabled={!transcript}
        >
          <Text style={styles.speakerText}>Speaker</Text>
        </TouchableOpacity>
        <Text style={styles.optionalText}>(Optional)</Text>
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Mute UI Sounds</Text>
        <Switch
          value={muteUI}
          onValueChange={setMuteUI}
          trackColor={{ false: '#ccc', true: '#0a1663' }}
        />
      </View>
    </View>
  );
}
