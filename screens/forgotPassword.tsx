import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type ForgotPasswordScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToOtp?: () => void;
};

export default function ForgotPasswordScreen({ onNavigateBack, onNavigateToOtp }: ForgotPasswordScreenProps) {
    return (
        <>
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
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</Text>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>
            </SafeAreaView>
            {/* Send OTP Button - Fixed at bottom */}
            <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={() => onNavigateToOtp && onNavigateToOtp()}
                >
                    <Text style={styles.sendButtonText}>Send OTP</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
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
    },
    sendButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

