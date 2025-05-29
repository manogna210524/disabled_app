import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ListeningScreen() {
  const [inputText, setInputText] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/welcomevoice')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Listening title */}
      <Text style={styles.title}>Listening...</Text>

      {/* Microphone icon with dots */}
      <View style={styles.micSection}>
        <Ionicons name="mic" size={80} color="#bbb" />
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Question bubble */}
      <View style={styles.questionBubble}>
        <Text style={styles.questionText}>What's on my calender?</Text>
      </View>

      {/* Type Input field */}
      <TextInput
        style={styles.typeInput}
        placeholder="Type Input"
        placeholderTextColor="#999"
        value={inputText}
        onChangeText={setInputText}
      />

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.replayBtn}>
          <MaterialIcons name="replay" size={20} color="#fff" />
          <Text style={styles.replayText}>Replay Response</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.yellowBtn}>
          <MaterialIcons name="volume-up" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Manual Mode button */}
      <TouchableOpacity
        style={styles.manualBtn}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.manualText}>Manual Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a1663',
    textAlign: 'center',
    marginBottom: 40,
  },
  micSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  questionBubble: {
    backgroundColor: '#cbe1f7',
    borderRadius: 12,
    padding: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#000',
  },
  typeInput: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  replayBtn: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  replayText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  yellowBtn: {
    backgroundColor: '#ffeb3b',
    padding: 8,
    borderRadius: 8,
  },
  manualBtn: {
    backgroundColor: '#0a1663',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  manualText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
