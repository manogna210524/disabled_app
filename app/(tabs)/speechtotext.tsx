import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SpeechToTextScreen() {
  const router = useRouter();
  const [muteUI, setMuteUI] = useState(false);

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
      <View style={styles.micCircle}>
        <MaterialIcons name="mic" size={80} color="#fff" />
      </View>

      {/* Question Display */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>What's on my calender?</Text>
      </View>

      {/* Speaker Button and Mute Toggle */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.speakerBtn}>
          <Text style={styles.speakerText}>Speaker</Text>
        </TouchableOpacity>
        <Text style={styles.optionalText}>(Optional)</Text>
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Mute UI Sounds</Text>
        <Switch value={muteUI} onValueChange={setMuteUI} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa', paddingHorizontal: 20, paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#071c6b', marginLeft: 16, letterSpacing: 1 },
  micCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#071c6b', justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 24,
  },
  questionBox: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignSelf: 'center',
    minWidth: 220,
  },
  questionText: { fontSize: 18, color: '#222', textAlign: 'center' },
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
  },
  toggleLabel: { fontSize: 16, color: '#071c6b', fontWeight: 'bold' },
});
