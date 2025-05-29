import { Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const EMERGENCY_NUMBER = '999990000';

  const handleCall = () => {
    setShowCallModal(false);
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/listening')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/reminders')}
        >
          <FontAwesome5 name="clock" size={32} color="#fff" style={styles.icon} />
          <Text style={styles.cardText}>SET REMAINDER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/sosalert')}
        >
          <MaterialIcons name="sos" size={32} color="#fff" style={styles.icon} />
          <Text style={styles.cardText}>SOS ALERT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowVoiceModal(true)}
        >
          <FontAwesome name="microphone" size={32} color="#fff" style={styles.icon} />
          <Text style={styles.cardText}>VOICE COMMANDS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-sharp" size={32} color="#fff" style={styles.icon} />
          <Text style={styles.cardText}>SETTINGS</Text>
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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Entypo name="home" size={27} color="#071c6b" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="search" size={27} color="#071c6b" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={27} color="#071c6b" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={27} color="#071c6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingTop: 40,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 20,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#071c6b',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 20,
    elevation: 2,
  },
  icon: {
    marginRight: 18,
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    height: 56,
    marginHorizontal: -18,
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Call Modal Styles
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
  // Voice Modal Styles
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
    backgroundColor: '#071c6b',
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
});

