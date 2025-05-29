import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RemindersScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Dentist Appointment', time: '2:30 PM', desc: 'Checkup visit' },
    { id: '2', title: 'Dentist Appointment', time: '2:30 PM', desc: 'Checkup visit' },
    { id: '3', title: 'Dentist Appointment', time: '2:30 PM', desc: 'Checkup visit' },
  ]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  const addReminder = () => {
    if (!title.trim()) return;
    setReminders([
      ...reminders,
      { id: Date.now().toString(), title, time: date || '2:30 PM', desc: desc || '' },
    ]);
    setModalVisible(false);
    setTitle('');
    setDesc('');
    setDate('');
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={24} color="#0a1663" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>Add Remainder</Text>
        </TouchableOpacity>
      </View>

      {/* Add Reminder Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Title</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#0a1663" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#888"
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Description"
              value={desc}
              onChangeText={setDesc}
              multiline
              placeholderTextColor="#888"
            />
            <View style={styles.dateRow}>
              <MaterialIcons name="calendar-today" size={22} color="#0a1663" />
              <TextInput
                style={styles.dateInput}
                placeholder="04/24/2025 08:00 AM"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voiceBtn}>
                <FontAwesome name="microphone" size={22} color="#0a1663" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addReminder}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reminders List */}
      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 0 }}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderTime}>{item.time}</Text>
              <Text style={styles.reminderDesc}>{item.desc}</Text>
            </View>
            <View style={styles.reminderActions}>
              <TouchableOpacity>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <MaterialIcons name="delete" size={22} color="#0a1663" style={{ marginLeft: 14 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ededed' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 18,
    backgroundColor: '#ededed',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a1663',
    marginLeft: 16,
    fontFamily: 'serif',
  },
  addBtn: {
    backgroundColor: '#071c6b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'serif',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a1663',
    fontFamily: 'serif',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f4f6fa',
    color: '#222',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    backgroundColor: '#f4f6fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dateInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#222',
    paddingVertical: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  cancelBtn: {
    padding: 10,
    borderRadius: 8,
  },
  cancelText: {
    color: '#0a1663',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'serif',
  },
  voiceBtn: {
    padding: 10,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: '#071c6b',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'serif',
  },
  // Reminders List
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    marginHorizontal: 0,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a1663',
    fontFamily: 'serif',
  },
  reminderTime: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
    fontFamily: 'serif',
  },
  reminderDesc: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'serif',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    color: '#0a1663',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'serif',
    marginRight: 8,
  },
});
