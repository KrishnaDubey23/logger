import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

type Gender = 'male' | 'female';

const GenderSelectionScreen = () => {
    const [selectedGender, setSelectedGender] = useState<Gender>('male'); // Defaulting to male based on screenshot, or null

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => console.log('Back')}>
                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                            <Path d="M15 18L9 12L15 6" stroke="#0F172A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </Pressable>
                    <Text style={styles.title}>Tell us about yourself</Text>
                    <Text style={styles.subtitle}>This helps us create your personalized{'\n'}plan</Text>
                </View>

                {/* Gender Options */}
                <View style={styles.optionsContainer}>
                    {/* Male Option */}
                    <Pressable
                        style={[
                            styles.optionCard,
                            selectedGender === 'male' ? styles.optionCardSelected : styles.optionCardUnselected
                        ]}
                        onPress={() => setSelectedGender('male')}
                    >
                        <View style={styles.radioContainer}>
                            <View style={[
                                styles.radioOuter,
                                selectedGender === 'male' ? styles.radioOuterSelected : styles.radioOuterUnselected
                            ]}>
                                {selectedGender === 'male' && <View style={styles.radioInner} />}
                            </View>
                        </View>

                        <View style={styles.iconContainer}>
                            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={selectedGender === 'male' ? '#FFFFFF' : '#64748B'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M16 3h5v5M21 3l-6 6M16 13a6 6 0 1 1-6-6 6 6 0 0 1 6 6z" />
                            </Svg>
                        </View>
                        <Text style={[
                            styles.optionText,
                            selectedGender === 'male' ? styles.optionTextSelected : styles.optionTextUnselected
                        ]}>
                            Male
                        </Text>
                    </Pressable>

                    {/* Female Option */}
                    <Pressable
                        style={[
                            styles.optionCard,
                            selectedGender === 'female' ? styles.optionCardSelected : styles.optionCardUnselected
                        ]}
                        onPress={() => setSelectedGender('female')}
                    >
                        <View style={styles.radioContainer}>
                            <View style={[
                                styles.radioOuter,
                                selectedGender === 'female' ? styles.radioOuterSelected : styles.radioOuterUnselected
                            ]}>
                                {selectedGender === 'female' && <View style={styles.radioInner} />}
                            </View>
                        </View>

                        <View style={styles.iconContainer}>
                            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={selectedGender === 'female' ? '#FFFFFF' : '#64748B'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 15v7M9 18h6" />
                            </Svg>
                        </View>
                        <Text style={[
                            styles.optionText,
                            selectedGender === 'female' ? styles.optionTextSelected : styles.optionTextUnselected
                        ]}>
                            Female
                        </Text>
                    </Pressable>
                </View>

                {/* Prefer not to say */}
                <Pressable onPress={() => console.log('Prefer not to say')}>
                    <Text style={styles.preferNotToSay}>Prefer not to say</Text>
                </Pressable>

                {/* Footer */}
                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.continueBtn,
                            pressed && { opacity: 0.9 }
                        ]}
                        onPress={() => console.log('Continue with:', selectedGender)}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 0,
        padding: 8,
        zIndex: 10,
    },
    title: {
        fontSize: 35,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 24,
        marginTop: 60,
    },
    optionCard: {
        width: (width - 68) / 2,
        aspectRatio: 0.85,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    optionCardSelected: {
        backgroundColor: '#0F172A',
    },
    optionCardUnselected: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    radioContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#FFFFFF',
    },
    radioOuterUnselected: {
        borderColor: '#E2E8F0',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    iconContainer: {
        marginBottom: 16,
    },
    optionText: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
    },
    optionTextSelected: {
        color: '#FFFFFF',
    },
    optionTextUnselected: {
        color: '#0F172A',
    },
    preferNotToSay: {
        textAlign: 'center',
        color: '#0F172A',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginTop: 32,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    continueBtn: {
        backgroundColor: '#0F172A',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default GenderSelectionScreen;
