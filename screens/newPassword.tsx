import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line } from 'react-native-svg';

type NewPasswordScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToSuccess?: () => void;
};

export default function NewPasswordScreen({ onNavigateBack, onNavigateToSuccess }: NewPasswordScreenProps) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                {/* Back Button */}
                <Pressable style={styles.backButton} onPress={() => onNavigateBack && onNavigateBack()}>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path d="M15 18L9 12L15 6" stroke="#0F172A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </Pressable>

                {/* Title */}
                <Text style={styles.title}>New Password</Text>

                {/* New Password Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showNewPassword}
                            autoCapitalize="none"
                        />
                        <Pressable
                            style={styles.eyeIcon}
                            onPress={() => setShowNewPassword(!showNewPassword)}
                        >
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                                {showNewPassword ? (
                                    <>
                                        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <Circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth={2} />
                                    </>
                                ) : (
                                    <>
                                        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <Line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </>
                                )}
                            </Svg>
                        </Pressable>
                    </View>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <Pressable
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                                {showConfirmPassword ? (
                                    <>
                                        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <Circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth={2} />
                                    </>
                                ) : (
                                    <>
                                        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <Line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </>
                                )}
                            </Svg>
                        </Pressable>
                    </View>
                </View>

                {/* Password Requirement Text */}
                <Text style={styles.requirementText}>Password must be at least 8 characters.</Text>
            </View>

        </SafeAreaView>
        {/* Reset Password Button - Fixed at bottom */}
        <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
            <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => onNavigateToSuccess && onNavigateToSuccess()}
            >
                <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
    },
    eyeIcon: {
        padding: 8,
    },
    requirementText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
    },
    resetButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

