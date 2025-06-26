import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const icons = {
  location: <Ionicons name="location" size={36} color="#0a1663" />,
  contacts: <FontAwesome name="user" size={36} color="#0a1663" />,
  microphone: <Ionicons name="mic" size={36} color="#0a1663" />,
  notifications: <MaterialIcons name="notifications" size={36} color="#0a1663" />,
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
          <View style={styles.iconContainer}>
            {icons[type]}
          </View>
          
          <Text style={styles.title}>{titles[type]}</Text>
          <Text style={styles.desc}>{messages[type]}</Text>
          
          {isPermanentlyDenied ? (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleOpenSettings}
            >
              <Text style={styles.settingsText}>Open Settings</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.denyButton]} 
                onPress={onDeny}
              >
                <Text style={styles.denyText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.allowButton]} 
                onPress={onAllow}
              >
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
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  box: { 
    width: '85%', 
    backgroundColor: '#fff', 
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  iconContainer: {
    backgroundColor: '#f0f4ff',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a1663',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28,
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  allowButton: {
    backgroundColor: '#0a1663',
  },
  denyText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 16,
  },
  allowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  settingsButton: {
    backgroundColor: '#0a1663',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  settingsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
