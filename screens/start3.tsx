import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Start3Screen: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationCard}>
                    <View style={styles.illustrationPlaceholder} />
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Grow your progress
                    {'\n'}
                    steadily
                </Text>
                <Text style={styles.subtitle}>
                    Log your sessions and watch your
                    {'\n'}
                    practice flourish.
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
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F5F5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: '65%',
        height: '65%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#111827',
        borderStyle: 'dashed',
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

export default Start3Screen;

