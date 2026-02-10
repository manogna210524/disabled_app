import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SpeechToTextScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [spoken, setSpoken] = useState('');
  const [waveAnim] = useState(new Animated.Value(0));

  const onMicPress = () => {
    setIsListening(l => !l);
    if (!isListening) {
      setSpoken('');
      startWave();
    } else {
      stopWave();
    }
  };

  const startWave = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 340, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(waveAnim, { toValue: 0, duration: 340, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();
  };

  const stopWave = () => {
    waveAnim.stopAnimation();
  };

  React.useEffect(() => {
    if (isListening) {
      setTimeout(() => setSpoken("What's on my calendar for tomorrow?"), 1300);
    }
  }, [isListening]);
  const barHeight = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 42] });

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        {/* Back arrow */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/home')}>
          <Ionicons name="arrow-back" size={28} color="#2871e6" />
        </TouchableOpacity>
        {/* Mic avatar/icon */}
        <View style={styles.micAvatar}>
          <MaterialIcons name="mic" size={35} color="#2871e6" />
        </View>
        <Text style={styles.title}>Speech to Text</Text>
        <Text style={styles.subtitle}>Tap mic and speak. Your words will appear below!</Text>
        {/* Preview box */}
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>
            {spoken ? spoken : "Your words will appear here..."}
          </Text>
        </View>
        {/* Waveform animation */}
        <View style={styles.waveWrap}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveBar,
                isListening && { height: barHeight },
                { opacity: isListening ? 1 : 0.35, marginLeft: i === 0 ? 0 : 7 },
              ]}
            />
          ))}
        </View>
        {/* Big microphone */}
        <TouchableOpacity
          style={[styles.micOuter, isListening && { backgroundColor: '#2871e6', borderColor: '#2871e6' }]}
          onPress={onMicPress}
        >
          <MaterialIcons name="mic" size={38} color="#fff" />
        </TouchableOpacity>
        {/* Start/Stop controls */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: '#2871e6' }
            ]}
            onPress={() => setIsListening(false)}
          >
            <Ionicons name="stop" size={22} color="#fff" />
            <Text style={styles.bottomBtnText}>STOP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: isListening ? '#44e3b4' : '#2871e6' }
            ]}
            onPress={onMicPress}
          >
            <MaterialIcons name={isListening ? "pause-circle" : "play-arrow"} size={22} color="#fff" />
            <Text style={styles.bottomBtnText}>{isListening ? "PAUSE" : "START"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f4f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 38,
    width: '100%',
    maxWidth: 540,
    minHeight: 650,
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 40,
    shadowColor: "#2871e6",
    shadowOpacity: 0.15,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 15 },
    elevation: 24,
  },
  backBtn: {
    position: "absolute",
    top: 28,
    left: 28,
    padding: 8,
    zIndex: 99,
  },
  micAvatar: {
    marginTop: 18,
    backgroundColor: "#e7f1ff",
    width: 59,
    height: 59,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2871e6",
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 9 },
    marginBottom: 13,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2871e6",
    marginBottom: 3,
    marginTop: 11,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#232841",
    marginBottom: 27,
    textAlign: "center",
  },
  previewBox: {
    width: '100%',
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#b3dafe",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 7 },
    marginBottom: 24,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "#e3eefe",
  },
  previewText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#193970",
    textAlign: "center",
  },
  waveWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 19,
    marginTop: 0,
    height: 38,
  },
  waveBar: {
    width: 11,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#87bdfd",
  },
  micOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2871e6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    borderColor: "#2871e6",
    borderWidth: 3,
    marginBottom: 31,
  },
  bottomRow: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 21,
    marginBottom: 2,
  },
  bottomBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginHorizontal: 13,
    paddingVertical: 17,
    elevation: 2,
    backgroundColor: "#2871e6",
    shadowColor: "#aee1fc",
  },
  bottomBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
    letterSpacing: 0.19,
  },
});
