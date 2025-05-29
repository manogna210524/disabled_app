import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SOSAlertScreen() {
  const router = useRouter();
  const [useVoice, setUseVoice] = useState(true);
  const [message, setMessage] = useState('I need help. Please reach me as soon as possible.');
  const [showConfirm, setShowConfirm] = useState(false);

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Alice Smith', number: '988760821' },
    { id: '2', name: 'Nearby hospital', number: '108' },
  ]);

  const handleSendSOS = () => {
    setShowConfirm(true);
  };

  const confirmSendSOS = () => {
    setShowConfirm(false);
    // TODO: Add actual SOS sending logic here (SMS, location sharing, etc.)
    Alert.alert('SOS Alert', 'Emergency SOS message has been sent to your contacts!');
  };

  const handleShareLocation = () => {
    // TODO: Add location sharing logic
    Alert.alert('Location Shared', 'Your location has been shared with emergency contacts!');
  };

  const handleAddContact = () => {
    // TODO: Add contact picker logic
    Alert.alert('Add Contact', 'Contact picker functionality will be implemented here.');
  };

  const handleEditContact = (contactId: string) => {
    // TODO: Add edit contact logic
    Alert.alert('Edit Contact', `Edit contact with ID: ${contactId}`);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

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
        <MaterialIcons name="lock" size={24} color="#fff" style={styles.lockIcon} />
        <Text style={styles.sosBtnText}>SEND SOS NOW</Text>
      </TouchableOpacity>

      {/* Share Location Button */}
      <TouchableOpacity style={styles.locationBtn} onPress={handleShareLocation}>
        <MaterialIcons name="location-on" size={24} color="#fff" style={styles.locationIcon} />
        <Text style={styles.locationBtnText}>SHARE LOCATION</Text>
      </TouchableOpacity>

      {/* Emergency Contacts Section */}
      <Text style={styles.sectionTitle}>EMERGENCY CONTACTS</Text>
      
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        style={styles.contactsList}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.number}</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity onPress={() => handleEditContact(item.id)} style={styles.editBtn}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
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
            <Text style={styles.modalDesc}>Tap 'Continue' to send an emergency SOS message.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueBtn} onPress={confirmSendSOS}>
                <Text style={styles.continueText}>Continue</Text>
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
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
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
  locationBtn: {
    backgroundColor: '#071c6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  locationIcon: { 
    marginRight: 8 
  },
  locationBtnText: { 
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
    maxHeight: 120,
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
  editBtn: {
    marginRight: 12,
  },
  editText: {
    color: '#071c6b',
    fontSize: 14,
    fontWeight: 'bold',
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
  // Modal Styles
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
});
