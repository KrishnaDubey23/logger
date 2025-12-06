import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PasswordResetSuccessScreenProps = {
    onNavigateToLogin?: () => void;
};

export default function PasswordResetSuccessScreen({ onNavigateToLogin }: PasswordResetSuccessScreenProps) {
    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.content}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../assets/login.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Main Message */}
                    <Text style={styles.mainMessage}>Password reset successfully</Text>

                    {/* Instructional Text */}
                    <Text style={styles.instructionText}>You can now log in with your new password</Text>
                </View>
            </SafeAreaView>
            {/* Go to Login Button - Fixed at bottom */}
            <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => onNavigateToLogin && onNavigateToLogin()}
                >
                    <Text style={styles.loginButtonText}>Go to Login</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 120,
        height: 120,
    },
    mainMessage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    loginButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

