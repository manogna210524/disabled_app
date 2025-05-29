import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const icons = {
  location: <Ionicons name="location" size={36} color="#0a1663" />,
  contacts: <FontAwesome name="user" size={36} color="#0a1663" />,
  microphone: <Ionicons name="mic" size={36} color="#0a1663" />,
  notifications: <MaterialIcons name="notifications" size={36} color="#0a1663" />,
};

const titles = {
  location: 'Turn On Location',
  contacts: 'Allow Access to Contacts',
  microphone: 'Allow Microphone Access',
  notifications: 'Turn On Notifications',
};

const messages = {
  location: "Allow CareMate to access this device's location.",
  contacts: "Allow CareMate to access your contacts.",
  microphone: "Allow CareMate to access the microphone for voice commands.",
  notifications: "Allow CareMate to turn on notifications.",
};

export default function PermissionModal({ visible, type, onAllow, onDeny }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.icon}>{icons[type]}</View>
          <Text style={styles.title}>{titles[type]}</Text>
          <Text style={styles.desc}>{messages[type]}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.denyBtn} onPress={onDeny}>
              <Text style={styles.denyText}>Don't Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.allowBtn} onPress={onAllow}>
              <Text style={styles.allowText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  box: { width: 300, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', padding: 24 },
  icon: { marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0a1663', marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: 15, color: '#222', marginBottom: 18, textAlign: 'center' },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  denyBtn: { flex: 1, padding: 12, alignItems: 'center' },
  allowBtn: { flex: 1, padding: 12, alignItems: 'center' },
  denyText: { color: '#0a1663', fontWeight: 'bold', fontSize: 16 },
  allowText: { color: '#0a1663', fontWeight: 'bold', fontSize: 16 },
});
