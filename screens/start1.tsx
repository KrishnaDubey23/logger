import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const Start1Screen: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationCard}>
                    <View style={styles.illustrationPlaceholder}>
                        <Image
                            source={require('../assets/track.png')}
                            style={styles.illustrationImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Track your workouts
                    {'\n'}
                    with clarity
                </Text>
                <Text style={styles.subtitle}>
                    A simple, focused space to log your progress
                    {'\n'}
                    and stay motivated.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    illustrationWrapper: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 40,
    },
    illustrationCard: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    illustrationImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginTop: 40,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default Start1Screen;

