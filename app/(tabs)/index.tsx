import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  // Animated values for pop/fade and move
  const logoScale = React.useRef(new Animated.Value(0)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const textScale = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 820,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  return (
    <View style={styles.bg}>
      {/* Subtle vertical gradient background */}
      <LinearGradient
        colors={['#f1f8fe', '#eaf0fa']}
        style={StyleSheet.absoluteFill}
      />
      {/* Blue curved top with logo */}
      <View style={styles.curvedTopWrap}>
        <LinearGradient
          colors={['#1e88e5', '#33aaf9']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.blueTop}
        >
          <Animated.View
            style={[
              styles.logoCircleOuter,
              { transform: [{ scale: logoScale }], opacity: logoOpacity },
            ]}
          >
            <View style={styles.logoCircleInner}>
              <Image
                source={require('../../assets/images/avatar.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
      {/* App name and tagline */}
      <View style={styles.middle}>
        <Animated.Text
          style={[
            styles.title,
            { opacity: textOpacity, transform: [{ scale: textScale }] },
          ]}
        >
          CareMate
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: textOpacity, transform: [{ scale: textScale }] },
          ]}
        >
          "CareMate – Your Everyday Care Companion"
        </Animated.Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#2196f3', '#51c3fd']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 1, y: 0.6 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const LOGO_HEIGHT = height * 0.18;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-start',
  },
  curvedTopWrap: {
    height: height * 0.44,
    overflow: 'hidden',
    width: '100%',
    zIndex: 2,
  },
  blueTop: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: width * 0.60,
    borderBottomRightRadius: width * 0.60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    shadowColor: '#178be9',
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 26,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  logoCircleOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -35,
    width: width * 0.50 + 20,
    height: LOGO_HEIGHT * 1.28,
    borderRadius: 999,
    backgroundColor: '#d5eafd',
    shadowColor: '#189cf4',
    shadowOpacity: 0.10,
    shadowRadius: 28,
    elevation: 10
  },
  logoCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.50,
    height: LOGO_HEIGHT * 1.14,
    borderRadius: 999,
    backgroundColor: '#fff',
    shadowColor: '#33aaf9',
    shadowOpacity: 0.15,
    shadowRadius: 34,
    elevation: 9
  },
  logo: {
    width: width * 0.37,
    height: LOGO_HEIGHT * 0.88,
    alignSelf: 'center',
  },
  middle: {
    alignItems: 'center',
    marginTop: height * 0.08,
    paddingHorizontal: 24,
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1645a0',
    marginBottom: 10,
    marginTop: 12,
    letterSpacing: 1.0,
    textAlign: 'center',
    textShadowColor: '#e2ecfb',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16.2,
    color: '#1859bc',
    marginBottom: 36,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    paddingHorizontal: 16,
    opacity: 0.93,
    letterSpacing: 0.42,
  },
  button: {
    width: width * 0.83,
    borderRadius: 24,
    shadowColor: '#44b7f6',
    shadowOpacity: 0.18,
    shadowRadius: 13,
    elevation: 7,
    marginTop: 12,
    overflow: 'hidden'
  },
  buttonGradient: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19.7,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textAlign: 'center',
    textShadowColor: '#2195f366',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0.5,
  },
});
