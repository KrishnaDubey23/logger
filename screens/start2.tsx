import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Start2Screen: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationCard}>
                    <View style={styles.illustrationPlaceholder} />
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    Create custom
                    {'\n'}
                    exercises and your
                    {'\n'}
                    weekly plan
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
        backgroundColor: '#F9CDA4', // peach tone similar to design
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: '55%',
        height: '55%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#111827',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255,255,255,0.85)',
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
    },
});

export default Start2Screen;

