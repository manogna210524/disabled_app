import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const HandshakeIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#1985ea" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <G>
      <Path d="M12 14l-1-1 2-2 1 1-2 2z" />
      <Path d="M11 11l-4 4-3-3 4-4 3 3z" />
      <Path d="M13 13l4-4 3 3-4 4-3-3z" />
      <Path d="M7 17l-4-4 1-1 4 4-1 1z" />
    </G>
  </Svg>
);

const LANGUAGES = [
  { native: 'हिन्दी', english: 'Hindi', code: 'hi' },
  { native: 'English', english: 'English', code: 'en' },
  { native: 'తెలుగు', english: 'Telugu', code: 'te' },
  { native: 'বনলা', english: 'Bengali', code: 'bn' },
  { native: 'मराठी', english: 'Marathi', code: 'mr' },
];

const LanguageOption = ({ langNative, langEnglish, selected, onPress }) => (
  <TouchableOpacity style={[styles.langButton, selected && { borderColor: '#1985ea', borderWidth: 2 }]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.langNativeText}>{langNative}</Text>
    <Text style={styles.langEnglishText}>{langEnglish}</Text>
  </TouchableOpacity>
);

const LanguageScreen = () => {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/welcomevoice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.iconContainer}><HandshakeIcon /></View>
      <View style={styles.languagesContainer}>
        {LANGUAGES.map((lang, idx) => (
          <LanguageOption
            key={lang.code}
            langNative={lang.native}
            langEnglish={lang.english}
            selected={selected === idx}
            onPress={() => setSelected(idx)}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.continueButton, { opacity: selected === null ? 0.6 : 1 }]} onPress={handleContinue} disabled={selected === null}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fcff',
    paddingVertical: 32,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  langButton: {
    backgroundColor: '#fff',
    width: 120,
    height: 100,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0b52da',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 7,
    margin: 10,
  },
  langNativeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  langEnglishText: {
    marginTop: 3,
    fontSize: 14,
    color: '#444444',
  },
  continueButton: {
    backgroundColor: '#1985ea',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 28,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LanguageScreen;
