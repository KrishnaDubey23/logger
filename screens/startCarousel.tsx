import React, { useRef, useState } from 'react';
import { View, FlatList, useWindowDimensions, StatusBar } from 'react-native';
import StartSlideOne from './start1';
import StartSlideTwo from './start2';
import StartSlideThree from './start3';
import FloatingWindow from './floatingwindow';

const slides = [
    { id: 'slide-1', component: StartSlideOne, barStyle: 'dark-content' as const },
    { id: 'slide-2', component: StartSlideTwo, barStyle: 'light-content' as const },
    { id: 'slide-3', component: StartSlideThree, barStyle: 'dark-content' as const },
];

type StartCarouselProps = {
    onSignUp: () => void;
    onLogin: () => void;
};

const StartCarousel: React.FC<StartCarouselProps> = ({ onSignUp, onLogin }) => {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
        if (viewableItems.length && typeof viewableItems[0].index === 'number') {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={slides[activeIndex].barStyle} />

            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={({ item }) => {
                    const SlideComponent = item.component;
                    return (
                        <View style={{ width, flex: 1 }}>
                            <SlideComponent />
                        </View>
                    );
                }}
            />

            <FloatingWindow
                activeIndex={activeIndex}
                totalSlides={slides.length}
                onSignUp={onSignUp}
                onLogin={onLogin}
            />
        </View>
    );
};

export default StartCarousel;

