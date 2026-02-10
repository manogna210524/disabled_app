import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Expo Notifications configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Enable notifications permissions to get reminder alarms.');
  }
  return status === 'granted';
}

async function scheduleNotification(title, desc, dateTime) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || 'Reminder Alarm',
      body: desc || "It's time for your reminder!",
      sound: 'default',
    },
    trigger: dateTime,
  });
}

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState(new Date());
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  function handleEdit(item) {
    setEditingId(item.id);
    setTitle(item.title);
    setDesc(item.desc);
    setTime(new Date(item.time));
    setModalVisible(true);
  }

  function confirmDeleteReminder(id) {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteReminder(id) }
      ]
    );
  }

  function deleteReminder(id) {
    setReminders(reminders.filter(r => r.id !== id));
  }

  async function addReminder() {
    const newReminder = {
      id: Date.now().toString(),
      title,
      desc,
      time
    };
    setReminders([...reminders, newReminder]);
    await scheduleNotification(title, desc, time);
    handleModalClose();
  }

  async function updateReminder() {
    setReminders(
      reminders.map(r =>
        r.id === editingId ? { ...r, title, desc, time } : r
      )
    );
    await scheduleNotification(title, desc, time);
    handleModalClose();
  }

  function handleModalClose() {
    setModalVisible(false);
    setTitle('');
    setDesc('');
    setTime(new Date());
    setEditingId(null);
    setShowIOSPicker(false);
  }

  function showDateTimePicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        mode: 'date',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              is24Hour: true,
              onChange: (event2, selectedTime) => {
                if (selectedTime) setTime(selectedTime);
              },
            });
          }
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  }

  return (
    <View style={styles.rootBg}>
      <View style={styles.containerCard}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.push('/home')} style={{ paddingRight: 12 }}>
              <Ionicons name="arrow-back" size={26} color="#2871e6" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reminders</Text>
          </View>
          <TouchableOpacity style={styles.headerAddBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.headerAddText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reminders}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDesc}>{item.desc}</Text>
                <Text style={styles.reminderDate}>{new Date(item.time).toLocaleString()}</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDeleteReminder(item.id)}>
                  <Text style={styles.actionBtnTextAlt}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButtonBottom} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonBottomText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for add/edit */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit Reminder' : 'New Reminder'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={desc}
              onChangeText={setDesc}
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDateTimePicker}
            >
              <Text style={styles.dateButtonText}>
                {time.toLocaleDateString() + ' ' + time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && showIOSPicker && (
              <DateTimePicker
                value={time}
                mode="datetime"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowIOSPicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={handleModalClose} />
              <Button title={editingId ? 'Update' : 'Save'} onPress={editingId ? updateReminder : addReminder} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- All styles used above ---
const styles = StyleSheet.create({
  rootBg: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  containerCard: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#2871e6',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.09,
    shadowRadius: 13,
    elevation: 12,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222b4a',
    letterSpacing: 0.2,
  },
  headerAddBtn: {
    paddingHorizontal: 19,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2871e6',
    backgroundColor: '#fff',
  },
  headerAddText: {
    color: '#2871e6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.7,
    borderColor: '#2871e6',
    marginTop: 0,
    marginBottom: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    shadowColor: '#2871e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  reminderTitle: {
    color: '#1a306d',
    fontSize: 16.5,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reminderDesc: {
    color: '#606780',
    fontSize: 13.5,
    marginBottom: 1,
  },
  reminderDate: {
    color: '#90a2c8',
    fontSize: 13.5,
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 8,
  },
  actionBtn: {
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#2871e6',
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingVertical: 5,
    marginRight: 7,
  },
  actionBtnText: {
    color: '#2871e6',
    fontWeight: 'bold',
    fontSize: 13.5,
  },
  actionBtnTextAlt: {
    color: '#2871e6',
    fontWeight: 'bold',
    fontSize: 13.5,
  },
  addButtonBottom: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#2871e6',
    borderRadius: 13,
    paddingHorizontal: 28,
    paddingVertical: 11,
  },
  addButtonBottomText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  emptyText: {
    color: '#adb3c9',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#222b4a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 12,
    elevation: 13,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2871e6',
    marginBottom: 21,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#2871e6',
    padding: 13,
    borderRadius: 10,
    marginBottom: 9,
    fontSize: 15,
    backgroundColor: '#f7faff',
  },
  dateButton: {
    borderWidth: 1.5,
    borderColor: '#2871e6',
    padding: 13,
    borderRadius: 10,
    marginBottom: 19,
    backgroundColor: '#f7faff',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2871e6',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

// Install these modules in your project:
// npx expo install expo-notifications
// npx expo install @react-native-community/datetimepicker