import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Updated import
import { Audio } from 'expo-av';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'; // Added useCallback
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';
import { supabase } from '../../lib/supabase';

const permissions = [
  { key: 'location', label: 'Location', request: () => Location.requestForegroundPermissionsAsync() },
  { key: 'contacts', label: 'Contacts', request: () => Contacts.requestPermissionsAsync() },
  { key: 'microphone', label: 'Microphone', request: () => Audio.requestPermissionsAsync() },
  { key: 'notifications', label: 'Notifications', request: () => Notifications.requestPermissionsAsync() },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [permissionStatuses, setPermissionStatuses] = useState({});
  
  // Load permissions function
  const loadPermissions = useCallback(async () => {
    const statuses = {};
    for (const perm of permissions) {
      statuses[perm.key] = await AsyncStorage.getItem(`perm_${perm.key}`) || 'undetermined';
    }
    setPermissionStatuses(statuses);
  }, []);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, []);

  // Refresh permissions when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPermissions();
    }, [loadPermissions])
  );

  // Get status color
  const getStatusColor = (status) => {
    if (status === 'granted') return '#4CAF50';
    if (status === 'denied') return '#e63946';
    return '#888';
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

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Permissions Section */}
        <Text style={styles.sectionTitle}>App Permissions</Text>
        {permissions.map(perm => (
          <View key={perm.key} style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionLabel}>{perm.label}</Text>
              <Text style={[styles.permissionStatus, { 
                color: getStatusColor(permissionStatuses[perm.key]) 
              }]}>
                {permissionStatuses[perm.key] || 'undetermined'}
              </Text>
            </View>
            <View style={styles.permissionActions}>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutModal(true)}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <LogoutConfirmModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          supabase.auth.signOut();
          router.replace('/login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a1663',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  permissionStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  permissionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsButton: {
    backgroundColor: '#0a1663',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e63946',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
