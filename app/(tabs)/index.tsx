import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Center Logo Only */}
      <Image
        source={require('../../assets/images/logo_1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App name and tagline */}
      <Text style={styles.title}>CareMate</Text>
      <Text style={styles.subtitle}>"CareMate – Your Everyday Care Companion"</Text>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      {/* Family silhouette at the very bottom */}
      <Image
        source={require('../../assets/images/family_splash.png')}
        style={styles.family}
        resizeMode="contain"
      />
    </View>
  );
}

const LOGO_HEIGHT = height * 0.23;
const FAMILY_HEIGHT = height * 0.13;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: height * 0.14,
  },
  logo: {
    width: width * 0.48,
    height: LOGO_HEIGHT,
    marginBottom: 24,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0a1663',
    marginTop: 6,
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#0a1663',
    marginBottom: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#0a1663',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 12,
    marginBottom: FAMILY_HEIGHT + 18,
    elevation: 2,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  family: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    height: FAMILY_HEIGHT,
    zIndex: 1,
  },
});
