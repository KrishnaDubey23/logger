import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

type SignUpScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToLogin?: () => void;
    onAuthComplete?: () => void;
};

export default function SignUpScreen({ onNavigateBack, onNavigateToLogin, onAuthComplete }: SignUpScreenProps) {
    const [showPassword, setShowPassword] = useState(false);
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

                {/* Header */}
                <Text style={styles.title}>Create an account</Text>

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password Input */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <Pressable
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            {showPassword ? (
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

                {/* Confirm Password Input */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
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

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => onAuthComplete && onAuthComplete()}
                >
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Sign Up Button (icon removed to avoid extra dependency) */}
                <TouchableOpacity style={styles.googleButton}>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => onNavigateToLogin && onNavigateToLogin()}>
                        <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
    },
    eyeIcon: {
        padding: 8,
    },
    signUpButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 30,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#9CA3AF',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 30,
        gap: 10,
    },
    googleButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    loginLink: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
});