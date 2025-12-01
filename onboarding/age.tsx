import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const PICKER_HEIGHT = 300; // Fixed height for the picker area

const AgeItem = React.memo(({ item, index, scrollY, itemHeight }: { item: number, index: number, scrollY: Animated.Value, itemHeight: number }) => {
    const inputRange = [
        (index - 2) * itemHeight,
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight,
        (index + 2) * itemHeight,
    ];

    const scale = scrollY.interpolate({
        inputRange,
        outputRange: [0.8, 0.8, 1, 0.8, 0.8],
        extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
        inputRange,
        outputRange: [0.3, 0.4, 1, 0.4, 0.3],
        extrapolate: 'clamp',
    });

    const color = scrollY.interpolate({
        inputRange,
        outputRange: ['#9CA3AF', '#9CA3AF', '#000000', '#9CA3AF', '#9CA3AF'],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[
            styles.itemContainer,
            {
                height: itemHeight,
                transform: [{ scale }],
                opacity
            }
        ]}>
            <Animated.Text style={[styles.itemText, { color }]}>
                {item}
            </Animated.Text>
        </Animated.View>
    );
});

const AgeSelectionScreen = () => {
    const [selectedAge, setSelectedAge] = useState(23);
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<Animated.FlatList<number>>(null);

    const ages = Array.from({ length: 87 }, (_, i) => i + 14);

    useEffect(() => {
        const initialIndex = ages.indexOf(23);
        if (initialIndex !== -1) {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: initialIndex * ITEM_HEIGHT,
                    animated: false,
                });
                scrollY.setValue(initialIndex * ITEM_HEIGHT);
            }, 100);
        }
    }, []);

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const age = ages[index];
        if (age && age !== selectedAge) {
            setSelectedAge(age);
        }
    };

    const renderItem = useCallback(({ item, index }: { item: number; index: number }) => {
        return (
            <AgeItem
                item={item}
                index={index}
                scrollY={scrollY}
                itemHeight={ITEM_HEIGHT}
            />
        );
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Pressable style={styles.backButton} onPress={() => console.log('Back pressed')}>
                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                            <Path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </Pressable>

                    <View style={styles.headerTextContent}>
                        <Text style={styles.title}>What's your age?</Text>
                        <Text style={styles.subtitle}>This helps us create your personalized plan.</Text>
                    </View>
                </View>

                {/* Wrapper to center the picker vertically in the remaining space */}
                <View style={styles.centerWrapper}>
                    <View style={styles.pickerContainer}>
                        {/* Selection Highlight Box */}
                        <View style={styles.selectionHighlight} pointerEvents="none" />

                        <Animated.FlatList
                            ref={flatListRef}
                            data={ages}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            scrollEventThrottle={16}
                            contentContainerStyle={{
                                paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                            }}
                            getItemLayout={(_, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.continueButton,
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => console.log('Selected Age:', selectedAge)}
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 0,
        zIndex: 10,
        padding: 8,
    },
    headerTextContent: {
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 35,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#64748B',
        textAlign: 'center',
    },
    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50, // Move picker up slightly
    },
    pickerContainer: {
        height: PICKER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: width,
    },
    selectionHighlight: {
        position: 'absolute',
        width: width - 40,
        height: ITEM_HEIGHT,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 12,
        top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
        backgroundColor: 'transparent',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    itemText: {
        fontSize: 48,
        fontFamily: 'Montserrat-Black',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    continueButton: {
        backgroundColor: '#000000',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default AgeSelectionScreen;
