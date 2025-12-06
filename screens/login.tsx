import { StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToSignUp?: () => void;
    onNavigateToForgotPassword?: () => void;
    onAuthComplete?: () => void;
};

export default function LoginScreen({ onNavigateBack, onNavigateToSignUp, onNavigateToForgotPassword, onAuthComplete }: LoginScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Welcome Back</Text>

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

                {/* Password Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity 
                    style={styles.forgotPasswordContainer}
                    onPress={() => onNavigateToForgotPassword && onNavigateToForgotPassword()}
                >
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => onAuthComplete && onAuthComplete()}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Login Button (icon removed to avoid extra dependency) */}
                <TouchableOpacity style={styles.googleButton}>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => onNavigateToSignUp && onNavigateToSignUp()}>
                        <Text style={styles.signUpLink}>Sign Up</Text>
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
        paddingTop: 40,
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
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    forgotPassword: {
        fontSize: 14,
        color: '#000',
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    loginButtonText: {
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
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    signUpLink: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});