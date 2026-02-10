import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [speechInput, setSpeechInput] = useState(false);
  const [subtitles, setSubtitles] = useState(true);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={28} color="#2d3a7b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice Feedback</Text>
          <Switch
            value={voiceFeedback}
            onValueChange={setVoiceFeedback}
            trackColor={{ false: '#e3e6f3', true: '#2196f3' }}
            thumbColor={voiceFeedback ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e3e6f3"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Speech Input</Text>
          <Switch
            value={speechInput}
            onValueChange={setSpeechInput}
            trackColor={{ false: '#e3e6f3', true: '#2196f3' }}
            thumbColor={speechInput ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e3e6f3"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Subtitles</Text>
          <Switch
            value={subtitles}
            onValueChange={setSubtitles}
            trackColor={{ false: '#e3e6f3', true: '#2196f3' }}
            thumbColor={subtitles ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e3e6f3"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Text-to-Speech</Text>
          <Switch
            value={textToSpeech}
            onValueChange={setTextToSpeech}
            trackColor={{ false: '#e3e6f3', true: '#2196f3' }}
            thumbColor={textToSpeech ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e3e6f3"
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>High Contrast UI</Text>
          <Switch
            value={contrast}
            onValueChange={setContrast}
            trackColor={{ false: '#e3e6f3', true: '#2196f3' }}
            thumbColor={contrast ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e3e6f3"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalDesc}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={() => {
                setShowLogoutModal(false);
                router.replace('/login');
              }}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbff',
    paddingHorizontal: 18,
    paddingTop: 32,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3a7b',
    marginLeft: 14,
    letterSpacing: 0.22,
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 16,
    borderRadius: 15,
    ...Platform.select({
      ios: { shadowColor: '#daf0ff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
    borderWidth: 0,
  },
  settingLabel: {
    fontSize: 16.1,
    color: '#222d41',
    fontWeight: '400',
    letterSpacing: 0.17,
  },
  logoutRow: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#daf0ff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
    borderWidth: 0,
  },
  logoutBtnText: {
    color: '#208ff7',
    fontSize: 17.5,
    fontWeight: 'bold',
    letterSpacing: 0.19,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 28,
    width: 300,
    alignItems: 'center',
    elevation: 7,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222d41',
    marginBottom: 9,
    textAlign: 'center'
  },
  modalDesc: {
    fontSize: 15,
    color: '#444a6b',
    marginBottom: 22,
    textAlign: 'center'
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 8
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  cancelText: {
    color: '#2d3a7b',
    fontWeight: 'bold',
    fontSize: 17
  },
  logoutText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 17
  }
});
