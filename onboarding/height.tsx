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
    Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const RULER_ITEM_WIDTH = 10; // Width of each tick mark area
const VISIBLE_ITEMS = 20; // Number of items visible on screen

const HeightSelectionScreen = () => {
    const [unit, setUnit] = useState<'ft' | 'cm'>('ft');
    const [heightCm, setHeightCm] = useState(178); // Default 5'10" approx
    const [heightInches, setHeightInches] = useState(70); // Default 5'10"

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<Animated.FlatList<any>>(null);

    // Ranges
    // CM: 100cm to 250cm
    const minCm = 100;
    const maxCm = 250;
    const cmRange = Array.from({ length: maxCm - minCm + 1 }, (_, i) => minCm + i);

    // Inches: 3'0" (36) to 8'4" (100)
    const minInch = 36;
    const maxInch = 100;
    const inchRange = Array.from({ length: maxInch - minInch + 1 }, (_, i) => minInch + i);

    const currentRange = unit === 'cm' ? cmRange : inchRange;
    const minVal = unit === 'cm' ? minCm : minInch;

    // Convert between units when toggling
    useEffect(() => {
        if (unit === 'cm') {
            const newCm = Math.round(heightInches * 2.54);
            setHeightCm(newCm);
            scrollToValue(newCm, minCm);
        } else {
            const newInches = Math.round(heightCm / 2.54);
            setHeightInches(newInches);
            scrollToValue(newInches, minInch);
        }
    }, [unit]);

    const scrollToValue = (value: number, min: number) => {
        const index = value - min;
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({
                offset: index * RULER_ITEM_WIDTH,
                animated: false,
            });
        }, 50);
    };

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
    );

    const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / RULER_ITEM_WIDTH);
        const value = currentRange[index];

        if (value) {
            if (unit === 'cm') {
                setHeightCm(value);
            } else {
                setHeightInches(value);
            }
        }
    };

    const renderRulerItem = useCallback(({ item, index }: { item: number, index: number }) => {
        const isMajor = unit === 'cm' ? item % 10 === 0 : item % 12 === 0;

        return (
            <View style={{ width: RULER_ITEM_WIDTH, alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
                {/* Tick Mark */}
                <View style={[
                    styles.tick,
                    {
                        height: isMajor ? 30 : 15,
                        backgroundColor: isMajor ? '#CBD5E1' : '#E2E8F0'
                    }
                ]} />

                {/* Label for major ticks */}
                {isMajor && (
                    <Text style={styles.rulerLabel}>
                        {unit === 'cm' ? item : `${Math.floor(item / 12)}'`}
                    </Text>
                )}
            </View>
        );
    }, [unit]);

    const formatHeight = () => {
        if (unit === 'cm') {
            return (
                <Text style={styles.valueText}>
                    {heightCm}
                    <Text style={styles.unitLabel}> cm</Text>
                </Text>
            );
        } else {
            const feet = Math.floor(heightInches / 12);
            const inches = heightInches % 12;
            return (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.valueText}>{feet}'</Text>
                    <Text style={[styles.valueText, { color: '#CBD5E1' }]}>{inches}"</Text>
                </View>
            );
        }
    };

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
                        <Text style={styles.title}>What's your height?</Text>
                        <Text style={styles.subtitle}>This helps us customize your experience.</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Value Display */}
                    <View style={styles.valueDisplay}>
                        {formatHeight()}
                    </View>

                    {/* Ruler */}
                    <View style={styles.rulerContainer}>
                        <View style={styles.indicator} pointerEvents="none" />
                        <Animated.FlatList
                            ref={flatListRef}
                            data={currentRange}
                            renderItem={renderRulerItem}
                            keyExtractor={(item) => item.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={RULER_ITEM_WIDTH}
                            decelerationRate="fast"
                            onScroll={onScroll}
                            onMomentumScrollEnd={onMomentumScrollEnd}
                            scrollEventThrottle={16}
                            contentContainerStyle={{
                                paddingHorizontal: width / 2 - RULER_ITEM_WIDTH / 2,
                            }}
                            getItemLayout={(_, index) => ({
                                length: RULER_ITEM_WIDTH,
                                offset: RULER_ITEM_WIDTH * index,
                                index,
                            })}
                        />
                    </View>

                    {/* Unit Toggle */}
                    <View style={styles.toggleContainer}>
                        <Pressable
                            style={[styles.toggleOption, unit === 'ft' && styles.toggleSelected]}
                            onPress={() => setUnit('ft')}
                        >
                            <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextSelected]}>ft / in</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.toggleOption, unit === 'cm' && styles.toggleSelected]}
                            onPress={() => setUnit('cm')}
                        >
                            <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextSelected]}>cm</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.continueButton,
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={() => console.log('Selected Height:', unit === 'cm' ? `${heightCm}cm` : `${Math.floor(heightInches / 12)}'${heightInches % 12}"`)}
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    valueDisplay: {
        marginBottom: 50,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 100,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
    },
    unitLabel: {
        fontSize: 24,
        color: '#64748B',
        fontFamily: 'Montserrat-SemiBold',
    },
    rulerContainer: {
        height: 100,
        width: width,
        justifyContent: 'center',
        marginBottom: 40,
    },
    indicator: {
        position: 'absolute',
        left: width / 2 - 1.5, // Center the 3px line
        bottom: 20, // Align with ruler bottom
        width: 3,
        height: 50,
        backgroundColor: '#0F172A',
        zIndex: 10,
        borderRadius: 1.5,
    },
    tick: {
        width: 2,
        borderRadius: 1,
        marginBottom: 10,
    },
    rulerLabel: {
        position: 'absolute',
        bottom: -20,
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: 'Montserrat-Medium',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 25,
        padding: 4,
        width: 200,
        height: 50,
    },
    toggleOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21,
    },
    toggleSelected: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: '#64748B',
    },
    toggleTextSelected: {
        color: '#0F172A',
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

export default HeightSelectionScreen;
