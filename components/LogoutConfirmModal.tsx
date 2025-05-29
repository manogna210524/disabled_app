import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ visible, onCancel, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="exit-to-app" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Confirm Logout</Text>
          <Text style={styles.desc}>Are you sure you want to logout?</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    padding: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e63946',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e63946',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    color: '#888',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  actions: {
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
  logoutBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 20,
  },
  logoutText: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
