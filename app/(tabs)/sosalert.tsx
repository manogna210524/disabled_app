import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SMS from 'expo-sms';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SOSAlertScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('I need help. Please reach me as soon as possible.');
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [userId, setUserId] = useState(null);

  const checkPermission = async (type, friendlyName) => {
    const status = await AsyncStorage.getItem(`perm_${type}`);
    if (status !== 'granted') {
      Alert.alert(
        `${friendlyName} Permission Required`,
        `Please enable ${friendlyName.toLowerCase()} access in settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem(`emergencyContacts_${userId}`);
      if (saved) setEmergencyContacts(JSON.parse(saved));
      else setEmergencyContacts([]);
      setLoadingContacts(false);
    };
    loadContacts();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    AsyncStorage.setItem(`emergencyContacts_${userId}`, JSON.stringify(emergencyContacts));
  }, [emergencyContacts, userId]);

  useEffect(() => {
    (async () => {
      setLoadingContacts(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setPhoneContacts(data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0));
      } else {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission.');
      }
      setLoadingContacts(false);
    })();
  }, []);

  const handleAddContact = async () => {
    const hasPermission = await checkPermission('contacts', 'Contacts');
    if (!hasPermission) return;
    setContactSearch('');
    setShowContactModal(true);
  };

  const selectContact = (contact) => {
    if (emergencyContacts.find(c => c.id === contact.id)) {
      Alert.alert('Already Added', 'This contact is already in your emergency list.');
      return;
    }
    setEmergencyContacts([...emergencyContacts, contact]);
    setShowContactModal(false);
  };

  const handleDeleteContact = (contactId) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== contactId));
  };

  const getCurrentLocation = async () => {
    const hasPermission = await checkPermission('location', 'Location');
    if (!hasPermission) return 'Location permission denied';
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return 'Location permission denied';
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      return `Location: https://maps.google.com/?q=${latitude},${longitude}`;
    } catch {
      return 'Unable to get location';
    }
  };

  const sendSMSToContacts = async (messageWithLocation) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('SMS Not Available', 'SMS is not available on this device.');
      return false;
    }
    const phoneNumbers = emergencyContacts.map(contact =>
      contact.phoneNumbers[0]?.number.replace(/[^\d+]/g, '')
    );
    try {
      const result = await SMS.sendSMSAsync(phoneNumbers, messageWithLocation);
      return result.result === 'sent' || result.result === 'unknown';
    } catch {
      return false;
    }
  };

  const callEmergencyContacts = () => {
    Alert.alert(
      'Call Emergency Contacts',
      'Do you want to call your emergency contacts?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            emergencyContacts.forEach((contact, index) => {
              setTimeout(() => {
                const phoneNumber = contact.phoneNumbers[0]?.number.replace(/[^\d+]/g, '');
                Linking.openURL(`tel:${phoneNumber}`);
              }, index * 2000);
            });
          }
        }
      ]
    );
  };

  const handleSendSOS = async () => {
    const hasContacts = await checkPermission('contacts', 'Contacts');
    const hasLocation = await checkPermission('location', 'Location');
    if (!hasContacts || !hasLocation) return;

    if (emergencyContacts.length === 0) {
      Alert.alert('No Emergency Contacts', 'Please add emergency contacts before sending SOS.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSendSOS = async () => {
    setShowConfirm(false);
    try {
      const locationString = await getCurrentLocation();
      const messageWithLocation = `${message}\n\n${locationString}`;
      const smsSuccess = await sendSMSToContacts(messageWithLocation);
      if (smsSuccess) {
        Alert.alert('SOS Alert Sent!', 'Emergency message sent to your contacts.');
        callEmergencyContacts();
      } else {
        Alert.alert('SMS Failed', 'Failed to send SMS. Trying to call contacts...');
        callEmergencyContacts();
      }
    } catch {
      Alert.alert('Error', 'Failed to send SOS alert.');
    }
  };

  const filteredContacts = phoneContacts.filter(contact =>
    contact.name?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.card}>
  <View style={{ alignItems: 'center', width: '100%' }}>
    <View style={styles.sosIconContainer}>
      <MaterialIcons name="emergency" size={34} color="#fff" />
    </View>
  </View>
  <Text style={styles.title}>SOS Alert</Text>


        <TouchableOpacity style={styles.sosBtn} onPress={handleSendSOS}>
          <Text style={styles.sosBtnText}>SEND SOS NOW</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <FlatList
            data={emergencyContacts}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 180 }}
            ListEmptyComponent={
              loadingContacts ? (
                <Text style={styles.emptyText}>Loading contacts...</Text>
              ) : (
                <Text style={styles.emptyText}>No emergency contacts.</Text>
              )
            }
            renderItem={({ item }) => (
              <View style={styles.contactItem}>
                <View>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number ?? 'No number'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteContact(item.id)} style={styles.deleteBtn}>
                  <MaterialIcons name="delete" size={20} color="#e63946" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.addContactBtn} onPress={handleAddContact}>
            <Text style={styles.addContactText}>+ Add Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Emergency Message</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your emergency message"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.mapContainer}>
          <Image
            source={require('../../assets/images/map.jpg')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade" onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="warning" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Confirm SOS Alert</Text>
            <Text style={styles.modalDesc}>Confirm sending SOS message with location to your emergency contacts.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmSendSOS}>
                <Text style={styles.confirmText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contacts Modal */}
      <Modal visible={showContactModal} transparent animationType="slide" onRequestClose={() => setShowContactModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalBox}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <TextInput
              style={styles.contactSearchInput}
              placeholder="Search contacts"
              value={contactSearch}
              onChangeText={setContactSearch}
            />
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              style={styles.contactList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.contactListItem} onPress={() => selectContact(item)}>
                  <Text>{item.name}</Text>
                  <Text>{item.phoneNumbers[0]?.number}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowContactModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa', paddingBottom: 60 },
  backBtn: { position: 'absolute', top: 40, left: 18, zIndex: 10, padding: 5, borderRadius: 20, backgroundColor: 'transparent' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginTop: 60,
    marginHorizontal: 10,
    shadowColor: '#2872ff',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  sosIconContainer: { backgroundColor: '#e63946', width: 60, height: 60, borderRadius: 30, marginBottom: 22, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, color: '#e63946', fontWeight: 'bold', marginBottom: 26, textAlign: 'center' },
  sosBtn: {
    backgroundColor: '#2872ff',
    paddingVertical: 18,
    borderRadius: 18,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#2872ff',
  },
  sosBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  section: {
    backgroundColor: '#f7fafd',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#2872ff',
  },
  sectionTitle: { fontSize: 16, color: '#183a6f', fontWeight: '700', marginBottom: 10 },
  contactItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  contactName: { fontSize: 16, fontWeight: '700', color: '#183a6f' },
  contactNumber: { fontSize: 14, color: '#4a4a4a', marginTop: 2 },
  deleteBtn: { padding: 6 },
  addContactBtn: { marginTop: 5, alignSelf: 'center' },
  addContactText: { fontSize: 16, fontWeight: '700', color: '#2872ff' },
  messageInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#d5d9e0',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#2a2a2a',
    fontSize: 16,
  },
  mapContainer: {
    height: 82,
    backgroundColor: '#d2dff6',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  mapImage: { width: '100%', height: '100%', borderRadius: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 22, padding: 20, width: 320, elevation: 10 },
  modalIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e63946', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#e63946', marginBottom: 10, textAlign: 'center' },
  modalDesc: { fontSize: 16, color: '#4a4a4a', marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#ddd' },
  cancelBtn: { flex: 1, borderRightWidth: 1, borderRightColor: '#ddd', padding: 16, alignItems: 'center' },
  confirmBtn: { flex: 1, padding: 16, alignItems: 'center' },
  cancelText: { fontWeight: '700', fontSize: 18, color: '#e63946' },
  confirmText: { fontWeight: '700', fontSize: 18, color: '#2872ff' },
  contactModalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 320, elevation: 8 },
  contactSearchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 15 },
  contactList: { maxHeight: 310 },
  contactListItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

