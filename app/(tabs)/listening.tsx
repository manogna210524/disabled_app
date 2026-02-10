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
        <TouchableOpacity onPress={() => router.replace('/welcomevoice')}>
          <Ionicons name="arrow-back" size={24} color="#1994ea" />
        </TouchableOpacity>
      </View>

      {/* Listening title */}
      <Text style={styles.title}>Listening...</Text>

      {/* Microphone icon with dots */}
      <View style={styles.micSection}>
        <View style={styles.micCircle}>
          <Ionicons name="mic" size={48} color="#fff" />
        </View>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Question bubble */}
      <View style={styles.questionBubble}>
        <Text style={styles.questionText}>What's on my calendar?</Text>
      </View>

      {/* Type Input field */}
      <TextInput
        style={styles.typeInput}
        placeholder="Type Input"
        placeholderTextColor="#88a1ba"
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
          <MaterialIcons name="volume-up" size={20} color="#1994ea" />
        </TouchableOpacity>
      </View>

      {/* Manual Mode button */}
      <TouchableOpacity
        style={styles.manualBtn}
        onPress={() => router.replace('/home')}
      >
        <Text style={styles.manualText}>Manual Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafdff',
    paddingHorizontal: 24,
    paddingTop: 36,
    marginTop: 50,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 23,
    fontWeight: '500',
    color: '#25324B',
    textAlign: 'center',
    marginBottom: 28,
  },
  micSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  micCircle: {
    width: 90,
    height: 90,
    backgroundColor: '#1994ea',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    shadowColor: '#1582c5',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 13,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c6e2f8',
    marginHorizontal: 5,
  },
  questionBubble: {
    backgroundColor: '#e8f6ff',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 26,
    alignSelf: 'center',
    marginBottom: 18,
    shadowColor: '#addfff',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    color: '#25324B',
    fontWeight: '500',
  },
  typeInput: {
    backgroundColor: '#f2f8fb',
    borderRadius: 9,
    padding: 13,
    fontSize: 15,
    marginBottom: 16,
    color: '#25324B',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'center',
  },
  replayBtn: {
    backgroundColor: '#31c2d8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 12,
  },
  replayText: {
    color: '#fff',
    marginLeft: 7,
    fontSize: 15,
    fontWeight: '500',
  },
  yellowBtn: {
    backgroundColor: '#e9f3fb',
    padding: 10,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#b7e3fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualBtn: {
    backgroundColor: '#1994ea',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#1582c5',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  manualText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
