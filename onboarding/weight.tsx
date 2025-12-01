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
const ITEM_HEIGHT = 60;
const PICKER_HEIGHT = 300;

// Generate data ranges outside component to avoid recreation
const wholeRange = Array.from({ length: 271 }, (_, i) => i + 30);
const decimalRange = Array.from({ length: 10 }, (_, i) => i);

// Reusable item component for the picker
const WeightItem = React.memo(({
    item,
    index,
    scrollY,
    itemHeight,
}: {
    item: number,
    index: number,
    scrollY: Animated.Value,
    itemHeight: number,
}) => {
    const inputRange = [
        (index - 2) * itemHeight,
        (index - 1) * itemHeight,
        index * itemHeight,
        (index + 1) * itemHeight,
        (index + 2) * itemHeight,
    ];

    const scale = scrollY.interpolate({
        inputRange,
        outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
        extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
        inputRange,
        outputRange: [0.3, 0.5, 1, 0.5, 0.3],
        extrapolate: 'clamp',
    });

    const color = scrollY.interpolate({
        inputRange,
        outputRange: ['#94A3B8', '#64748B', '#0F172A', '#64748B', '#94A3B8'],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[
            styles.itemContainer,
            {
                opacity,
                transform: [{ scale }],
            }
        ]}>
            <Animated.Text style={[styles.itemText, { color }]}>
                {item}
            </Animated.Text>
        </Animated.View>
    );
});

