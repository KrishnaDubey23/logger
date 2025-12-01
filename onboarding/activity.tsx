import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

type ActivityLevel = 'never' | 'rarely' | 'sometimes' | 'always';

const activityOptions = [
    {
        id: 'never',
        title: 'Never',
        subtitle: 'I don’t currently work out',
    },
    {
        id: 'rarely',
        title: 'Rarely',
        subtitle: '1-2 times a month',
    },
    {
        id: 'sometimes',
        title: 'Sometimes',
        subtitle: '1-3 times a week',
    },
    {
        id: 'always',
        title: 'Always',
        subtitle: '4+ times a week',
    },
];

const ActivitySelectionScreen = () => {
    const [selectedActivity, setSelectedActivity] = useState<ActivityLevel | null>('sometimes');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable style={styles.backButton} onPress={() => console.log('Back')}>
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                <Path d="M15 18L9 12L15 6" stroke="#0F172A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                        </Pressable>
                        <Text style={styles.title}>How often do you currently work out?</Text>
                        <Text style={styles.subtitle}>This helps us tailor a plan that works{'\n'}for you.</Text>
                    </View>

                    {/* Options */}
                    <ScrollView
                        style={styles.optionsScroll}
                        contentContainerStyle={styles.optionsContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {activityOptions.map((option) => {
                            const isSelected = selectedActivity === option.id;
                            return (
                                <Pressable
                                    key={option.id}
                                    style={[
                                        styles.optionCard,
                                        isSelected ? styles.optionCardSelected : styles.optionCardUnselected
                                    ]}
                                    onPress={() => setSelectedActivity(option.id as ActivityLevel)}
                                >
                                    <View style={styles.textContainer}>
                                        <Text style={[
                                            styles.optionTitle,
                                            isSelected ? styles.optionTitleSelected : styles.optionTitleUnselected
                                        ]}>
                                            {option.title}
                                        </Text>
                                        <Text style={[
                                            styles.optionSubtitle,
                                            isSelected ? styles.optionSubtitleSelected : styles.optionSubtitleUnselected
                                        ]}>
                                            {option.subtitle}
                                        </Text>
                                    </View>

                                    <View style={[
                                        styles.radioOuter,
                                        isSelected ? styles.radioOuterSelected : styles.radioOuterUnselected
                                    ]}>
                                        {isSelected && (
                                            <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
                                                <Path d="M2 6L5 9L10 3" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </Svg>
                                        )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.continueBtn,
                            !selectedActivity && styles.continueBtnDisabled,
                            pressed && selectedActivity && { opacity: 0.9 }
                        ]}
                        onPress={() => selectedActivity && console.log('Continue with:', selectedActivity)}
                        disabled={!selectedActivity}
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    backButton: {
        position: 'absolute',
        left: -4, // Adjust for padding
        top: 0,
        padding: 8,
        zIndex: 10,
    },
    title: {
        fontSize: 35,
        fontFamily: 'Montserrat-Black',
        color: '#0F172A',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 8,
        lineHeight: 34,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    optionsScroll: {
        flex: 1,
    },
    optionsContent: {
        gap: 12,
        paddingBottom: 120, // Space for footer
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionCardSelected: {
        backgroundColor: '#000000',
        borderColor: '#000000',
        // Double border effect if needed, but design looks like solid black
    },
    optionCardUnselected: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    textContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 2,
    },
    optionTitleSelected: {
        color: '#FFFFFF',
    },
    optionTitleUnselected: {
        color: '#0F172A',
    },
    optionSubtitle: {
        fontSize: 13,
        fontFamily: 'Montserrat-Regular',
    },
    optionSubtitleSelected: {
        color: '#94A3B8',
    },
    optionSubtitleUnselected: {
        color: '#64748B',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#FFFFFF',
    },
    radioOuterUnselected: {
        borderColor: '#E2E8F0',
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
    continueBtnDisabled: {
        backgroundColor: '#E2E8F0',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
});

export default ActivitySelectionScreen;
