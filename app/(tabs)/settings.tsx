import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';

export default function SettingsScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Toggle states
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [speechInput, setSpeechInput] = useState(false);
  const [subtitles, setSubtitles] = useState(true);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [contrast, setContrast] = useState(true);

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Clear any user session/tokens here if needed
    // For example: AsyncStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        {/* SOS Contact */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>SOS Contact</Text>
          <TouchableOpacity style={styles.addEditBtn}>
            <Text style={styles.addEditText}>Add/Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Voice Feedback */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Feedback</Text>
          <Switch
            value={voiceFeedback}
            onValueChange={setVoiceFeedback}
            trackColor={{ false: '#ccc', true: '#071c6b' }}
            thumbColor={voiceFeedback ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Speech Input */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Speech Input</Text>
          <Switch
            value={speechInput}
            onValueChange={setSpeechInput}
            trackColor={{ false: '#ccc', true: '#e63946' }}
            thumbColor={speechInput ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Subtitles */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Subtitles</Text>
          <Switch
            value={subtitles}
            onValueChange={setSubtitles}
            trackColor={{ false: '#ccc', true: '#071c6b' }}
            thumbColor={subtitles ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Text-to-Speech */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Text-to-Speech</Text>
          <Switch
            value={textToSpeech}
            onValueChange={setTextToSpeech}
            trackColor={{ false: '#ccc', true: '#e63946' }}
            thumbColor={textToSpeech ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Contrast */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Contrast</Text>
          <Switch
            value={contrast}
            onValueChange={setContrast}
            trackColor={{ false: '#ccc', true: '#071c6b' }}
            thumbColor={contrast ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Profile */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Profile</Text>
          <TouchableOpacity style={styles.viewProfileBtn}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => setShowLogoutModal(true)}
      >
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 16,
  },
  settingsContainer: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  addEditBtn: {
    backgroundColor: '#071c6b',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addEditText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewProfileBtn: {
    backgroundColor: '#071c6b',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

