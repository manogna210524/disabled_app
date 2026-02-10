import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;
const EMERGENCY_NUMBER = '999990000';

export default function HomeScreen() {
  const router = useRouter();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleCall = () => {
    setShowCallModal(false);
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace('/listening')}>
          <Ionicons name="arrow-back" size={24} color="#3a8be8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home Dashboard</Text>
        <View style={{ width: 24 }} /> {/* Spacer for symmetry */}
      </View>

      {/* Main Buttons in 2x2 Grid */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/reminders')}>
          <FontAwesome5 name="clock" size={32} color="#3a8be8" style={styles.icon} />
          <Text style={styles.cardText}>Set Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/sosalert')}>
  <MaterialIcons name="security" size={32} color="#3a8be8" style={styles.icon} />
  <Text style={styles.cardText}>SOS Alert</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setShowVoiceModal(true)}>
          <FontAwesome name="microphone" size={32} color="#3a8be8" style={styles.icon} />
          <Text style={styles.cardText}>Voice Commands</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/settings')}>
          <Feather name="settings" size={32} color="#3a8be8" style={styles.icon} />
          <Text style={styles.cardText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Call Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCallModal(true)}>
        <MaterialIcons name="call" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Call Confirmation Modal */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.callModalBox}>
            <View style={styles.callIconCircle}>
              <MaterialIcons name="call" size={32} color="#fff" />
            </View>
            <Text style={styles.callModalTitle}>Confirm Call</Text>
            <Text style={styles.callModalLink}>Do you want to make this call?</Text>
            <View style={styles.callModalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCallModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleCall}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Voice Command Selection Modal */}
      <Modal
        visible={showVoiceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.voiceModalBox}>
            <Text style={styles.voiceModalTitle}>Select one option to proceed</Text>
            <TouchableOpacity
              style={styles.voiceOptionBtn}
              onPress={() => {
                setShowVoiceModal(false);
                router.push('/texttospeech');
              }}
            >
              <Text style={styles.voiceOptionText}>Text-to-speech</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.voiceOptionBtn}
              onPress={() => {
                setShowVoiceModal(false);
                router.push('/speechtotext');
              }}
            >
              <Text style={styles.voiceOptionText}>Speech-to-Text</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Absolute Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="home" size={24} color="#3a8be8" />
          <Text style={[styles.bottomBarText, styles.activeTab]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <FontAwesome5 name="clock" size={22} color="#7caafc" />
          <Text style={styles.bottomBarText}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Ionicons name="person-outline" size={22} color="#7caafc" />
          <Text style={styles.bottomBarText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
          <Feather name="settings" size={22} color="#7caafc" />
          <Text style={styles.bottomBarText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 34,
    paddingBottom: 90,
    marginTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#232841',
    textAlign: 'center',
    letterSpacing: 0.24,
  },
  buttonGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 18,
    columnGap: 14,
    marginTop: 10,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1.8,
    borderColor: '#cae1ff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#3a8be822',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 4,
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    color: '#3a8be8',
    fontSize: 15.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 0.22,
  },
  fab: {
    position: 'absolute',
    right: 32,
    bottom: 110,
    backgroundColor: '#e63946',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callModalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    padding: 24,
    elevation: 8,
  },
  callIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e63946',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  callModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e63946',
    marginBottom: 10,
    textAlign: 'center',
  },
  callModalLink: {
    color: '#6c7ca0',
    textDecorationLine: 'underline',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  callModalActions: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 20,
  },
  continueText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 20,
  },
  voiceModalBox: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    elevation: 8,
  },
  voiceModalTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  voiceOptionBtn: {
    width: '100%',
    backgroundColor: '#3a8be8',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceOptionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 63,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#697FA3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 10,
    paddingBottom: 2,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  bottomBarText: {
    fontSize: 13,
    marginTop: 1,
    color: '#7caafc',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTab: {
    color: '#3a8be8',
    fontWeight: 'bold',
  },
});
