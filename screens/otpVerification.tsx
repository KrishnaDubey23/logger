import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type OtpVerificationScreenProps = {
    onNavigateBack?: () => void;
    onNavigateToVerifyCode?: () => void;
};

export default function OtpVerificationScreen({ onNavigateBack, onNavigateToVerifyCode }: OtpVerificationScreenProps) {
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

                {/* Checkmark Icon */}
                <View style={styles.checkmarkContainer}>
                    <Image
                        source={require('../assets/tick.png')}
                        style={styles.checkmarkImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Primary Message */}
                <Text style={styles.primaryMessage}>
                    A 4-digit code has been sent to your email
                </Text>

                {/* Secondary Message */}
                <Text style={styles.secondaryMessage}>
                    Enter the code to continue
                </Text>

                {/* Spacer to push button to bottom */}
                <View style={{ flex: 1 }} />

                {/* Continue Button */}
                <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={() => onNavigateToVerifyCode && onNavigateToVerifyCode()}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
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
        paddingBottom: 20,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 40,
    },
    checkmarkContainer: {
        width: 120,
        height: 120,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkImage: {
        width: 120,
        height: 120,
    },
    primaryMessage: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
        paddingHorizontal: 20,
        lineHeight: 28,
    },
    secondaryMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    continueButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

