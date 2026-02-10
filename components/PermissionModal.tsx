import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Use app blue for icons/titles/buttons:
const icons = {
  location: <Ionicons name="location" size={36} color="#1994ea" />,
  contacts: <FontAwesome name="user" size={36} color="#1994ea" />,
  microphone: <Ionicons name="mic" size={36} color="#1994ea" />,
  notifications: <MaterialIcons name="notifications" size={36} color="#1994ea" />,
};

const titles = {
  location: 'Location Access Needed',
  contacts: 'Contacts Access Needed',
  microphone: 'Microphone Access Needed',
  notifications: 'Notifications Needed',
};

const messages = {
  location: "CareMate needs location access to share your location during emergencies.",
  contacts: "CareMate needs contacts access to manage your emergency contacts.",
  microphone: "CareMate needs microphone access for voice commands and accessibility features.",
  notifications: "CareMate needs notifications to remind you about important tasks and alerts.",
};

export default function PermissionModal({
  visible,
  type,
  onAllow,
  onDeny,
  isPermanentlyDenied = false
}) {
  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.iconContainer}>{icons[type]}</View>
          <Text style={styles.title}>{titles[type]}</Text>
          <Text style={styles.desc}>{messages[type]}</Text>
          {isPermanentlyDenied ? (
            <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
              <Text style={styles.settingsText}>Open Settings</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={onDeny}>
                <Text style={styles.denyText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.allowButton]} onPress={onAllow}>
                <Text style={styles.allowText}>Allow</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(25,148,234,0.10)', justifyContent: 'center', alignItems: 'center'
  },
  box: {
    width: '85%',
    backgroundColor: '#fafdff',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#1994ea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  iconContainer: {
    backgroundColor: '#e7f3fc',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1994ea',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28,
  },
  desc: {
    fontSize: 16,
    color: '#25324B',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
    marginTop: 9,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButton: {
    backgroundColor: '#e7f3fc',
    borderWidth: 1,
    borderColor: '#b7e3fb',
    marginRight: 7,
  },
  allowButton: {
    backgroundColor: '#1994ea',
    marginLeft: 7,
    shadowColor: '#1994ea',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  denyText: {
    color: '#25324B',
    fontWeight: '600',
    fontSize: 16,
  },
  allowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  settingsButton: {
    backgroundColor: '#1994ea',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 38,
    alignItems: 'center',
    width: '100%',
    marginTop: 14,
    shadowColor: '#1994ea',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