const WeightSelectionScreen = () => {
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const baseWeightKg = useRef(70.0); // Source of truth
    const [wholeNumber, setWholeNumber] = useState(70);
    const [decimal, setDecimal] = useState(0);

    const scrollYWhole = useRef(new Animated.Value(0)).current;
    const scrollYDecimal = useRef(new Animated.Value(0)).current;

    const flatListRefWhole = useRef<Animated.FlatList<number>>(null);
    const flatListRefDecimal = useRef<Animated.FlatList<number>>(null);

    // Initial scroll to default value
    useEffect(() => {
        // Reduced timeout for faster initial render perception
        setTimeout(() => {
            scrollToValue(70, 0, false);
        }, 50);
    }, []);

    // Handle Unit Toggle
    const handleUnitChange = (newUnit: 'kg' | 'lbs') => {
        if (unit === newUnit) return;
        setUnit(newUnit);

        // Calculate new display values based on baseWeightKg
        let displayVal = baseWeightKg.current;
        if (newUnit === 'lbs') {
            displayVal = displayVal * 2.20462;
        }

        // Fix: Round to 1 decimal place to avoid floating point precision issues
        const roundedVal = Math.round(displayVal * 10) / 10;

        const newWhole = Math.floor(roundedVal);
        const newDecimal = Math.round((roundedVal - newWhole) * 10);

        scrollToValue(newWhole, newDecimal, true);
    };

    const scrollToValue = (whole: number, dec: number, animated: boolean = true) => {
        setWholeNumber(whole);
        setDecimal(dec);

        const wholeIndex = wholeRange.indexOf(whole);
        const decIndex = decimalRange.indexOf(dec);

        if (wholeIndex !== -1 && flatListRefWhole.current) {
            flatListRefWhole.current.scrollToOffset({
                offset: wholeIndex * ITEM_HEIGHT,
                animated,
            });
            if (!animated) scrollYWhole.setValue(wholeIndex * ITEM_HEIGHT);
        }

        if (decIndex !== -1 && flatListRefDecimal.current) {
            flatListRefDecimal.current.scrollToOffset({
                offset: decIndex * ITEM_HEIGHT,
                animated,
            });
            if (!animated) scrollYDecimal.setValue(decIndex * ITEM_HEIGHT);
        }
    };

    // Scroll Handlers
    const onMomentumScrollEndWhole = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const value = wholeRange[index];

        if (value !== undefined) {
            setWholeNumber(value);
            updateBaseWeight(value, decimal);
        }
    };

    const onMomentumScrollEndDecimal = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const value = decimalRange[index];

        if (value !== undefined) {
            setDecimal(value);
            updateBaseWeight(wholeNumber, value);
        }
    };

    const updateBaseWeight = (w: number, d: number) => {
        const displayVal = w + (d / 10);
        if (unit === 'kg') {
            baseWeightKg.current = displayVal;
        } else {
            baseWeightKg.current = displayVal / 2.20462;
        }
    };

    const renderItemWhole = useCallback(({ item, index }: { item: number; index: number }) => {
        return (
            <WeightItem
                item={item}
                index={index}
                scrollY={scrollYWhole}
                itemHeight={ITEM_HEIGHT}
            />
        );
    }, []);

    const renderItemDecimal = useCallback(({ item, index }: { item: number; index: number }) => {
        return (
            <WeightItem
                item={item}
                index={index}
                scrollY={scrollYDecimal}
                itemHeight={ITEM_HEIGHT}
            />
        );
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => console.log('Back')}>
                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                            <Path d="M15 18L9 12L15 6" stroke="#0F172A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </Pressable>
                    <Text style={styles.title}>What's your current weight?</Text>
                    <Text style={styles.subtitle}>This helps us calculate your progress and personalize your plan.</Text>
                </View>

                {/* Unit Toggle */}
                <View style={styles.toggleContainer}>
                    <Pressable
                        style={[styles.toggleBtn, unit === 'kg' && styles.toggleBtnActive]}
                        onPress={() => handleUnitChange('kg')}
                    >
                        <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>kg</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.toggleBtn, unit === 'lbs' && styles.toggleBtnActive]}
                        onPress={() => handleUnitChange('lbs')}
                    >
                        <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>lbs</Text>
                    </Pressable>
                </View>

                {/* Picker Area */}
                <View style={styles.pickerContainer}>
                    {/* Selection Highlight Background */}
                    <View style={styles.selectionHighlight} pointerEvents="none" />

                    <View style={styles.pickerRow}>
                        {/* Whole Numbers */}
                        <View style={[styles.columnContainer, styles.columnContainerWhole]}>
                            <Animated.FlatList
                                ref={flatListRefWhole}
                                data={wholeRange}
                                renderItem={renderItemWhole}
                                keyExtractor={(item) => `whole-${item}`}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                scrollEventThrottle={16} // Critical for smooth animation
                                initialNumToRender={15}
                                maxToRenderPerBatch={10}
                                windowSize={5}
                                removeClippedSubviews={true}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollYWhole } } }],
                                    { useNativeDriver: true }
                                )}
                                onMomentumScrollEnd={onMomentumScrollEndWhole}
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

                        {/* Decimal Point */}
                        <View style={styles.dotContainer}>
                            <Text style={styles.dotText}>•</Text>
                        </View>

                        {/* Decimal Numbers */}
                        <View style={[styles.columnContainer, styles.columnContainerDecimal]}>
                            <Animated.FlatList
                                ref={flatListRefDecimal}
                                data={decimalRange}
                                renderItem={renderItemDecimal}
                                keyExtractor={(item) => `dec-${item}`}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                scrollEventThrottle={16} // Critical for smooth animation
                                initialNumToRender={10}
                                maxToRenderPerBatch={5}
                                windowSize={5}
                                removeClippedSubviews={true}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollYDecimal } } }],
                                    { useNativeDriver: true }
                                )}
                                onMomentumScrollEnd={onMomentumScrollEndDecimal}
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
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.9 }]}
                        onPress={() => console.log('Continue with:', baseWeightKg.current)}
                    >
                        <Text style={styles.continueText}>Continue</Text>
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
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 0,
        padding: 8,
        zIndex: 10,
    },
    title: {
        fontSize: 35,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 25,
        padding: 4,
        marginHorizontal: 40,
        marginTop: 32,
        height: 50,
    },
    toggleBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21,
    },
    toggleBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: '#64748B',
    },
    toggleTextActive: {
        color: '#0F172A',
    },
    pickerContainer: {
        height: PICKER_HEIGHT,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionHighlight: {
        position: 'absolute',
        width: 320,
        height: ITEM_HEIGHT + 10, // Slightly taller than item
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        top: (PICKER_HEIGHT - (ITEM_HEIGHT + 10)) / 2,
        zIndex: -1,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: PICKER_HEIGHT,
        width: '100%',
    },
    columnContainer: {
        width: 120,
        height: PICKER_HEIGHT,
    },
    columnContainerWhole: {
        alignItems: 'flex-end',
        paddingRight: 8,
    },
    columnContainerDecimal: {
        alignItems: 'flex-start',
        paddingLeft: 8,
    },
    dotContainer: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: (PICKER_HEIGHT - ITEM_HEIGHT) / 2, // Align with center selection
        height: ITEM_HEIGHT,
    },
    dotText: {
        fontSize: 32,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
        includeFontPadding: false,
        textAlignVertical: 'center',
        lineHeight: 32,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    itemText: {
        fontSize: 32,
        fontFamily: 'Montserrat-Black',
        includeFontPadding: false,
        textAlignVertical: 'center',
        lineHeight: 32, // Match font size for tight bounding box
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    continueBtn: {
        backgroundColor: '#000000',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default WeightSelectionScreen;
