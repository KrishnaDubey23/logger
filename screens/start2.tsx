import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const Start2Screen: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <View style={styles.illustrationCard}>
                    <View style={styles.illustrationPlaceholder}>
                        <Image
                            source={require('../assets/custom.png')}
                            style={styles.illustrationImage}
                            resizeMode="contain"
                        />
                    </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: '70%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    illustrationImage: {
        width: '85%',
        height: '85%',
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

