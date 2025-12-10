import React, { useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';

type SplashScreenProps = {
  /** Called when the splash should dismiss (e.g., timer elapsed) */
  onFinish?: () => void;
  /** Duration in ms before calling onFinish. Default 500ms */
  durationMs?: number;
};

/**
 * Simple branded splash. Shows a centered image and a subtle loader.
 * Uses an optional timer to notify the parent when it should dismiss.
 */
export default function SplashScreen({ onFinish, durationMs = 500 }: SplashScreenProps) {
  useEffect(() => {
    if (!onFinish) return;
    const timer = setTimeout(onFinish, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/icon.png')} style={styles.image} resizeMode="contain" />
        </View>
        <ActivityIndicator color="#000" style={{ marginTop: 24 }} />
        <Text style={styles.caption}>Loading your workout logger...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 24,
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },
});

