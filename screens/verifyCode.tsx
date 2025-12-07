import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type VerifyCodeScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToNewPassword?: () => void;
};

export default function VerifyCodeScreen({ onNavigateBack, onNavigateToNewPassword }: VerifyCodeScreenProps) {
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

                    {/* Title */}
                    <Text style={styles.title}>Verify Code</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>Enter the 4-digit code we emailed you</Text>

                    {/* Code Input Fields */}
                    <View style={styles.codeContainer}>
                        <TextInput
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                        <TextInput
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                        <TextInput
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                        <TextInput
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                    </View>

                    {/* Resend Code */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive it? </Text>
                        <TouchableOpacity onPress={() => onNavigateBack && onNavigateBack()}>
                            <Text style={styles.resendLink}>Resend Code</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            {/* Verify Button - Fixed at bottom */}
            <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.verifyButton}
                    onPress={() => onNavigateToNewPassword && onNavigateToNewPassword()}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
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
        marginBottom: 40,
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
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    codeInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#fff',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#6B7280',
    },
    resendLink: {
        fontSize: 14,
        color: '#000',
        textDecorationLine: 'underline',
    },
    verifyButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

