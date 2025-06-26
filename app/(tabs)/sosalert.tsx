import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SMS from 'expo-sms';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function SOSAlertScreen() {
  const router = useRouter();
  const [useVoice, setUseVoice] = useState(true);
  const [message, setMessage] = useState('I need help. Please reach me as soon as possible.');
  const [showConfirm, setShowConfirm] = useState(false);

  // All phone contacts
  const [phoneContacts, setPhoneContacts] = useState([]);
  // Emergency contacts (persistent, user-specific)
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [userId, setUserId] = useState(null);

  // Permission check helper
  const checkPermission = async (type: string, friendlyName: string) => {
    const status = await AsyncStorage.getItem(`perm_${type}`);
    if (status !== 'granted') {
      Alert.alert(
        `${friendlyName} Permission Required`,
        `Please enable ${friendlyName.toLowerCase()} access in settings.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  // On mount, get the current user ID
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    })();
  }, []);

  // Load emergency contacts from AsyncStorage when userId changes
  useEffect(() => {
    if (!userId) return;
    const loadContacts = async () => {
      const saved = await AsyncStorage.getItem(`emergencyContacts_${userId}`);
      if (saved) setEmergencyContacts(JSON.parse(saved));
      else setEmergencyContacts([]);
    };
    loadContacts();
  }, [userId]);

  // Save emergency contacts to AsyncStorage whenever they change
  useEffect(() => {
    if (!userId) return;
    AsyncStorage.setItem(`emergencyContacts_${userId}`, JSON.stringify(emergencyContacts));
  }, [emergencyContacts, userId]);

  // Fetch device contacts on mount
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

  // Add a contact from device contacts to emergency contacts
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

  // Delete contact from emergency contacts list
  const handleDeleteContact = (contactId) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== contactId));
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

  // Get user location with permission check
  const getCurrentLocation = async () => {
    const hasPermission = await checkPermission('location', 'Location');
    if (!hasPermission) return 'Location permission denied';
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return 'Location permission denied';
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      return `Location: https://maps.google.com/?q=${latitude},${longitude}`;
    } catch (error) {
      return 'Unable to get location';
    }
  };

  // Send SMS to all emergency contacts (with Android fix)
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
      // Accept both 'sent' and 'unknown' as success (Android returns 'unknown' even if sent)
      return result.result === 'sent' || result.result === 'unknown';
    } catch (error) {
      console.error('SMS Error:', error);
      return false;
    }
  };

  // Call emergency contacts
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
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert.');
      console.error('SOS Error:', error);
    }
  };

  // Filtered contacts for search
  const filteredContacts = phoneContacts.filter(contact =>
    contact.name?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SOS Alert</Text>
      </View>

      {/* Send SOS Button */}
      <TouchableOpacity style={styles.sosBtn} onPress={handleSendSOS}>
        <MaterialIcons name="emergency" size={24} color="#fff" style={styles.lockIcon} />
        <Text style={styles.sosBtnText}>SEND SOS NOW</Text>
      </TouchableOpacity>

      {/* Emergency Contacts Section */}
      <Text style={styles.sectionTitle}>EMERGENCY CONTACTS</Text>
      <FlatList
        data={emergencyContacts}
        keyExtractor={item => item.id}
        style={styles.contactsList}
        ListEmptyComponent={
          loadingContacts
            ? <Text style={{textAlign:'center', color:'#888'}}>Loading...</Text>
            : <Text style={{textAlign:'center', color:'#888'}}>No emergency contacts added yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number}</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity onPress={() => handleDeleteContact(item.id)} style={styles.deleteBtn}>
                <MaterialIcons name="delete" size={20} color="#e63946" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Contact Button */}
      <TouchableOpacity style={styles.addContactBtn} onPress={handleAddContact}>
        <MaterialIcons name="add" size={20} color="#071c6b" />
        <Text style={styles.addContactText}>Add Contact</Text>
      </TouchableOpacity>

      {/* Use Voice Toggle */}
      <View style={styles.voiceRow}>
        <Text style={styles.voiceLabel}>Use Voice to send Alert</Text>
        <Switch 
          value={useVoice} 
          onValueChange={setUseVoice}
          trackColor={{ false: '#ccc', true: '#071c6b' }}
          thumbColor={useVoice ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Message Input */}
      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        multiline
        placeholder="Enter your emergency message"
        placeholderTextColor="#999"
      />

      {/* Confirmation Popup Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <MaterialIcons name="warning" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Confirm SOS Alert</Text>
            <Text style={styles.modalDesc}>This will send SMS with your location and offer to call your emergency contacts.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueBtn} onPress={confirmSendSOS}>
                <Text style={styles.continueText}>Send SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select Contact Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.contactModalBox}>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 10,
                fontSize: 16,
                marginBottom: 12,
                width: '100%',
              }}
              placeholder="Search contacts by name"
              value={contactSearch}
              onChangeText={setContactSearch}
            />
            <FlatList
              data={filteredContacts}
              keyExtractor={item => item.id}
              style={{ maxHeight: 340, width: 260 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.contactSelectItem}
                  onPress={() => selectContact(item)}
                >
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactNumber}>{item.phoneNumbers[0]?.number}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 10, width: '100%' }]}
              onPress={() => setShowContactModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f6fa', 
    paddingHorizontal: 16, 
    paddingTop: 40 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000', 
    marginLeft: 16 
  },
  sosBtn: {
    backgroundColor: '#e63946',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  lockIcon: { 
    marginRight: 8 
  },
  sosBtnText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#071c6b', 
    marginBottom: 12 
  },
  contactsList: {
    maxHeight: 140,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#071c6b' 
  },
  contactNumber: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2 
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    padding: 4,
  },
  addContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  addContactText: { 
    marginLeft: 8, 
    color: '#071c6b', 
    fontSize: 16,
    fontWeight: '500' 
  },
  voiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  voiceLabel: { 
    fontSize: 16, 
    color: '#071c6b',
    fontWeight: '500' 
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    padding: 24,
    elevation: 8,
  },
  contactModalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    padding: 24,
    elevation: 8,
  },
  contactSelectItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#071c6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#071c6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#071c6b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  continueText: {
    color: '#071c6b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  },
});
