import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TextToSpeechScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TEXT-TO-SPEECH</Text>
      </View>

      {/* Message Input */}
      <TextInput
        style={styles.messageInput}
        placeholder="Type your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.playBtn}>
          <MaterialIcons name="play-arrow" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopBtn}>
          <MaterialIcons name="stop" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Voice Settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Voice</Text>
        <Text style={styles.speakerText}>Speaker (Optional)</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice/Speaker Speed</Text>
          <Switch value={voiceSpeed} onValueChange={setVoiceSpeed} />
        </View>

        <Text style={styles.settingsTitle}>Language</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Larger Font</Text>
          <Switch value={false} onValueChange={() => {}} />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>High Contrast UI</Text>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#071c6b', marginLeft: 16 },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  playBtn: {
    backgroundColor: '#4caf50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stopBtn: {
    backgroundColor: '#e63946',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: { flex: 1 },
  settingsTitle: { fontSize: 18, fontWeight: 'bold', color: '#071c6b', marginBottom: 12 },
  speakerText: { fontSize: 16, color: '#666', marginBottom: 20 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: { fontSize: 16, color: '#071c6b' },
});
