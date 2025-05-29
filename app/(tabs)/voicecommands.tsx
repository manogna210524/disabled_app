import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VoiceCommandsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Voice Commands Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6fa' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#0a1663' },
});
