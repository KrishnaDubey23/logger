import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FloatingWindowProps = {
    activeIndex: number;
    totalSlides: number;
    onSignUp: () => void;
    onLogin: () => void;
};

const FloatingWindow: React.FC<FloatingWindowProps> = ({ activeIndex, totalSlides, onSignUp, onLogin }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
            <View style={styles.dotsContainer}>
                {Array.from({ length: totalSlides }).map((_, idx) => (
                    <View
                        key={`dot-${idx}`}
                        style={[styles.dot, idx === activeIndex ? styles.dotActive : styles.dotInactive]}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onSignUp}>
                <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={onLogin}>
                <Text style={styles.secondaryButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                {'\n'}
                and <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 5,
    },
    dotInactive: {
        backgroundColor: '#E2E8F0',
    },
    dotActive: {
        backgroundColor: '#111111',
    },
    primaryButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 18,
        backgroundColor: '#111111',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '600',
    },
    termsText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
        color: '#4B5563',
    },
    linkText: {
        textDecorationLine: 'underline',
        color: '#1F2937',
    },
});

export default FloatingWindow;

