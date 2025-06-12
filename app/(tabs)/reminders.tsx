import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState(new Date());
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch reminders for the logged-in user only
  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setReminders(data || []);
      }
      setLoading(false);
    };
    fetchReminders();
  }, []);

  // Android Date/Time Picker Handler
  const showPicker = (currentMode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: time,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          setTime(selectedTime);
          if (currentMode === 'date') showPicker('time');
        }
      },
      mode: currentMode,
      is24Hour: true,
    });
  };

  // Add new reminder with validation
  const addReminder = async () => {
    if (!title.trim() || title.trim().length < 3) {
      Alert.alert('Title required', 'Please enter a title (at least 3 characters).');
      return;
    }
    if (title.length > 50) {
      Alert.alert('Title too long', 'Title should not exceed 50 characters.');
      return;
    }
    if (desc.length > 0 && desc.trim().length < 5) {
      Alert.alert('Description too short', 'If you add a description, it should be at least 5 characters.');
      return;
    }
    if (desc.length > 200) {
      Alert.alert('Description too long', 'Description should not exceed 200 characters.');
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const newReminder = {
        user_id: user.id,
        title: title.trim(),
        desc: desc.trim(),
        time: time.toISOString(),
      };
      const { data, error } = await supabase
        .from('reminders')
        .insert(newReminder)
        .select()
        .single();
      if (error) throw error;
      setReminders(prev => [...prev, data]);
      setModalVisible(false);
      setTitle('');
      setDesc('');
      setTime(new Date());
      setShowIOSPicker(false);
      Alert.alert('Success', 'Reminder added!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Update existing reminder
  const updateReminder = async () => {
    if (!editingId) return;
    if (!title.trim() || title.trim().length < 3) {
      Alert.alert('Title required', 'Please enter a title (at least 3 characters).');
      return;
    }
    if (title.length > 50) {
      Alert.alert('Title too long', 'Title should not exceed 50 characters.');
      return;
    }
    if (desc.length > 0 && desc.trim().length < 5) {
      Alert.alert('Description too short', 'If you add a description, it should be at least 5 characters.');
      return;
    }
    if (desc.length > 200) {
      Alert.alert('Description too long', 'Description should not exceed 200 characters.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('reminders')
        .update({
          title: title.trim(),
          desc: desc.trim(),
          time: time.toISOString(),
        })
        .eq('id', editingId)
        .select()
        .single();
      if (error) throw error;
      setReminders(reminders.map(r => (r.id === editingId ? data : r)));
      setModalVisible(false);
      setEditingId(null);
      setTitle('');
      setDesc('');
      setTime(new Date());
      setShowIOSPicker(false);
      Alert.alert('Success', 'Reminder updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete reminder (actual delete)
  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setReminders(reminders.filter(r => r.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete confirmation dialog
  const confirmDeleteReminder = (id: string) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteReminder(id) }
      ]
    );
  };

  // Handle edit button press
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDesc(item.desc);
    setTime(new Date(item.time));
    setModalVisible(true);
  };

  // Handle modal close (reset edit state)
  const handleModalClose = () => {
    setModalVisible(false);
    setEditingId(null);
    setTitle('');
    setDesc('');
    setTime(new Date());
    setShowIOSPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
          <Ionicons name="arrow-back" size={28} color="#0a1663" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      {/* Add some space below the header */}
      <View style={{ height: 32 }} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      {/* Loading Spinner or Reminders List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0a1663" />
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDesc}>{item.desc}</Text>
                <Text style={styles.reminderDate}>
                  {new Date(item.time).toLocaleString()}
                </Text>
              </View>
              {/* Action buttons row */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  onPress={() => handleEdit(item)}
                  style={styles.editButton}
                >
                  <Ionicons name="create" size={20} color="#0a1663" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteReminder(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
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
          <Text style={{ color: '#888', alignSelf: 'flex-end', marginBottom: 6 }}>
            {title.length}/50
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
            multiline
            maxLength={200}
          />
          <Text style={{ color: '#888', alignSelf: 'flex-end', marginBottom: 6 }}>
            {desc.length}/200
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              if (Platform.OS === 'android') {
                showPicker('date');
              } else {
                setShowIOSPicker(true);
              }
            }}
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
            <Button 
              title={editingId ? 'Update' : 'Save'} 
              onPress={editingId ? updateReminder : addReminder} 
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a1663',
    marginLeft: 2,
  },
  addButton: {
    backgroundColor: '#0a1663',
    padding: 15,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a1663',
    marginBottom: 2,
  },
  reminderDesc: {
    color: '#666',
    marginVertical: 2,
    fontSize: 15,
  },
  reminderDate: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: 16,
    padding: 4,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a1663',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#0a1663',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
