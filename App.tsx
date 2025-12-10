/**
 * Workout Logger App
 * Minimal MVP: Add exercises and sets (reps, weight). In-memory only.
 * @format
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Modal,
  Platform,
  useWindowDimensions,
  Animated,
  PanResponder,
  Easing,
  ViewProps,
} from 'react-native';
import Svg, { G, Polygon, Line, Circle, Text as SvgText, Path, Rect } from 'react-native-svg';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from './screens/splash';
import GenderSelectionScreen from './onboarding/gender';
import AgeSelectionScreen from './onboarding/age';
import HeightSelectionScreen from './onboarding/height';
import WeightSelectionScreen from './onboarding/weight';
import ActivitySelectionScreen from './onboarding/activity';
import LoginScreen from './screens/login';
import SignUpScreen from './screens/signup';
import ForgotPasswordScreen from './screens/forgotPassword';
import OtpVerificationScreen from './screens/otpVerification';
import VerifyCodeScreen from './screens/verifyCode';
import NewPasswordScreen from './screens/newPassword';
import PasswordResetSuccessScreen from './screens/passwordResetSuccess';
import StartCarousel from './screens/startCarousel';

// RoundedView: currently behaves like a normal View (continuous corners disabled)
const USE_CONTINUOUS_CURVE = false;
const RoundedView = React.forwardRef<View, ViewProps>(({ style, ...rest }, forwardedRef) => {
  const localRef = useRef<View>(null);
  useEffect(() => {
    const node = localRef.current as any;
    if (USE_CONTINUOUS_CURVE && Platform.OS === 'ios' && node) {
      try {
        node.setNativeProps({ cornerCurve: 'continuous' });
      } catch { }
    }
  }, [style]);

  return (
    <View
      ref={(node) => {
        // @ts-ignore assign to local and forwarded refs
        localRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node as any);
        else if (forwardedRef && 'current' in (forwardedRef as any)) (forwardedRef as any).current = node as any;
      }}
      style={style}
      {...rest}
    />
  );
});
RoundedView.displayName = 'RoundedView';

type BodyPart =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Glutes'
  | 'Full Body';

type SetItem = { id: string; reps: number; weight: number };
type Exercise = { id: string; name: string; bodyPart: BodyPart; sets: SetItem[]; timestamp: number };
type UserProfile = {
  name: string;
  weight: string;
  height: string;
  age: string;
  gender: string;
};

const BODY_PARTS: BodyPart[] = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Glutes',
  'Full Body',
];

const EXERCISE_LIBRARY: Array<{ name: string; bodyPart: BodyPart }> = [
  { name: 'Barbell Bench Press', bodyPart: 'Chest' },
  { name: 'Incline DB Press', bodyPart: 'Chest' },
  { name: 'Push-Up', bodyPart: 'Chest' },
  { name: 'Decline Bench Press', bodyPart: 'Chest' },
  { name: 'Incline Bench Press', bodyPart: 'Chest' },
  { name: 'Chest Dips', bodyPart: 'Chest' },
  { name: 'Cable Fly', bodyPart: 'Chest' },
  { name: 'Pec Deck', bodyPart: 'Chest' },
  { name: 'Wide Push-ups', bodyPart: 'Chest' },
  { name: 'Dumbbell Fly', bodyPart: 'Chest' },
  { name: 'Incline Push-ups', bodyPart: 'Chest' },
  { name: 'Decline Push-ups', bodyPart: 'Chest' },
  { name: 'Close Grip Push-ups', bodyPart: 'Chest' },
  { name: 'Diamond Push-ups', bodyPart: 'Chest' },
  { name: 'Archer Push-ups', bodyPart: 'Chest' },
  { name: 'Pull-Up', bodyPart: 'Back' },
  { name: 'Deadlift', bodyPart: 'Back' },
  { name: 'Bent-Over Row', bodyPart: 'Back' },
  { name: 'Chin-ups', bodyPart: 'Back' },
  { name: 'Lat Pull-Down', bodyPart: 'Back' },
  { name: 'Seated Cable Row', bodyPart: 'Back' },
  { name: 'T-Bar Row', bodyPart: 'Back' },
  { name: 'Dumbbell Row', bodyPart: 'Back' },
  { name: 'Hyperextensions', bodyPart: 'Back' },
  { name: 'Face Pull', bodyPart: 'Back' },
  { name: 'Inverted Row', bodyPart: 'Back' },
  { name: 'Good Morning', bodyPart: 'Back' },
  { name: 'Reverse Grip Barbell Row', bodyPart: 'Back' },
  { name: 'Cable Pullover', bodyPart: 'Back' },
  { name: 'Machine Row', bodyPart: 'Back' },
  { name: 'Single-Arm Lat Pulldown', bodyPart: 'Back' },
  { name: 'Pendlay Row', bodyPart: 'Back' },
  { name: 'Landmine Row', bodyPart: 'Back' },
  { name: 'Kettlebell Swing', bodyPart: 'Back' },
  { name: 'Superman Hold', bodyPart: 'Back' },
  { name: 'Back Squat', bodyPart: 'Legs' },
  { name: 'Leg Press', bodyPart: 'Legs' },
  { name: 'Lunge', bodyPart: 'Legs' },
  { name: 'Front Squat', bodyPart: 'Legs' },
  { name: 'Bulgarian Split Squat', bodyPart: 'Legs' },
  { name: 'Romanian Deadlift', bodyPart: 'Legs' },
  { name: 'Hack Squat', bodyPart: 'Legs' },
  { name: 'Goblet Squat', bodyPart: 'Legs' },
  { name: 'Glute Bridge', bodyPart: 'Legs' },
  { name: 'Hip Thrust', bodyPart: 'Legs' },
  { name: 'Leg Curl', bodyPart: 'Legs' },
  { name: 'Leg Extension', bodyPart: 'Legs' },
  { name: 'Calf Raise', bodyPart: 'Legs' },
  { name: 'Step-Up', bodyPart: 'Legs' },
  { name: 'Sumo Deadlift', bodyPart: 'Legs' },
  { name: 'Single-Leg Deadlift', bodyPart: 'Legs' },
  { name: 'Pistol Squat', bodyPart: 'Legs' },
  { name: 'Box Squat', bodyPart: 'Legs' },
  { name: 'Overhead Press', bodyPart: 'Shoulders' },
  { name: 'Lateral Raise', bodyPart: 'Shoulders' },
  { name: 'Front Raise', bodyPart: 'Shoulders' },
  { name: 'Rear Delt Fly', bodyPart: 'Shoulders' },
  { name: 'Arnold Press', bodyPart: 'Shoulders' },
  { name: 'Push Press', bodyPart: 'Shoulders' },
  { name: 'Seated Dumbbell Press', bodyPart: 'Shoulders' },
  { name: 'Barbell Shoulder Press', bodyPart: 'Shoulders' },
  { name: 'Cable Lateral Raise', bodyPart: 'Shoulders' },
  { name: 'Machine Shoulder Press', bodyPart: 'Shoulders' },
  { name: 'Face Pull (for rear delt)', bodyPart: 'Shoulders' },
  { name: 'Dumbbell Shrug', bodyPart: 'Shoulders' },
  { name: 'Kettlebell Press', bodyPart: 'Shoulders' },
  { name: 'Landmine Press', bodyPart: 'Shoulders' },
  { name: 'Handstand Push-Up', bodyPart: 'Shoulders' },
  { name: 'Bicep Curl', bodyPart: 'Arms' },
  { name: 'Tricep Pushdown', bodyPart: 'Arms' },
  { name: 'Hammer Curl', bodyPart: 'Arms' },
  { name: 'Concentration Curl', bodyPart: 'Arms' },
  { name: 'Preacher Curl', bodyPart: 'Arms' },
  { name: 'Cable Curl', bodyPart: 'Arms' },
  { name: 'Incline Dumbbell Curl', bodyPart: 'Arms' },
  { name: 'Skull Crushers', bodyPart: 'Arms' },
  { name: 'Overhead Tricep Extension', bodyPart: 'Arms' },
  { name: 'Close-Grip Bench Press', bodyPart: 'Arms' },
  { name: 'Dips', bodyPart: 'Arms' },
  { name: 'Reverse Curl', bodyPart: 'Arms' },
  { name: 'Zottman Curl', bodyPart: 'Arms' },
  { name: 'Tricep Kickback', bodyPart: 'Arms' },
  { name: 'Rope Overhead Extension', bodyPart: 'Arms' },
  { name: 'Plank', bodyPart: 'Core' },
  { name: 'Hanging Leg Raise', bodyPart: 'Core' },
  { name: 'Crunches', bodyPart: 'Core' },
  { name: 'Bicycle Crunch', bodyPart: 'Core' },
  { name: 'Russian Twist', bodyPart: 'Core' },
  { name: 'Mountain Climbers', bodyPart: 'Core' },
  { name: 'Cable Woodchopper', bodyPart: 'Core' },
  { name: 'Side Plank', bodyPart: 'Core' },
  { name: 'Flutter Kicks', bodyPart: 'Core' },
  { name: 'V-Ups', bodyPart: 'Core' },
  { name: 'Sit-Ups', bodyPart: 'Core' },
  { name: 'Toe Touches', bodyPart: 'Core' },
  { name: 'Ab Rollout', bodyPart: 'Core' },
  { name: 'Hollow Body Hold', bodyPart: 'Core' },
  { name: 'Dead Bug', bodyPart: 'Core' },
  { name: 'Hip Thrust', bodyPart: 'Glutes' },
  { name: 'Glute Bridge', bodyPart: 'Glutes' },
  { name: 'Bulgarian Split Squat', bodyPart: 'Glutes' },
  { name: 'Romanian Deadlift', bodyPart: 'Glutes' },
  { name: 'Cable Kickback', bodyPart: 'Glutes' },
  { name: 'Sumo Deadlift', bodyPart: 'Glutes' },
  { name: 'Step-Up', bodyPart: 'Glutes' },
  { name: 'Kettlebell Swing', bodyPart: 'Glutes' },
  { name: 'Fire Hydrant', bodyPart: 'Glutes' },
  { name: 'Donkey Kicks', bodyPart: 'Glutes' },
  { name: 'Frog Pump', bodyPart: 'Glutes' },
  { name: 'Reverse Lunge', bodyPart: 'Glutes' },
  { name: 'Single-Leg Glute Bridge', bodyPart: 'Glutes' },
  { name: 'Cable Pull-Through', bodyPart: 'Glutes' },
  { name: 'Curtsy Lunge', bodyPart: 'Glutes' },
  { name: 'Kettlebell Swing', bodyPart: 'Full Body' },
  { name: 'Clean and Press', bodyPart: 'Full Body' },
  { name: 'Snatch', bodyPart: 'Full Body' },
  { name: 'Burpees', bodyPart: 'Full Body' },
  { name: 'Thruster', bodyPart: 'Full Body' },
  { name: 'Turkish Get-Up', bodyPart: 'Full Body' },
  { name: 'Deadlift to Press', bodyPart: 'Full Body' },
  { name: 'Bear Crawl', bodyPart: 'Full Body' },
  { name: 'Battle Ropes', bodyPart: 'Full Body' },
  { name: 'Medicine Ball Slam', bodyPart: 'Full Body' },
  { name: 'Sled Push', bodyPart: 'Full Body' },
  { name: 'Farmer’s Walk', bodyPart: 'Full Body' },
  { name: 'Man Maker', bodyPart: 'Full Body' },
  { name: 'Mountain Climber to Push-Up', bodyPart: 'Full Body' },
  { name: 'Squat Clean', bodyPart: 'Full Body' },
];

type AppStage = 'splash' | 'start' | 'login' | 'signup' | 'forgot-password' | 'otp-verification' | 'verify-code' | 'new-password' | 'password-reset-success' | 'onboarding' | 'main';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [stage, setStage] = useState<AppStage>('splash');
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (stage !== 'splash') return;
    const timer = setTimeout(() => setStage('start'), 1500);
    return () => clearTimeout(timer);
  }, [stage]);

  const goNext = () => {
    setOnboardingStep((prev) => {
      if (prev < 4) {
        return prev + 1;
      }
      setStage('main');
      return prev;
    });
  };

  const goBack = () => {
    setOnboardingStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goBackFromGender = () => {
    setStage('signup');
  };

  const renderOnboarding = () => {
    switch (onboardingStep) {
      case 0:
        return <GenderSelectionScreen onNext={goNext} onBack={goBackFromGender} />;
      case 1:
        return <AgeSelectionScreen onNext={goNext} onBack={goBack} />;
      case 2:
        return <HeightSelectionScreen onNext={goNext} onBack={goBack} />;
      case 3:
        return <WeightSelectionScreen onNext={goNext} onBack={goBack} />;
      case 4:
        return <ActivitySelectionScreen onNext={goNext} onBack={goBack} />;
      default:
        return <GenderSelectionScreen onNext={goNext} />;
    }
  };

  const handleAuthComplete = () => {
    setStage('onboarding');
    setOnboardingStep(0);
  };

  let content: React.ReactNode;
  if (stage === 'splash') {
    content = <SplashScreen onFinish={() => setStage('start')} />;
  } else if (stage === 'start') {
    content = (
      <StartCarousel
        onSignUp={() => setStage('signup')}
        onLogin={() => setStage('login')}
      />
    );
  } else if (stage === 'login') {
    content = (
      <LoginScreen
        onNavigateBack={() => setStage('start')}
        onNavigateToSignUp={() => setStage('signup')}
        onNavigateToForgotPassword={() => setStage('forgot-password')}
        onAuthComplete={handleAuthComplete}
      />
    );
  } else if (stage === 'forgot-password') {
    content = (
      <ForgotPasswordScreen
        onNavigateBack={() => setStage('login')}
        onNavigateToOtp={() => setStage('otp-verification')}
      />
    );
  } else if (stage === 'otp-verification') {
    content = (
      <OtpVerificationScreen
        onNavigateBack={() => setStage('forgot-password')}
        onNavigateToVerifyCode={() => setStage('verify-code')}
      />
    );
  } else if (stage === 'verify-code') {
    content = (
      <VerifyCodeScreen
        onNavigateBack={() => setStage('forgot-password')}
        onNavigateToNewPassword={() => setStage('new-password')}
      />
    );
  } else if (stage === 'new-password') {
    content = (
      <NewPasswordScreen
        onNavigateBack={() => setStage('forgot-password')}
        onNavigateToSuccess={() => setStage('password-reset-success')}
      />
    );
  } else if (stage === 'password-reset-success') {
    content = (
      <PasswordResetSuccessScreen
        onNavigateToLogin={() => setStage('login')}
      />
    );
  } else if (stage === 'signup') {
    content = (
      <SignUpScreen
        onNavigateBack={() => setStage('start')}
        onNavigateToLogin={() => setStage('login')}
        onAuthComplete={handleAuthComplete}
      />
    );
  } else if (stage === 'onboarding') {
    content = renderOnboarding();
  } else {
    content = <AppContent onLogout={() => setStage('login')} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {content}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function RadarChart({
  theme,
  size = 220,
  levels = 4,
  labels,
  values,
}: {
  theme: typeof lightTheme;
  size?: number;
  levels?: number;
  labels: string[];
  values: number[];
}) {
  const count = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size * 0.38);
  const isDark = theme.bg === '#000000';
  const strokeColor = isDark ? '#64D2FF' : '#0A84FF';
  const fillOpacity = isDark ? 0.22 : 0.18;

  const colorForLabel = (label: string) => {
    const key = label.toLowerCase();
    const light: Record<string, string> = {
      chest: '#FF3B30',
      back: '#0A84FF',
      legs: '#34C759',
      shoulders: '#FF9F0A',
      arms: '#BF5AF2',
      abs: '#30B0C7',
    };
    const dark: Record<string, string> = {
      chest: '#FF453A',
      back: '#64D2FF',
      legs: '#30D158',
      shoulders: '#FFD60A',
      arms: '#BF5AF2',
      abs: '#64D2FF',
    };
    return (isDark ? dark : light)[key] || theme.textSecondary;
  };
  const angleFor = (i: number) => (Math.PI * 2 * i) / count - Math.PI / 2;
  const toPoint = (radius: number, i: number) => {
    const a = angleFor(i);
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  };
  const gridPolys: string[] = [];
  for (let l = 1; l <= levels; l++) {
    const radius = (r * l) / levels;
    const pts = Array.from({ length: count }, (_, i) => toPoint(radius, i).join(',')).join(' ');
    gridPolys.push(pts);
  }
  const dataPts = Array.from({ length: count }, (_, i) => toPoint(r * Math.max(0, Math.min(1, values[i] || 0)), i).join(',')).join(' ');

  const labelRadius = r + 18;
  const labelPositions = labels.map((_, i) => toPoint(labelRadius, i));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {gridPolys.map((pts, idx) => (
            <G key={`g${idx}`}>
              <Polygon points={pts} fill="none" stroke={theme.border} strokeWidth={1} />
            </G>
          ))}
          {Array.from({ length: count }, (_, i) => (
            <G key={`axis${i}`}>
              <Line x1={cx} y1={cy} x2={toPoint(r, i)[0]} y2={toPoint(r, i)[1]} stroke={theme.border} strokeWidth={1} />
            </G>
          ))}
          <Polygon points={dataPts} fill={strokeColor} opacity={fillOpacity} stroke={strokeColor} strokeWidth={2} />
          <Circle cx={cx} cy={cy} r={2} fill={theme.textSecondary} />
          {labelPositions.map(([x, y], i) => (
            <G key={`lbl${i}`}>
              <SvgText x={x} y={y} fill={colorForLabel(labels[i])} fontSize={11} fontWeight="700" textAnchor="middle" alignmentBaseline="middle">
                {labels[i]}
              </SvgText>
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
}

function BodyPartPickerModal({
  visible,
  onClose,
  theme,
  selected,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  selected: BodyPart;
  onSelect: (bp: BodyPart) => void;
}) {
  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.modalBackdrop}>
        <RoundedView style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.cardHeader, { marginBottom: 12 }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Select Body Part</Text>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.iconBtn, { backgroundColor: pressed ? theme.dangerPressed : theme.danger }]}>
              <Text style={styles.iconText}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            data={BODY_PARTS}
            keyExtractor={(bp) => bp}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelect(item)} style={({ pressed }) => [styles.libraryItem, { borderColor: theme.border, backgroundColor: pressed || selected === item ? theme.input : theme.card }]}>
                <Text style={{ color: theme.text, fontWeight: '600' }}>{item}</Text>
                {selected === item && (
                  <View style={[styles.badge, { backgroundColor: theme.input, borderColor: theme.border }]}>
                    <Text style={[styles.badgeText, { color: theme.textSecondary }]}>Selected</Text>
                  </View>
                )}
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </RoundedView>
      </View>
    </Modal>
  );
}

function ExerciseLibraryModal({
  visible,
  onClose,
  theme,
  filter,
  setFilter,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  filter: BodyPart | 'All';
  setFilter: (bp: BodyPart | 'All') => void;
  onSelect: (item: { name: string; bodyPart: BodyPart }) => void;
}) {
  const list = useMemo(
    () => EXERCISE_LIBRARY.filter(e => (filter === 'All' ? true : e.bodyPart === filter)),
    [filter],
  );


  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.modalBackdrop}>
        <RoundedView style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.cardHeader, { marginBottom: 12 }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Exercise Library</Text>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.iconBtn, { backgroundColor: pressed ? theme.dangerPressed : theme.danger }]}>
              <Text style={styles.iconText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            <Pressable onPress={() => setFilter('All')} style={[styles.chip, { borderColor: theme.border, backgroundColor: filter === 'All' ? theme.accent : theme.card }]}>
              <Text style={{ color: filter === 'All' ? '#fff' : theme.textSecondary, fontWeight: '600' }}>All</Text>
            </Pressable>
            {BODY_PARTS.map(bp => (
              <Pressable key={bp} onPress={() => setFilter(bp)} style={[styles.chip, { borderColor: theme.border, backgroundColor: filter === bp ? theme.accent : theme.card }]}>
                <Text style={{ color: filter === bp ? '#fff' : theme.textSecondary, fontWeight: '600' }}>{bp}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <FlatList
            data={list}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            renderItem={({ item }) => (
              <Pressable onPress={() => onSelect(item)} style={({ pressed }) => [styles.libraryItem, { borderColor: theme.border, backgroundColor: pressed ? theme.input : theme.card }]}>
                <Text style={{ color: theme.text, fontWeight: '600' }}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: theme.input, borderColor: theme.border }]}>
                  <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{item.bodyPart}</Text>
                </View>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </RoundedView>
      </View>
    </Modal>
  );
}

function SwipeButton({ onSwipeSuccess, theme }: { onSwipeSuccess: () => void; theme: typeof lightTheme }) {
  const [swiped, setSwiped] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerWidthRef = useRef(0);
  const pan = useRef(new Animated.ValueXY()).current;
  const KNOB_SIZE = 48;
  const PADDING = 4;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const width = containerWidthRef.current;
        if (width === 0) return;
        const maxDrag = width - KNOB_SIZE - PADDING * 2;
        if (gestureState.dx > 0 && gestureState.dx <= maxDrag) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const width = containerWidthRef.current;
        if (width === 0) return;
        const maxDrag = width - KNOB_SIZE - PADDING * 2;
        const SWIPE_THRESHOLD = maxDrag * 0.7;

        if (gestureState.dx > SWIPE_THRESHOLD) {
          setSwiped(true);
          Animated.timing(pan, {
            toValue: { x: maxDrag, y: 0 },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            onSwipeSuccess();
            // Reset after success
            setTimeout(() => {
              setSwiped(false);
              pan.setValue({ x: 0, y: 0 });
            }, 500);
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={[styles.swipeButtonContainer, { backgroundColor: theme.input, borderColor: theme.border }]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        setContainerWidth(w);
        containerWidthRef.current = w;
      }}
    >
      {/* Background Text (Gray) */}
      <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.swipeText, { color: theme.textSecondary }]}>
          {swiped ? 'Confirmed!' : 'Swipe to Add'}
        </Text>
      </View>

      {/* Foreground Fill (Black with White Text) */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: Animated.add(pan.x, KNOB_SIZE + PADDING),
          backgroundColor: theme.accent,
          borderRadius: 28,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: containerWidth, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.swipeText, { color: theme.onAccent }]}>
            {swiped ? 'Confirmed!' : 'Swipe to Add'}
          </Text>
        </View>
      </Animated.View>

      {/* Knob */}
      <Animated.View
        style={[
          styles.swipeKnob,
          {
            backgroundColor: theme.accent,
            transform: [{ translateX: pan.x }],
            zIndex: 10,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.onAccent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Line x1="12" y1="5" x2="19" y2="12" />
          <Line x1="12" y1="19" x2="19" y2="12" />
        </Svg>
      </Animated.View>
    </View>
  );
}

function AddExerciseSheet({
  visible,
  onClose,
  theme,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  onAdd: (exercise: { name: string; bodyPart: BodyPart; sets: number; reps: number; weight: number; timestamp: number }) => void;
}) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('Chest');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');
  const [bodyPartPickerOpen, setBodyPartPickerOpen] = useState(false);
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Filter exercises based on selected body part
  const availableExercises = useMemo(() =>
    EXERCISE_LIBRARY.filter(e => e.bodyPart === selectedBodyPart),
    [selectedBodyPart]);

  // Reset exercise when body part changes
  useEffect(() => {
    if (availableExercises.length > 0) {
      setSelectedExercise(availableExercises[0].name);
    } else {
      setSelectedExercise('');
    }
  }, [selectedBodyPart, availableExercises]);

  const handleAdd = () => {
    if (!selectedExercise) return;
    const s = parseInt(sets, 10);
    const r = parseInt(reps, 10);
    const w = parseFloat(weight);
    if (isNaN(s) || isNaN(r) || isNaN(w)) return;

    onAdd({
      name: selectedExercise,
      bodyPart: selectedBodyPart,
      sets: s,
      reps: r,
      weight: w,
      timestamp: Date.now(),
    });
    onClose();
  };

  const handleNumericInput = (text: string, setter: (val: string) => void) => {
    const filtered = text.replace(/[^0-9.]/g, '');
    setter(filtered);
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose} transparent>
      <View style={styles.modalBackdrop}>
        <View style={[styles.bottomSheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Add Exercise</Text>
              <Text style={[styles.dateTimeText, { color: theme.muted }]}>{formatDateTime(currentTime)}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Line x1="18" y1="6" x2="6" y2="18" />
                <Line x1="6" y1="6" x2="18" y2="18" />
              </Svg>
            </Pressable>
          </View>

          <View style={styles.sheetContent}>
            {/* Body Part Dropdown */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Body Part</Text>
            <Pressable onPress={() => setBodyPartPickerOpen(true)} style={[styles.dropdown, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <Text style={{ color: theme.text }}>{selectedBodyPart}</Text>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Line x1="6" y1="9" x2="12" y2="15" />
                <Line x1="18" y1="9" x2="12" y2="15" />
              </Svg>
            </Pressable>

            {/* Exercise Dropdown */}
            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Exercise</Text>
            <Pressable onPress={() => setExercisePickerOpen(true)} style={[styles.dropdown, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <Text style={{ color: theme.text }}>{selectedExercise || 'Select Exercise'}</Text>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Line x1="6" y1="9" x2="12" y2="15" />
                <Line x1="18" y1="9" x2="12" y2="15" />
              </Svg>
            </Pressable>

            {/* Sets & Reps */}
            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Sets</Text>
                <TextInput
                  style={[{ backgroundColor: '#F2F2F7', borderColor: '#E5E5EA', color: '#000000' }, styles.inputBig]}
                  placeholderTextColor="#999999"
                  value={sets}
                  onChangeText={(t) => handleNumericInput(t, setSets)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Reps</Text>
                <TextInput
                  style={[{ backgroundColor: '#F2F2F7', borderColor: '#E5E5EA', color: '#000000' }, styles.inputBig]}
                  placeholderTextColor="#999999"
                  value={reps}
                  onChangeText={(t) => handleNumericInput(t, setReps)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Weight */}
            <View>
              <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>Weight (kg)</Text>
              <TextInput
                style={[{ backgroundColor: '#F2F2F7', borderColor: '#E5E5EA', color: '#000000', width: '100%' }, styles.inputBig]}
                placeholderTextColor="#999999"
                value={weight}
                onChangeText={(t) => handleNumericInput(t, setWeight)}
                keyboardType="numeric"
              />
            </View>

            {/* Swipe Button */}
            <View style={{ marginTop: 32, marginBottom: 16 }}>
              <SwipeButton onSwipeSuccess={handleAdd} theme={theme} />
            </View>
          </View>
        </View>
      </View>


      {/* Reusing existing BodyPartPickerModal */}
      <BodyPartPickerModal
        visible={bodyPartPickerOpen}
        onClose={() => setBodyPartPickerOpen(false)}
        theme={theme}
        selected={selectedBodyPart}
        onSelect={(bp) => {
          setSelectedBodyPart(bp);
          setBodyPartPickerOpen(false);
        }}
      />

      {/* Simple Exercise Picker Modal (Internal) */}
      <Modal animationType="fade" visible={exercisePickerOpen} onRequestClose={() => setExercisePickerOpen(false)} transparent>
        <View style={styles.modalBackdrop}>
          <RoundedView style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border, maxHeight: '60%' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Select Exercise</Text>
              <Pressable onPress={() => setExercisePickerOpen(false)} style={styles.iconBtn}>
                <Text style={styles.iconText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={availableExercises}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedExercise(item.name);
                    setExercisePickerOpen(false);
                  }}
                  style={[styles.libraryItem, { borderColor: theme.border, backgroundColor: selectedExercise === item.name ? theme.input : theme.card }]}
                >
                  <Text style={{ color: theme.text }}>{item.name}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </RoundedView>
        </View>
      </Modal>
    </Modal >
  );
}

function MuscleSkeleton({
  activeBodyParts,
  theme,
}: {
  activeBodyParts: BodyPart[];
  theme: typeof lightTheme;
}) {
  const isActive = (part: BodyPart) => activeBodyParts.includes(part) || activeBodyParts.includes('Full Body');
  const activeColor = theme.accent;
  const inactiveColor = theme.bg === '#000000' ? '#333333' : '#E5E5EA';

  // Helper to get color
  const getColor = (part: BodyPart) => isActive(part) ? activeColor : inactiveColor;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40, marginVertical: 24 }}>
      {/* Front View */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 10, marginBottom: 8, fontWeight: '600', letterSpacing: 1 }}>FRONT</Text>
        <Svg width={120} height={240} viewBox="0 0 200 400">
          <Path d="M100 20 Q115 20 115 35 Q115 50 100 55 Q85 50 85 35 Q85 20 100 20 Z" fill={inactiveColor} />
          <Path d="M88 52 Q75 65 60 70 L140 70 Q125 65 112 52 Z" fill={getColor('Shoulders')} />

          <Path d="M60 70 Q45 70 40 85 Q35 100 42 115 L60 95 Z" fill={getColor('Shoulders')} />
          <Path d="M140 70 Q155 70 160 85 Q165 100 158 115 L140 95 Z" fill={getColor('Shoulders')} />

          <Path d="M100 70 L60 70 Q55 100 80 105 Q95 105 100 95 Z" fill={getColor('Chest')} />
          <Path d="M100 70 L140 70 Q145 100 120 105 Q105 105 100 95 Z" fill={getColor('Chest')} />
          <Line x1="100" y1="70" x2="100" y2="95" stroke={theme.bg} strokeWidth="1" />

          <Path d="M42 115 Q38 130 45 140 L60 135 Q65 120 60 95 Z" fill={getColor('Arms')} />
          <Path d="M158 115 Q162 130 155 140 L140 135 Q135 120 140 95 Z" fill={getColor('Arms')} />

          <Path d="M45 140 Q35 160 38 180 L52 180 Q58 160 60 135 Z" fill={getColor('Arms')} />
          <Path d="M155 140 Q165 160 162 180 L148 180 Q142 160 140 135 Z" fill={getColor('Arms')} />

          <Path d="M80 105 L120 105 L115 155 L85 155 Z" fill={getColor('Core')} />
          <Line x1="80" y1="120" x2="120" y2="120" stroke={theme.bg} strokeWidth="1" opacity={0.3} />
          <Line x1="82" y1="135" x2="118" y2="135" stroke={theme.bg} strokeWidth="1" opacity={0.3} />
          <Line x1="100" y1="105" x2="100" y2="155" stroke={theme.bg} strokeWidth="1" opacity={0.3} />

          <Path d="M60 95 Q55 125 65 145 L85 155 L80 105 Z" fill={getColor('Core')} />
          <Path d="M140 95 Q145 125 135 145 L115 155 L120 105 Z" fill={getColor('Core')} />

          <Path d="M65 155 Q50 190 55 235 Q75 245 95 235 L98 160 Z" fill={getColor('Legs')} />
          <Path d="M135 155 Q150 190 145 235 Q125 245 105 235 L102 160 Z" fill={getColor('Legs')} />
          <Line x1="75" y1="180" x2="75" y2="220" stroke={theme.bg} strokeWidth="1" opacity={0.2} />
          <Line x1="125" y1="180" x2="125" y2="220" stroke={theme.bg} strokeWidth="1" opacity={0.2} />

          <Path d="M55 235 Q45 265 50 295 L85 295 Q90 265 95 235 Z" fill={getColor('Legs')} />
          <Path d="M145 235 Q155 265 150 295 L115 295 Q110 265 105 235 Z" fill={getColor('Legs')} />
        </Svg>
      </View>

      {/* Back View */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: theme.textSecondary, fontSize: 10, marginBottom: 8, fontWeight: '600', letterSpacing: 1 }}>BACK</Text>
        <Svg width={120} height={240} viewBox="0 0 200 400">
          <Path d="M100 20 Q115 20 115 35 Q115 50 100 55 Q85 50 85 35 Q85 20 100 20 Z" fill={inactiveColor} />

          <Path d="M88 52 L112 52 L100 110 Z" fill={getColor('Back')} />
          <Path d="M88 52 L60 70 L100 85 Z" fill={getColor('Back')} />
          <Path d="M112 52 L140 70 L100 85 Z" fill={getColor('Back')} />

          <Path d="M60 70 Q45 70 40 85 Q35 100 42 115 L60 95 Z" fill={getColor('Shoulders')} />
          <Path d="M140 70 Q155 70 160 85 Q165 100 158 115 L140 95 Z" fill={getColor('Shoulders')} />

          <Path d="M60 95 L100 145 L140 95 L130 130 L100 155 L70 130 Z" fill={getColor('Back')} />

          <Path d="M42 115 Q38 130 45 140 L60 135 Q65 120 60 95 Z" fill={getColor('Arms')} />
          <Path d="M158 115 Q162 130 155 140 L140 135 Q135 120 140 95 Z" fill={getColor('Arms')} />

          <Path d="M45 140 Q35 160 38 180 L52 180 Q58 160 60 135 Z" fill={getColor('Arms')} />
          <Path d="M155 140 Q165 160 162 180 L148 180 Q142 160 140 135 Z" fill={getColor('Arms')} />

          <Path d="M85 145 L115 145 L110 160 L90 160 Z" fill={getColor('Back')} />

          <Path d="M65 160 Q60 180 70 195 Q95 205 100 195 Q105 205 130 195 Q140 180 135 160 Z" fill={getColor('Glutes')} />
          <Line x1="100" y1="160" x2="100" y2="195" stroke={theme.bg} strokeWidth="1" />

          <Path d="M70 195 Q60 215 65 245 L90 245 Q95 215 95 195 Z" fill={getColor('Legs')} />
          <Path d="M130 195 Q140 215 135 245 L110 245 Q105 215 105 195 Z" fill={getColor('Legs')} />

          <Path d="M65 245 Q55 265 60 295 L85 295 Q90 265 90 245 Z" fill={getColor('Legs')} />
          <Path d="M135 245 Q145 265 140 295 L115 295 Q110 265 110 245 Z" fill={getColor('Legs')} />
        </Svg>
      </View>
    </View>
  );
}
function AppContent({ onLogout }: { onLogout: () => void }) {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const [activeTab, setActiveTab] = useState<'Logger' | 'Today' | 'Progress'>('Logger');
  const pagesRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const tabs: Array<'Logger' | 'Today' | 'Progress'> = ['Logger', 'Today', 'Progress'];
  const tabIndex = (t: 'Logger' | 'Today' | 'Progress') => tabs.indexOf(t);
  useEffect(() => {
    const idx = tabIndex(activeTab);
    if (pagesRef.current && idx >= 0) {
      pagesRef.current.scrollTo({ x: width * idx, animated: true });
    }
  }, [activeTab, width]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('Chest');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<BodyPart | 'All'>('All');
  const [bodyPartPickerOpen, setBodyPartPickerOpen] = useState(false);
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileScreenVisible, setProfileScreenVisible] = useState(false);
  const [settingsScreenVisible, setSettingsScreenVisible] = useState(false);
  const [accountSettingsVisible, setAccountSettingsVisible] = useState(false);
  const [editEmailVisible, setEditEmailVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [unitsVisible, setUnitsVisible] = useState(false);
  const [units, setUnits] = useState<{ weight: 'kg' | 'lbs'; height: 'cm' | 'in' }>({ weight: 'kg', height: 'cm' });
  const [languageVisible, setLanguageVisible] = useState(false);
  const [language, setLanguage] = useState('English');
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState(false);
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [rankVisible, setRankVisible] = useState(false);
  const [workoutLogVisible, setWorkoutLogVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    weight: '75 kg',
    height: '180 cm',
    age: '28',
    gender: 'Male',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const handleAddExercise = (data: { name: string; bodyPart: BodyPart; sets: number; reps: number; weight: number; timestamp: number }) => {
    const newSets: SetItem[] = Array.from({ length: data.sets }).map(() => ({
      id: `${data.timestamp}-${Math.random().toString(36).slice(2, 7)}`,
      reps: data.reps,
      weight: data.weight,
    }));

    const newExercise: Exercise = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name,
      bodyPart: data.bodyPart,
      sets: newSets,
      timestamp: data.timestamp,
    };
    setExercises(prev => [newExercise, ...prev]);
  };

  const { totalVolume, totalSets, totalReps } = useMemo(() => {
    let volume = 0;
    let sets = 0;
    let reps = 0;
    for (const e of exercises) {
      for (const s of e.sets) {
        volume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        sets += 1;
        reps += Number(s.reps) || 0;
      }
    }
    return { totalVolume: volume, totalSets: sets, totalReps: reps };
  }, [exercises]);

  const dateStr = useMemo(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString(undefined, { weekday: 'short' });
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${weekday} ${d}/${m}`;
  }, []);

  const weekly = useMemo(() => {
    const now = new Date();
    const startOfDay = (d: Date) => {
      const dd = new Date(d);
      dd.setHours(0, 0, 0, 0);
      return dd.getTime();
    };
    // Build current calendar week Sun..Sat
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);
    const days: { label: string; start: number; end: number; volume: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const start = startOfDay(day);
      const end = start + 24 * 60 * 60 * 1000 - 1;
      const label = day.toLocaleDateString(undefined, { weekday: 'short' });
      days.push({ label, start, end, volume: 0 });
    }
    // Aggregate using set id timestamp prefix
    for (const e of exercises) {
      for (const s of e.sets) {
        const ts = Number(String(s.id).split('-')[0]);
        const vol = (Number(s.weight) || 0) * (Number(s.reps) || 0);
        if (!Number.isFinite(ts)) continue;
        const idx = days.findIndex(d => ts >= d.start && ts <= d.end);
        if (idx >= 0) days[idx].volume += vol;
      }
    }
    const step = 500;
    const rawMax = Math.max(1, ...days.map(d => d.volume));
    const minTop = step * 6; // at least show 0..3000
    const max = Math.max(minTop, Math.ceil(rawMax / step) * step);
    const ticks: number[] = [];
    for (let v = 0; v <= max; v += step) ticks.push(v);
    const rangeStart = days[0]?.start ?? 0;
    const rangeEnd = days[6]?.end ?? 0;
    return { days, max, ticks, step, rangeStart, rangeEnd };
  }, [exercises]);

  const muscleBreakdown = useMemo(() => {
    const counts = new Map<BodyPart, number>();
    let total = 0;
    for (const e of exercises) {
      for (const s of e.sets) {
        const ts = Number(String(s.id).split('-')[0]);
        if (!Number.isFinite(ts)) continue;
        if (ts >= weekly.rangeStart && ts <= weekly.rangeEnd) {
          counts.set(e.bodyPart as BodyPart, (counts.get(e.bodyPart as BodyPart) || 0) + 1);
          total += 1;
        }
      }
    }
    const entries = Array.from(counts.entries())
      .map(([bp, c]) => ({ bp, c, pct: total ? Math.round((c / total) * 100) : 0 }))
      .sort((a, b) => b.c - a.c);
    const text = entries.length
      ? entries.map(x => `${x.bp} ${x.pct}%`).join(', ')
      : 'No sets this week';
    // Build fixed order dataset for radar (Chest, Back, Legs, Shoulders, Arms, Abs)
    const order: BodyPart[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
    const countsBy = order.map(bp => counts.get(bp) || 0);
    const maxCount = Math.max(1, ...countsBy);
    const values = countsBy.map(c => (maxCount ? c / maxCount : 0));
    return { entries, text, values, order };
  }, [exercises, weekly.rangeStart, weekly.rangeEnd]);

  const weeklyProgress = useMemo(() => {
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const curStart = weekly.rangeStart;
    const curEnd = weekly.rangeEnd;
    const prevStart = curStart - weekMs;
    const prevEnd = curStart - 1;
    let curVol = 0;
    let prevVol = 0;
    for (const e of exercises) {
      for (const s of e.sets) {
        const ts = Number(String(s.id).split('-')[0]);
        const vol = (Number(s.weight) || 0) * (Number(s.reps) || 0);
        if (!Number.isFinite(ts)) continue;
        if (ts >= curStart && ts <= curEnd) curVol += vol;
        else if (ts >= prevStart && ts <= prevEnd) prevVol += vol;
      }
    }
    const change = prevVol === 0 ? (curVol > 0 ? 100 : 0) : ((curVol - prevVol) / prevVol) * 100;
    const rounded = Math.round(change);
    const sign = rounded >= 0 ? '+' : '';
    let note = 'stable week';
    if (rounded >= 10) note = 'good progressive overload!';
    else if (rounded <= -10) note = 'consider deload or consistency';
    return { curVol, prevVol, rounded };
  }, [exercises, weekly.rangeStart, weekly.rangeEnd]);

  const addExercise = () => {
    const name = exerciseName.trim();
    if (!name) return;
    const newExercise: Exercise = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      bodyPart: selectedBodyPart,
      sets: [],
      timestamp: Date.now(),
    };
    setExercises(prev => [newExercise, ...prev]);
    setExerciseName('');
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const addSet = (exerciseId: string, reps: number, weight: number) => {
    if (!Number.isFinite(reps) || reps <= 0) return;
    if (!Number.isFinite(weight) || weight < 0) return;
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? {
            ...e,
            sets: [
              { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, reps, weight },
              ...e.sets,
            ],
          }
          : e,
      ),
    );
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e,
      ),
    );
  };

  const renderLogger = () => (
    <>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.profileButton}
          onPress={() => setProfileMenuVisible(true)}
        >
          <View style={[styles.profileIconContainer, { backgroundColor: theme.input }]}>
            <UserIcon color={theme.textSecondary} />
          </View>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Logger</Text>
        <Text style={[styles.dateText, { color: theme.text }]}>{dateStr}</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.muted }]}>Track your workouts, one exercise at a time.</Text>

      <View style={styles.loggerCenteredContent}>
        <Pressable
          onPress={() => setAddExerciseModalVisible(true)}
          style={({ pressed }) => [
            styles.addExerciseCardLarge,
            { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.95 : 1 }
          ]}
        >
          <View style={[styles.plusIconLarge, { backgroundColor: theme.accent }]}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={theme.onAccent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Line x1="12" y1="5" x2="12" y2="19" />
              <Line x1="5" y1="12" x2="19" y2="12" />
            </Svg>
          </View>
          <Text style={[styles.addExerciseTextLarge, { color: theme.text }]}>Add Exercise</Text>
          <Text style={[styles.addExerciseHint, { color: theme.muted }]}>Log your workout here</Text>
        </Pressable>
      </View>

      <AddExerciseSheet
        visible={addExerciseModalVisible}
        onClose={() => setAddExerciseModalVisible(false)}
        theme={theme}
        onAdd={handleAddExercise}
      />
    </>
  );

  const renderToday = () => {
    // Filter today's exercises
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

    const todayExercises = exercises.filter(e => e.timestamp >= startOfToday && e.timestamp <= endOfToday);

    // Calculate today's stats
    const todayStats = todayExercises.reduce((acc, e) => {
      const setsCount = e.sets.length;
      const volume = e.sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
      return {
        exercises: acc.exercises + 1,
        sets: acc.sets + setsCount,
        volume: acc.volume + volume,
      };
    }, { exercises: 0, sets: 0, volume: 0 });

    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    return (
      <>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.profileButton}
            onPress={() => setProfileMenuVisible(true)}
          >
            <View style={[styles.profileIconContainer, { backgroundColor: theme.input }]}>
              <UserIcon color={theme.textSecondary} />
            </View>
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>Today</Text>
          <Text style={[styles.dateText, { color: theme.text }]}>{dateStr}</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Your workout summary for today.</Text>

        {/* Muscle Skeleton */}
        {todayExercises.length > 0 && (
          <MuscleSkeleton
            activeBodyParts={Array.from(new Set(todayExercises.map(e => e.bodyPart)))}
            theme={theme}
          />
        )}

        {/* Stats Summary */}
        {todayExercises.length > 0 && (
          <View style={[styles.todayStatsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.todayStatItem}>
              <Text style={[styles.todayStatValue, { color: theme.accent }]}>{todayStats.exercises}</Text>
              <Text style={[styles.todayStatLabel, { color: theme.textSecondary }]}>Exercises</Text>
            </View>
            <View style={[styles.todayStatDivider, { backgroundColor: theme.border }]} />
            <View style={styles.todayStatItem}>
              <Text style={[styles.todayStatValue, { color: theme.accent }]}>{todayStats.sets}</Text>
              <Text style={[styles.todayStatLabel, { color: theme.textSecondary }]}>Sets</Text>
            </View>
            <View style={[styles.todayStatDivider, { backgroundColor: theme.border }]} />
            <View style={styles.todayStatItem}>
              <Text style={[styles.todayStatValue, { color: theme.accent }]}>{todayStats.volume}</Text>
              <Text style={[styles.todayStatLabel, { color: theme.textSecondary }]}>Volume (kg)</Text>
            </View>
          </View>
        )}

        {/* Exercise List */}
        {todayExercises.length === 0 ? (
          <View style={[styles.todayEmptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.todayEmptyIcon, { backgroundColor: theme.input }]}>
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M6.5 6.5l11 11" />
                <Path d="M21 21l-1-1" />
                <Path d="M3 3l1 1" />
                <Path d="M18 22l4-4" />
                <Path d="M2 6l4-4" />
                <Path d="M3 10l7-7" />
                <Path d="M14 21l7-7" />
              </Svg>
            </View>
            <Text style={[styles.todayEmptyTitle, { color: theme.text }]}>No workouts logged today</Text>
            <Text style={[styles.todayEmptySubtitle, { color: theme.muted }]}>Head to Logger to add your first exercise</Text>
          </View>
        ) : (
          <FlatList
            data={todayExercises}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <RoundedView style={[styles.todayExerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.todayExerciseHeader}>
                  <View style={styles.row}>
                    <Text style={[styles.todayExerciseName, { color: theme.text }]}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: theme.input, borderColor: theme.border }]}>
                      <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{item.bodyPart}</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => deleteExercise(item.id)}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M3 6h18" />
                      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </Svg>
                  </Pressable>
                </View>
                <Text style={[styles.todayExerciseTime, { color: theme.muted }]}>Added at {formatTime(item.timestamp)}</Text>

                {/* Sets Display */}
                <View style={styles.todaySetsContainer}>
                  {item.sets.map(s => (
                    <View key={s.id} style={[styles.todaySetRow, { backgroundColor: theme.input }]}>
                      <View style={styles.row}>
                        <DumbbellIcon color={theme.textSecondary} />
                        <Text style={[styles.todaySetText, { color: theme.text }]}>{s.reps} reps</Text>
                      </View>
                      <View style={styles.row}>
                        <WeightIcon color={theme.textSecondary} />
                        <Text style={[styles.todaySetText, { color: theme.text }]}>{s.weight} kg</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </RoundedView>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </>
    );
  };

  const renderProgress = () => (
    <>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.profileButton}
          onPress={() => setProfileMenuVisible(true)}
        >
          <View style={[styles.profileIconContainer, { backgroundColor: theme.input }]}>
            <UserIcon color={theme.textSecondary} />
          </View>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Progress</Text>
        <Text style={[styles.dateText, { color: theme.text }]}>{dateStr}</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.muted }]}>Your recent volume and sessions will appear here.</Text>

      <RoundedView style={[styles.card, styles.shadowSoft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ alignItems: 'center' }}>
          <RadarChart
            theme={theme}
            size={240}
            levels={4}
            labels={['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs']}
            values={muscleBreakdown.values}
          />
        </View>
      </RoundedView>

      <RoundedView style={[styles.card, styles.shadowSoft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.statsRow}>
          <View>
            <Text style={[styles.statsLabel, { color: theme.text }]}>Total Volume</Text>
            <Text style={[styles.statsSub, { color: theme.muted }]}>Weight × Reps × Sets</Text>
          </View>
          <Text style={[styles.statsValue, { color: theme.text }]}>
            Today: <Text style={styles.emph}>{Intl.NumberFormat().format(totalVolume)} kg</Text> lifted
          </Text>
        </View>
        <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
          <View>
            <Text style={[styles.statsLabel, { color: theme.text }]}>Total Sets & Reps</Text>
            <Text style={[styles.statsSub, { color: theme.muted }]}>Session workload</Text>
          </View>
          <Text style={[styles.statsValue, { color: theme.text }]}>
            You did <Text style={styles.emph}>{totalSets} sets</Text> today
          </Text>
        </View>
      </RoundedView>

      <RoundedView style={[styles.card, styles.shadowSoft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.statsRow}>
          <View>
            <Text style={[styles.statsLabel, { color: theme.text }]}>Weekly Volume Progress</Text>
            <Text style={[styles.statsSub, { color: theme.muted }]}>Whether training is increasing</Text>
          </View>
          {(() => {
            const pct = weeklyProgress.rounded;
            const sign = pct >= 0 ? '+' : '';
            const green = (theme.bg === '#000000') ? '#30D158' : '#34C759';
            const red = (theme.bg === '#000000') ? '#FF453A' : '#FF3B30';
            const color = pct > 0 ? green : pct < 0 ? red : theme.muted;
            return (
              <Text style={[styles.statsValue, { color, fontSize: 18, fontWeight: '800' }]}>
                {`${sign}${pct}%`}
              </Text>
            );
          })()}
        </View>
      </RoundedView>

      <RoundedView style={[styles.card, styles.shadowSoft, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.cardHeader, { marginBottom: 0 }]}>
          <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Weekly Volume</Text>
        </View>
        <View style={styles.chartWithAxis}>
          <View style={styles.yAxis}>
            {[...weekly.ticks].reverse().map((v) => (
              <View key={v} style={[styles.yTickRow, { borderColor: theme.border }]}>
                <Text style={[styles.yTickLabel, { color: theme.muted }]}>{v}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartArea}>
            <View style={styles.chartContainer}>
              {weekly.days.map((d, i) => {
                const h = Math.max(4, Math.round((d.volume / weekly.max) * CHART_H));
                return (
                  <View key={i} style={styles.chartBar}>
                    <View style={[styles.chartBarTrack, { backgroundColor: theme.input, borderColor: theme.border }]}>
                      <View style={[styles.chartBarFill, { height: h, backgroundColor: theme.accent }]} />
                    </View>
                    <Text style={[styles.chartBarLabel, { color: theme.muted }]}>{d.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </RoundedView>


    </>
  );

  const renderWorkoutLog = () => {
    // Calendar helper functions
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const formatMonthYear = (date: Date) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const isSameDay = (date1: Date, date2: Date) => {
      return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
    };

    const hasWorkoutsOnDate = (date: Date) => {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
      return exercises.some(e => e.timestamp >= startOfDay && e.timestamp <= endOfDay);
    };

    const getWorkoutsForDate = (date: Date) => {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
      return exercises.filter(e => e.timestamp >= startOfDay && e.timestamp <= endOfDay);
    };

    // Build calendar grid
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    const selectedWorkouts = getWorkoutsForDate(selectedDate);
    const workoutStats = selectedWorkouts.reduce((acc, e) => ({
      exercises: acc.exercises + 1,
      duration: acc.duration + (e.sets.length * 2), // Estimate 2 mins per set
    }), { exercises: 0, duration: 0 });

    const navigateMonth = (direction: number) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };

    return (
      <Modal visible={workoutLogVisible} animationType="slide" onRequestClose={() => setWorkoutLogVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
          <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Header */}
              <View style={styles.workoutLogHeader}>
                <Pressable onPress={() => setWorkoutLogVisible(false)} style={styles.workoutLogBackButton}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M19 12H5M12 19l-7-7 7-7" />
                  </Svg>
                </Pressable>
                <Text style={[styles.workoutLogTitle, { color: theme.text }]}>Workout Log</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* Month Navigation */}
              <View style={styles.monthNavigation}>
                <Pressable onPress={() => navigateMonth(-1)} style={styles.monthNavButton}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M15 18l-6-6 6-6" />
                  </Svg>
                </Pressable>
                <Text style={[styles.monthText, { color: theme.text }]}>{formatMonthYear(currentMonth)}</Text>
                <Pressable onPress={() => navigateMonth(1)} style={styles.monthNavButton}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M9 18l6-6-6-6" />
                  </Svg>
                </Pressable>
              </View>

              {/* Calendar Grid */}
              <View style={[styles.calendarContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {/* Day Headers */}
                <View style={styles.calendarHeader}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <Text key={i} style={[styles.calendarDayHeader, { color: theme.textSecondary }]}>{day}</Text>
                  ))}
                </View>

                {/* Calendar Days */}
                <View style={styles.calendarGrid}>
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <View key={`empty-${index}`} style={styles.calendarDayCell} />;
                    }

                    const cellDate = new Date(year, month, day);
                    const isToday = isSameDay(cellDate, today);
                    const isSelected = isSameDay(cellDate, selectedDate);
                    const hasWorkouts = hasWorkoutsOnDate(cellDate);

                    return (
                      <Pressable
                        key={day}
                        style={styles.calendarDayCell}
                        onPress={() => setSelectedDate(cellDate)}
                      >
                        <View style={[
                          styles.calendarDay,
                          isSelected && styles.calendarDaySelected,
                          isSelected && { backgroundColor: theme.text },
                          isToday && !isSelected && styles.calendarDayToday,
                          isToday && !isSelected && { borderColor: theme.text },
                        ]}>
                          <Text style={[
                            styles.calendarDayText,
                            { color: isSelected ? theme.bg : theme.text },
                          ]}>{day}</Text>
                        </View>
                        {hasWorkouts && !isSelected && (
                          <View style={[styles.workoutIndicator, { backgroundColor: theme.accent }]} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Workouts for Selected Date */}
              <Text style={[styles.workoutDateTitle, { color: theme.text }]}>
                Workouts for {formatMonthYear(selectedDate)} {selectedDate.getDate()}
              </Text>

              {selectedWorkouts.length === 0 ? (
                <View style={[styles.noWorkoutsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.noWorkoutsText, { color: theme.muted }]}>No workouts logged on this day</Text>
                </View>
              ) : (
                selectedWorkouts.map(exercise => {
                  const isExpanded = expandedExerciseId === exercise.id;
                  return (
                    <Pressable
                      key={exercise.id}
                      onPress={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                    >
                      <RoundedView style={[styles.workoutLogCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.workoutLogCardHeader}>
                          <View style={styles.workoutLogCardIcon}>
                            <DumbbellIcon color={theme.text} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.workoutLogCardTitle, { color: theme.text }]}>{exercise.name}</Text>
                            <Text style={[styles.workoutLogCardSubtitle, { color: theme.textSecondary }]}>
                              {exercise.sets.length} Sets • {exercise.bodyPart}
                            </Text>
                          </View>
                          <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}>
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <Path d="M9 18l6-6-6-6" />
                            </Svg>
                          </View>
                        </View>
                        {isExpanded && (
                          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                            {exercise.sets.map((set, index) => (
                              <View key={set.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ color: theme.text, fontWeight: '600' }}>Set {index + 1}</Text>
                                <Text style={{ color: theme.textSecondary }}>{set.reps} reps × {set.weight} kg</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </RoundedView>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal >
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Animated.ScrollView
        ref={pagesRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width));
          const next = tabs[Math.min(tabs.length - 1, Math.max(0, page))];
          if (next && next !== activeTab) setActiveTab(next);
        }}
      >
        <Animated.View style={{ width, opacity: scrollX.interpolate({ inputRange: [-width, 0, width], outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' }), transform: [{ scale: scrollX.interpolate({ inputRange: [-width, 0, width], outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' }) }] }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {renderLogger()}
          </ScrollView>
        </Animated.View>
        <Animated.View style={{ width, opacity: scrollX.interpolate({ inputRange: [0, width, 2 * width], outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' }), transform: [{ scale: scrollX.interpolate({ inputRange: [0, width, 2 * width], outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' }) }] }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {renderToday()}
          </ScrollView>
        </Animated.View>
        <Animated.View style={{ width, opacity: scrollX.interpolate({ inputRange: [width, 2 * width, 3 * width], outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' }), transform: [{ scale: scrollX.interpolate({ inputRange: [width, 2 * width, 3 * width], outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' }) }] }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {renderProgress()}
          </ScrollView>
        </Animated.View>
      </Animated.ScrollView>

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.card }}>
        <View style={[styles.tabBar, { borderColor: theme.border, backgroundColor: theme.card }]}>
          {(['Logger', 'Today', 'Progress'] as const).map(tab => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={({ pressed }) => [styles.tabBtn, activeTab === tab && styles.tabBtnActive, { opacity: pressed ? 0.9 : 1, backgroundColor: activeTab === tab ? theme.accent : 'transparent', borderColor: theme.border }]}>
              <Text style={[styles.tabText, { color: activeTab === tab ? theme.onAccent : theme.textSecondary }]}>{tab}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>

      <ProfileMenuDrawer
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        theme={theme}
        onNavigateToLog={() => setWorkoutLogVisible(true)}
        onNavigateToProfile={() => setProfileScreenVisible(true)}
        onNavigateToSettings={() => setSettingsScreenVisible(true)}
        onNavigateToRank={() => setRankVisible(true)}
        profile={userProfile}
        onLogout={onLogout}
      />

      {renderWorkoutLog()}

      <ProfileScreen
        visible={profileScreenVisible}
        onClose={() => setProfileScreenVisible(false)}
        theme={theme}
        profile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      <SettingsScreen
        visible={settingsScreenVisible}
        onClose={() => setSettingsScreenVisible(false)}
        theme={theme}
        onNavigateToAccountSettings={() => setAccountSettingsVisible(true)}
        onNavigateToNotifications={() => setNotificationsVisible(true)}
        onNavigateToPrivacyPolicy={() => setPrivacyPolicyVisible(true)}
        onNavigateToTermsOfService={() => setTermsOfServiceVisible(true)}
        onNavigateToHelpSupport={() => setHelpSupportVisible(true)}
      />

      <AccountSettingsScreen
        visible={accountSettingsVisible}
        onClose={() => setAccountSettingsVisible(false)}
        theme={theme}
        onNavigateToEditEmail={() => setEditEmailVisible(true)}
        onNavigateToChangePassword={() => setChangePasswordVisible(true)}
        onNavigateToUnits={() => setUnitsVisible(true)}
        onNavigateToLanguage={() => setLanguageVisible(true)}
        onNavigateToSubscription={() => setSubscriptionVisible(true)}
        onNavigateToDeleteAccount={() => setDeleteAccountVisible(true)}
        units={units}
        language={language}
      />

      <EditEmailScreen
        visible={editEmailVisible}
        onClose={() => setEditEmailVisible(false)}
        theme={theme}
        currentEmail="user@gymtrack.app"
      />

      <ChangePasswordScreen
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        theme={theme}
      />

      <UnitsScreen
        visible={unitsVisible}
        onClose={() => setUnitsVisible(false)}
        theme={theme}
        units={units}
        setUnits={setUnits}
      />

      <LanguageScreen
        visible={languageVisible}
        onClose={() => setLanguageVisible(false)}
        theme={theme}
        language={language}
        setLanguage={setLanguage}
      />

      <SubscriptionScreen
        visible={subscriptionVisible}
        onClose={() => setSubscriptionVisible(false)}
        theme={theme}
      />

      <DeleteAccountScreen
        visible={deleteAccountVisible}
        onClose={() => setDeleteAccountVisible(false)}
        theme={theme}
      />

      <NotificationSettingsScreen
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        theme={theme}
      />

      <PrivacyPolicyScreen
        visible={privacyPolicyVisible}
        onClose={() => setPrivacyPolicyVisible(false)}
        theme={theme}
      />

      <TermsOfServiceScreen
        visible={termsOfServiceVisible}
        onClose={() => setTermsOfServiceVisible(false)}
        theme={theme}
      />

      <HelpSupportScreen
        visible={helpSupportVisible}
        onClose={() => setHelpSupportVisible(false)}
        theme={theme}
      />

      <GlobalRankScreen
        visible={rankVisible}
        onClose={() => setRankVisible(false)}
        theme={theme}
      />
    </View>
  );
}

function DumbbellIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6.5 6.5l11 11" />
      <Path d="M21 21l-1-1" />
      <Path d="M3 3l1 1" />
      <Path d="M18 22l4-4" />
      <Path d="M2 6l4-4" />
      <Path d="M3 10l7-7" />
      <Path d="M14 21l7-7" />
    </Svg>
  );
}

function WeightIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v18" />
      <Path d="M6 21h12" />
      <Path d="M6 3h12" />
      <Path d="M3 7h18" />
      <Path d="M3 17h18" />
    </Svg>
  );
}

function ExerciseCard({
  exercise,
  theme,
  onDelete,
  onAddSet,
  onDeleteSet,
}: {
  exercise: Exercise;
  theme: typeof lightTheme;
  onDelete: () => void;
  onAddSet: (reps: number, weight: number) => void;
  onDeleteSet: (setId: string) => void;
}) {
  const [repsText, setRepsText] = useState('');
  const [weightText, setWeightText] = useState('');

  const submitSet = () => {
    const reps = Number(repsText);
    const weight = Number(weightText);
    if (!Number.isFinite(reps) || reps <= 0) return;
    if (!Number.isFinite(weight) || weight < 0) return;
    onAddSet(reps, weight);
    setRepsText('');
    setWeightText('');
  };

  return (
    <RoundedView style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, padding: 20 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.row}>
          <Text style={[styles.cardTitle, { color: theme.text, fontSize: 22 }]}>{exercise.name}</Text>
          <View style={[styles.badge, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{exercise.bodyPart}</Text>
          </View>
        </View>
        <Pressable onPress={onDelete} style={({ pressed }) => [styles.iconBtn, { backgroundColor: pressed ? theme.dangerPressed : theme.danger }]}>
          <Text style={styles.iconText}>Delete</Text>
        </Pressable>
      </View>

      <View style={{ gap: 16, marginBottom: 24 }}>
        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 8, fontSize: 13 }]}>Reps</Text>
            <TextInput
              placeholder=""
              placeholderTextColor={theme.muted}
              keyboardType="number-pad"
              value={repsText}
              onChangeText={setRepsText}
              style={[styles.inputBig, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border, borderRadius: 12 }]}
              returnKeyType="next"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 8, fontSize: 13 }]}>Weight</Text>
            <TextInput
              placeholder=""
              placeholderTextColor={theme.muted}
              keyboardType="decimal-pad"
              value={weightText}
              onChangeText={setWeightText}
              style={[styles.inputBig, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border, borderRadius: 12 }]}
              returnKeyType="done"
              onSubmitEditing={submitSet}
            />
          </View>
        </View>

        <Pressable onPress={submitSet} style={({ pressed }) => [styles.button, styles.buttonFull, { backgroundColor: pressed ? theme.accentPressed : theme.accent, borderRadius: 8, paddingVertical: 16 }]}>
          <Text style={[styles.buttonText, { color: theme.onAccent, fontSize: 16, fontWeight: '700' }]}>Add Set</Text>
        </Pressable>
      </View>

      {exercise.sets.length > 0 && (
        <View style={styles.setsContainer}>
          {exercise.sets.map(s => (
            <RoundedView key={s.id} style={[styles.setRow, { borderColor: 'transparent', backgroundColor: theme.input, paddingVertical: 12, paddingHorizontal: 16 }]}>
              <View style={styles.row}>
                <DumbbellIcon color={theme.textSecondary} />
                <Text style={[styles.setText, { color: theme.text, fontSize: 16, fontWeight: '600' }]}>{s.reps} reps</Text>
              </View>
              <View style={styles.row}>
                <WeightIcon color={theme.textSecondary} />
                <Text style={[styles.setText, { color: theme.text, fontSize: 16, fontWeight: '600' }]}>{s.weight} kg</Text>
              </View>
              <Pressable onPress={() => onDeleteSet(s.id)}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.danger} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M3 6h18" />
                  <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </Svg>
              </Pressable>
            </RoundedView>
          ))}
        </View>
      )}
    </RoundedView>
  );
}

function UserIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function FlameIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

function TrophyIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M6 9V4h12v5M6 9h12M8 20h8m-4-4v4" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </Svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

function ChevronRightIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

function LogoutIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="M16 17l5-5-5-5" />
      <Path d="M21 12H9" />
    </Svg>
  );
}

function ProfileScreen({
  visible,
  onClose,
  theme,
  profile,
  onUpdateProfile,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfile>(profile);

  // Reset edit data when opening/closing or when profile changes
  useEffect(() => {
    setEditData(profile);
    setIsEditing(false);
  }, [visible, profile]);

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>Profile</Text>
            <Pressable onPress={isEditing ? handleSave : () => setIsEditing(true)}>
              <Text style={{ color: '#0A84FF', fontWeight: '600', fontSize: 16 }}>
                {isEditing ? 'Done' : 'Edit'}
              </Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
            {/* Avatar */}
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#E1D3C1', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
              <Svg width={120} height={120} viewBox="0 0 120 120">
                <Circle cx="60" cy="60" r="60" fill="#E1D3C1" />
                <Circle cx="60" cy="50" r="20" fill="#5A4033" opacity={0.8} />
                <Path d="M30 110 Q60 110 90 110 Q90 90 60 90 Q30 90 30 110" fill="#5A4033" opacity={0.8} />
              </Svg>
            </View>

            {isEditing ? (
              <TextInput
                style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 32, borderBottomWidth: 1, borderColor: '#0A84FF', minWidth: 200, textAlign: 'center' }}
                value={editData.name}
                onChangeText={(t) => handleChange('name', t)}
              />
            ) : (
              <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 32 }}>{profile.name}</Text>
            )}

            {/* Stats List */}
            <View style={{ width: '100%', gap: 0 }}>
              <View style={[styles.profileRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.profileLabel, { color: theme.textSecondary }]}>Weight</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.editInput, { color: theme.text }]}
                    value={editData.weight}
                    onChangeText={(t) => handleChange('weight', t)}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={[styles.profileValue, { color: theme.text }]}>{profile.weight}</Text>
                )}
              </View>
              <View style={[styles.profileRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.profileLabel, { color: theme.textSecondary }]}>Height</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.editInput, { color: theme.text }]}
                    value={editData.height}
                    onChangeText={(t) => handleChange('height', t)}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={[styles.profileValue, { color: theme.text }]}>{profile.height}</Text>
                )}
              </View>
              <View style={[styles.profileRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.profileLabel, { color: theme.textSecondary }]}>Age</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.editInput, { color: theme.text }]}
                    value={editData.age}
                    onChangeText={(t) => handleChange('age', t)}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={[styles.profileValue, { color: theme.text }]}>{profile.age}</Text>
                )}
              </View>
              <View style={[styles.profileRow, { borderBottomColor: 'transparent' }]}>
                <Text style={[styles.profileLabel, { color: theme.textSecondary }]}>Gender</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.editInput, { color: theme.text }]}
                    value={editData.gender}
                    onChangeText={(t) => handleChange('gender', t)}
                  />
                ) : (
                  <Text style={[styles.profileValue, { color: theme.text }]}>{profile.gender}</Text>
                )}
              </View>
            </View>

            {/* Actions */}
            {!isEditing && (
              <View style={{ width: '100%', marginTop: 40, gap: 16 }}>
              </View>
            )}

          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Path d="M14 2v6h6" />
      <Path d="M16 13H8" />
      <Path d="M16 17H8" />
      <Path d="M10 9H8" />
    </Svg>
  );
}

function InfoIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  );
}

function HelpIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Path d="M12 17h.01" />
    </Svg>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  );
}

function PencilIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </Svg>
  );
}

function RefreshIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M23 4v6h-6" />
      <Path d="M1 20v-6h6" />
      <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Svg>
  );
}

function BagIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <Path d="M3 6h18" />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M2 12h20" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

function BadgeIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74z" />
    </Svg>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function CreditCardIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <Path d="M1 10h22" />
    </Svg>
  );
}

function EnvelopeIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Path d="M22 6l-10 7L2 6" />
    </Svg>
  );
}

function EditEmailScreen({
  visible,
  onClose,
  theme,
  currentEmail,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  currentEmail: string;
}) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 32 }}>Edit Email</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Current Email */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>Current Email</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <EnvelopeIcon color={theme.textSecondary} />
                <TextInput
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.textSecondary }}
                  value={currentEmail}
                  editable={false}
                />
              </View>
            </View>

            {/* New Email */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>New Email</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <EnvelopeIcon color={theme.textSecondary} />
                <TextInput
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.text }}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Enter your new email"
                  placeholderTextColor={theme.muted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Confirm with Password */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>Confirm with Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <LockIcon color={theme.textSecondary} />
                <TextInput
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, color: theme.text }}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Save Changes Button */}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: theme.text, // Black background (assuming text is black in light mode)
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={onClose} // Just close for now
            >
              <Text style={{ color: theme.bg, fontSize: 16, fontWeight: '600' }}>Save Changes</Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function ChangePasswordScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 32 }}>Change Password</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Current Password */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>Current Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: theme.text }}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter your current password"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                />
              </View>
            </View>

            {/* New Password */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>New Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: theme.text }}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter your new password"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>Confirm New Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: theme.border }}>
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: theme.text }}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your new password"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Change Password Button */}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: theme.text, // Black background
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={onClose} // Just close for now
            >
              <Text style={{ color: theme.bg, fontSize: 16, fontWeight: '600' }}>Change Password</Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path d="M17 9l-6 6-4-4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CircleOutlineIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function CheckmarkIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

function DeleteAccountScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleDeletePress = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    // Here you would validate the password and delete the account
    setShowConfirmDialog(false);
    setConfirmPassword('');
    onClose();
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setConfirmPassword('');
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 24 }}>Delete Account</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Warning Card */}
            <View style={{ backgroundColor: '#fee2e2', borderRadius: 16, padding: 24, marginBottom: 24, alignItems: 'center' }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fecaca', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M18 6L6 18" />
                  <Path d="M6 6l12 12" />
                </Svg>
              </View>
            </View>

            {/* Warning Text */}
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 8 }}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 20 }}>
              This action is irreversible. Please review the consequences below before proceeding.
            </Text>

            {/* Consequences */}
            <View style={{ gap: 16, marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{ width: 24, height: 24, marginTop: 2 }}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <Path d="M16 17l5-5-5-5" />
                    <Path d="M21 12H9" />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>You will be logged out</Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>
                    You will be immediately logged out of your account on all devices.
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{ width: 24, height: 24, marginTop: 2 }}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M3 6h18" />
                    <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>All your data will be lost</Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>
                    All your workout logs, progress photos, and personal records will be permanently deleted.
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer Text */}
            <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 18 }}>
              By clicking the button below, you acknowledge that you understand and agree to these terms.
            </Text>

            {/* Delete Button */}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: '#dc2626',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                opacity: pressed ? 0.8 : 1,
              })}
              onPress={handleDeletePress}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <Path d="M12 9v4" />
                <Path d="M12 17h.01" />
              </Svg>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Delete My Account Permanently</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Confirmation Dialog */}
        <Modal visible={showConfirmDialog} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 8 }}>Confirm Account Deletion</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 24, lineHeight: 20 }}>
                Please enter your password to confirm that you want to permanently delete your account.
              </Text>

              {/* Password Input */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8 }}>Password</Text>
                <TextInput
                  style={{
                    backgroundColor: theme.input,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    color: theme.text,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoFocus
                />
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? theme.input : theme.card,
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: theme.border,
                  })}
                  onPress={handleCancelDelete}
                >
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: '#dc2626',
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                    opacity: pressed ? 0.8 : 1,
                  })}
                  onPress={handleConfirmDelete}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Delete Account</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

function NotificationSettingsScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [personalBests, setPersonalBests] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const renderToggleItem = (label: string, description: string, value: boolean, onToggle: (val: boolean) => void) => (
    <View style={{ paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{label}</Text>
        <Pressable
          onPress={() => onToggle(!value)}
          style={{
            width: 51,
            height: 31,
            borderRadius: 16,
            backgroundColor: value ? '#000000' : theme.border,
            padding: 2,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 27,
              height: 27,
              borderRadius: 14,
              backgroundColor: 'white',
              transform: [{ translateX: value ? 20 : 0 }],
            }}
          />
        </Pressable>
      </View>
      <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>{description}</Text>
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 24 }}>Notification Settings</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Push Notifications Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                PUSH NOTIFICATIONS
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {renderToggleItem(
                  'Workout Reminders',
                  'Get reminders for your scheduled workouts and rest days.',
                  workoutReminders,
                  setWorkoutReminders
                )}
                {renderToggleItem(
                  'Streak Alerts',
                  'Stay motivated and track your streak updates.',
                  streakAlerts,
                  setStreakAlerts
                )}
                {renderToggleItem(
                  'Personal Bests',
                  'Get notified when you hit a new personal record.',
                  personalBests,
                  setPersonalBests
                )}
              </View>
            </View>

            {/* Other Notifications Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                OTHER NOTIFICATIONS
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {renderToggleItem(
                  'App Updates',
                  'Keep track of new features and updates.',
                  appUpdates,
                  setAppUpdates
                )}
                {renderToggleItem(
                  'Promotions & Offers',
                  'Receive special offers and promotions.',
                  promotions,
                  setPromotions
                )}
              </View>
            </View>

            {/* Footer Text */}
            <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', lineHeight: 18 }}>
              You can manage your notification preferences at any time from your device's settings or from your account's system settings.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function PrivacyPolicyScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const renderSection = (number: number, title: string, content: string[]) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
        {number}. {title}
      </Text>
      {content.map((paragraph, index) => (
        <Text key={index} style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 22, marginBottom: 12 }}>
          {paragraph}
        </Text>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 8 }}>Privacy Policy</Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 24 }}>Last updated: October 28, 2023</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {renderSection(1, 'Introduction', [
              'Welcome to Flex Log! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application ("Application"). Because we respect your privacy, we do not agree with the terms of this privacy policy, please do not access the Application.',
            ])}

            {renderSection(2, 'Information We Collect', [
              'We may collect information about you in a variety of ways. The information we may collect via the Application includes:',
              '• Personal Data: Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Application.',
              '• Workout Data: Information such as your workout logs, exercise routines, sets, reps, weight, and duration.',
              '• Device Data: Information such as your device type, operating system, and information about the location of your device, to the extent that you permit us to access this information.',
            ])}

            {renderSection(3, 'How We Use Your Information', [
              'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:',
              '• Create and manage your account.',
              '• Track your workout progress and provide you with statistics.',
              '• Personalize your app experience.',
              '• Notify you of updates to the Application.',
              '• Monitor and analyze usage and trends to improve your experience with the Application.',
            ])}

            {renderSection(4, 'Disclosure of Your Information', [
              'We may share information we have collected about you in certain situations. Your information may be disclosed as follows:',
              '• By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.',
            ])}

            {renderSection(5, 'Security of Your Information', [
              'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.',
            ])}

            {renderSection(6, 'Changes to This Privacy Policy', [
              'We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.',
            ])}

            {renderSection(7, 'Contact Us', [
              'If you have questions or comments about this Privacy Policy, please contact us at:',
              'Email: support@flexlog.com',
            ])}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function TermsOfServiceScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const renderSection = (number: number, title: string, content: string[]) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 }}>
        {number}. {title}
      </Text>
      {content.map((paragraph, index) => (
        <Text key={index} style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 22, marginBottom: 12 }}>
          {paragraph}
        </Text>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 8 }}>Terms of Service</Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 24 }}>Last Updated: October 26, 2023</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 22, marginBottom: 24 }}>
              Welcome to our fitness application. By downloading, accessing, or using our mobile application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </Text>

            {renderSection(1, 'Use of Our Service', [
              'Our app provides a platform for logging and tracking your workouts. You are responsible for maintaining the confidentiality of the content you provide, including compliance with applicable laws, rules, and regulations. You should consult with your healthcare professional before starting any new fitness program.',
            ])}

            {renderSection(2, 'User Accounts', [
              'To use certain features of our app, you may be required to create an account. You must provide accurate information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.',
            ])}

            {renderSection(3, 'Intellectual Property', [
              'The service and its original content, features, and functionality are and will remain the exclusive property of our Company and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our company.',
            ])}

            {renderSection(4, 'Prohibited Uses', [
              'You agree not to use the service for any unlawful purposes or any purpose prohibited under this clause. You agree not to use the service in any way that could damage the app, services, or general business of our company.',
            ])}

            {renderSection(5, 'Termination', [
              'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.',
            ])}

            {renderSection(6, 'Limitations of Liability', [
              'In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
            ])}

            {renderSection(7, 'Changes to Terms', [
              'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.',
            ])}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function HelpSupportScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    { question: 'How do I log a workout?', answer: 'Tap the "+" button at the bottom of the screen, select an exercise from the dropdown, enter sets, reps, and weight, then tap "Add Exercise".' },
    { question: 'How do I edit my profile?', answer: 'Open the menu from the top-left, tap on your profile, then tap "Edit Profile" to update your name, weight, height, age, and gender.' },
    { question: 'How do I change my units of measurement?', answer: 'Go to Menu → Settings → Account Settings → Units of Measurement. You can choose between kg/lbs for weight and cm/in for height.' },
    { question: 'How do I view my previous workouts?', answer: 'Open the menu from the top-left and tap "Previous Logs" to see your workout history.' },
  ];

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const renderFAQItem = (question: string, answer: string) => {
    const isExpanded = expandedFAQ === question;

    return (
      <View key={question}>
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: pressed ? theme.input : theme.card,
          })}
          onPress={() => setExpandedFAQ(isExpanded ? null : question)}
        >
          <Text style={{ fontSize: 15, color: theme.text, flex: 1, fontWeight: '500' }}>{question}</Text>
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.textSecondary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
          >
            <Path d="M9 18l6-6-6-6" />
          </Svg>
        </Pressable>
        {isExpanded && (
          <View style={{ padding: 16, paddingTop: 0, backgroundColor: theme.card }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>{answer}</Text>
          </View>
        )}
        <View style={{ height: 1, backgroundColor: theme.border }} />
      </View>
    );
  };

  const renderContactItem = (icon: React.ReactNode, label: string) => (
    <Pressable
      key={label}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: pressed ? theme.input : theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 24, height: 24 }}>{icon}</View>
        <Text style={{ fontSize: 15, color: theme.text }}>{label}</Text>
      </View>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 18l6-6-6-6" />
      </Svg>
    </Pressable>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
            </Pressable>
            <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>Help & Support</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Search Bar */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.input, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                  <Path d="M21 21l-4.35-4.35" />
                </Svg>
                <TextInput
                  style={{ flex: 1, marginLeft: 8, fontSize: 15, color: theme.text }}
                  placeholder="Search topics or questions"
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* FAQ Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                FREQUENTLY ASKED QUESTIONS
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {faqItems.map(item => renderFAQItem(item.question, item.answer))}
              </View>
            </View>

            {/* Contact Us Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                CONTACT US
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {renderContactItem(
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <Path d="M22 6l-10 7L2 6" />
                  </Svg>,
                  'Email Support'
                )}
                {renderContactItem(
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </Svg>,
                  'Live Chat'
                )}
              </View>
            </View>

            {/* Contact Support Button */}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: theme.text,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: theme.bg, fontSize: 16, fontWeight: '600' }}>Contact Support</Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function GlobalRankScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'alltime'>('monthly');

  const leaderboardData = [
    { rank: 1, name: 'Jordan Smith', points: 1250, avatar: '👤' },
    { rank: 2, name: 'Alex Green', points: 1180, avatar: '👤' },
    { rank: 3, name: 'Sam Taylor', points: 1150, avatar: '👤' },
    { rank: 4, name: 'Casey Lee', points: 1120, avatar: '👤' },
    { rank: 5, name: 'Morgan Riley', points: 1095, avatar: '👤' },
    { rank: 6, name: 'Taylor Evans', points: 1080, avatar: '👤' },
    { rank: 7, name: 'Drew Chen', points: 1050, avatar: '👤' },
    { rank: 8, name: 'Jamie Garcia', points: 1023, avatar: '👤' },
  ];

  const currentUser = { rank: 23, name: 'You', points: 850, avatar: '👤' };

  const renderTab = (tab: 'weekly' | 'monthly' | 'alltime', label: string) => (
    <Pressable
      key={tab}
      onPress={() => setSelectedTab(tab)}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: selectedTab === tab ? '#000000' : theme.input,
      }}
    >
      <Text style={{ color: selectedTab === tab ? '#FFFFFF' : theme.textSecondary, fontSize: 14, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );

  const renderPodiumItem = (rank: number, name: string, points: number, isCenter: boolean) => (
    <View style={{ alignItems: 'center', flex: 1 }}>
      {rank === 1 && (
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8 }}>
          <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth={2} />
        </Svg>
      )}
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.input, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 32 }}>👤</Text>
      </View>
      <View style={{ backgroundColor: isCenter ? '#000000' : theme.card, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 }}>
        <Text style={{ color: isCenter ? '#FFFFFF' : theme.text, fontSize: 18, fontWeight: '700' }}>{rank}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 2 }}>{name}</Text>
      <Text style={{ fontSize: 13, color: theme.textSecondary }}>{points.toLocaleString()} Points</Text>
    </View>
  );

  const renderLeaderboardItem = (rank: number, name: string, points: number) => (
    <View key={rank} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.textSecondary, width: 30 }}>{rank}</Text>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.input, alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
        <Text style={{ fontSize: 20 }}>👤</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{name}</Text>
        <Text style={{ fontSize: 13, color: theme.textSecondary }}>{points.toLocaleString()} Points</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
            </Pressable>
            <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>Global Rank</Text>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
            {renderTab('weekly', 'Weekly')}
            {renderTab('monthly', 'Monthly')}
            {renderTab('alltime', 'All-Time')}
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Top 3 Podium */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 32, paddingHorizontal: 8 }}>
              <View style={{ flex: 1, paddingTop: 40 }}>
                {renderPodiumItem(2, 'Alex Green', 1180, false)}
              </View>
              <View style={{ flex: 1 }}>
                {renderPodiumItem(1, 'Jordan Smith', 1250, true)}
              </View>
              <View style={{ flex: 1, paddingTop: 40 }}>
                {renderPodiumItem(3, 'Sam Taylor', 1150, false)}
              </View>
            </View>

            {/* Leaderboard */}
            <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              {leaderboardData.slice(3).map(user => renderLeaderboardItem(user.rank, user.name, user.points))}
            </View>

            {/* Current User Rank */}
            <View style={{ backgroundColor: theme.input, borderRadius: 12, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, width: 30 }}>{currentUser.rank}</Text>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFB84D', alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{currentUser.name}</Text>
                  <Text style={{ fontSize: 13, color: theme.textSecondary }}>{currentUser.points.toLocaleString()} Points</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function SubscriptionScreen({
  visible,
  onClose,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
}) {
  const features = [
    'Unlimited workout logging',
    'Advanced performance analytics',
    'Custom exercise creation',
    'Ad-free experience',
  ];

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 24 }}>Subscription</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Premium Plan Card */}
            <View style={{ backgroundColor: '#1a1a1a', borderRadius: 16, padding: 24, marginBottom: 24, alignItems: 'center' }}>
              {/* Yellow Badge Icon */}
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFD700', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#1a1a1a" />
                </Svg>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 8 }}>Premium Plan</Text>
              <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>Your subscription is valid until Dec 24, 2024.</Text>
            </View>

            {/* Plan Details */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 12 }}>Plan Details</Text>
              <View style={{ gap: 12 }}>
                {features.map((feature, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CheckmarkIcon color={theme.text} />
                    <Text style={{ fontSize: 16, color: theme.text }}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Upgrade Plan Button */}
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: theme.text,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: theme.bg, fontSize: 16, fontWeight: '600' }}>Upgrade Plan</Text>
            </Pressable>

            {/* Manage Subscription */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                MANAGE SUBSCRIPTION
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                <Pressable
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: pressed ? theme.input : theme.card,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <Path d="M14 2v6h6" />
                      <Path d="M16 13H8" />
                      <Path d="M16 17H8" />
                      <Path d="M10 9H8" />
                    </Svg>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>Billing History</Text>
                  </View>
                  <ChevronRightIcon color={theme.textSecondary} />
                </Pressable>

                <Pressable
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: pressed ? theme.input : theme.card,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M15 9l-6 6" />
                      <Path d="M9 9l6 6" />
                    </Svg>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#ef4444' }}>Cancel Subscription</Text>
                  </View>
                  <ChevronRightIcon color={theme.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Footer Text */}
            <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', lineHeight: 18 }}>
              Your subscription will automatically renew on Dec 24, 2074.{'\n'}You can cancel anytime.
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function LanguageScreen({
  visible,
  onClose,
  theme,
  language,
  setLanguage,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const languages = [
    'English',
    'Español',
    'Français',
    'Deutsch',
    'Português',
    'Italiano',
    'हिंदी',
    'मराठी',
    'ગુજરાતી',
  ];

  const renderLanguageOption = (lang: string) => (
    <Pressable
      key={lang}
      onPress={() => setLanguage(lang)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: pressed ? theme.input : theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      })}
    >
      <Text style={{ fontSize: 16, fontWeight: '400', color: theme.text }}>{lang}</Text>
      {language === lang && <CheckmarkIcon color={theme.text} />}
    </Pressable>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 32 }}>Language</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
              {languages.map(renderLanguageOption)}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function UnitsScreen({
  visible,
  onClose,
  theme,
  units,
  setUnits,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  units: { weight: 'kg' | 'lbs'; height: 'cm' | 'in' };
  setUnits: React.Dispatch<React.SetStateAction<{ weight: 'kg' | 'lbs'; height: 'cm' | 'in' }>>;
}) {
  const renderOption = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: pressed ? theme.input : theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      })}
    >
      <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{label}</Text>
      {selected ? <CheckCircleIcon color={theme.text} /> : <CircleOutlineIcon color={theme.border} />}
    </Pressable>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Account Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 32 }}>Units of Measurement</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Weight Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                WEIGHT
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {renderOption('Kilograms (kg)', units.weight === 'kg', () => setUnits({ ...units, weight: 'kg' }))}
                {renderOption('Pounds (lbs)', units.weight === 'lbs', () => setUnits({ ...units, weight: 'lbs' }))}
              </View>
            </View>

            {/* Height Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                HEIGHT
              </Text>
              <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
                {renderOption('Centimeters (cm)', units.height === 'cm', () => setUnits({ ...units, height: 'cm' }))}
                {renderOption('Inches (in)', units.height === 'in', () => setUnits({ ...units, height: 'in' }))}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function AccountSettingsScreen({
  visible,
  onClose,
  theme,
  onNavigateToEditEmail,
  onNavigateToChangePassword,
  onNavigateToUnits,
  onNavigateToLanguage,
  onNavigateToSubscription,
  onNavigateToDeleteAccount,
  units,
  language,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  onNavigateToEditEmail: () => void;
  onNavigateToChangePassword: () => void;
  onNavigateToUnits: () => void;
  onNavigateToLanguage: () => void;
  onNavigateToSubscription: () => void;
  onNavigateToDeleteAccount: () => void;
  units: { weight: 'kg' | 'lbs'; height: 'cm' | 'in' };
  language: string;
}) {
  const renderSection = (title: string, items: { icon: React.ReactNode; label: string; value?: string; onPress?: () => void }[]) => (
    <View style={{ marginBottom: 24, width: '100%' }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Text>
      <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              backgroundColor: pressed ? theme.input : theme.card,
              borderBottomWidth: index < items.length - 1 ? 1 : 0,
              borderBottomColor: theme.border,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.input, alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </View>
              <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{item.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {item.value && (
                <Text style={{ fontSize: 16, color: theme.textSecondary }}>{item.value}</Text>
              )}
              <ChevronRightIcon color={theme.textSecondary} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
              <Text style={{ fontSize: 16, color: theme.text, fontWeight: '500' }}>Settings</Text>
            </Pressable>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, marginBottom: 24 }}>Account Settings</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {renderSection('Profile', [
              { icon: <PencilIcon color={theme.text} />, label: 'Edit Email', onPress: onNavigateToEditEmail },
              { icon: <LockIcon color={theme.text} />, label: 'Change Password', onPress: onNavigateToChangePassword },
            ])}

            {renderSection('Preferences', [
              { icon: <BagIcon color={theme.text} />, label: 'Units of Measurement', value: `${units.weight}, ${units.height}`, onPress: onNavigateToUnits },
              { icon: <GlobeIcon color={theme.text} />, label: 'Language', value: language, onPress: onNavigateToLanguage },
            ])}

            {renderSection('Account Management', [
              { icon: <CreditCardIcon color={theme.text} />, label: 'Subscription', onPress: onNavigateToSubscription },
            ])}

            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#ffc0cb' : '#ffdddd',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 32,
              })}
              onPress={onNavigateToDeleteAccount}
            >
              <Text style={{ color: '#dc2626', fontSize: 16, fontWeight: '600' }}>Delete Account</Text>
            </Pressable>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function SettingsScreen({
  visible,
  onClose,
  theme,
  onNavigateToAccountSettings,
  onNavigateToNotifications,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
  onNavigateToHelpSupport,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  onNavigateToAccountSettings: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToPrivacyPolicy: () => void;
  onNavigateToTermsOfService: () => void;
  onNavigateToHelpSupport: () => void;
}) {
  const renderSection = (title: string, items: { icon: React.ReactNode; label: string; onPress?: () => void }[]) => (
    <View style={{ marginBottom: 24, width: '100%' }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Text>
      <View style={{ backgroundColor: theme.card, borderRadius: 12, overflow: 'hidden' }}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              backgroundColor: pressed ? theme.input : theme.card,
              borderBottomWidth: index < items.length - 1 ? 1 : 0,
              borderBottomColor: theme.border,
            })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.input, alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </View>
              <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{item.label}</Text>
            </View>
            <ChevronRightIcon color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.container, { padding: 20 }]}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Pressable onPress={onClose} style={{ padding: 8, marginRight: 8, marginLeft: -8 }}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
            </Pressable>
            <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>Settings</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {renderSection('Account & Preferences', [
              { icon: <UserIcon color={theme.text} />, label: 'Account Settings', onPress: onNavigateToAccountSettings },
              { icon: <BellIcon color={theme.text} />, label: 'Notifications', onPress: onNavigateToNotifications },
            ])}

            {renderSection('Legal & Information', [
              { icon: <ShieldIcon color={theme.text} />, label: 'Privacy Policy', onPress: onNavigateToPrivacyPolicy },
              { icon: <DocumentIcon color={theme.text} />, label: 'Terms of Service', onPress: onNavigateToTermsOfService },
              { icon: <InfoIcon color={theme.text} />, label: 'About App' },
            ])}

            {renderSection('Support', [
              { icon: <HelpIcon color={theme.text} />, label: 'Help & Support', onPress: onNavigateToHelpSupport },
              { icon: <StarIcon color={theme.text} />, label: 'Rate Us' },
            ])}

            <Text style={{ textAlign: 'center', color: theme.muted, fontSize: 13, marginTop: 20 }}>
              Version 1.0.0
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function ProfileMenuDrawer({
  visible,
  onClose,
  theme,
  onNavigateToLog,
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToRank,
  profile,
  onLogout,
}: {
  visible: boolean;
  onClose: () => void;
  theme: typeof lightTheme;
  onNavigateToLog: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onNavigateToRank: () => void;
  profile: UserProfile;
  onLogout: () => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const drawerWidth = useMemo(() => screenWidth * 0.6, [screenWidth]);
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    slideAnim.setValue(-drawerWidth);
  }, [drawerWidth, slideAnim]);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -drawerWidth,
        useNativeDriver: true,
        bounciness: 0,
        speed: 16,
      }).start(() => setIsAnimating(false));
    }
  }, [visible, slideAnim, drawerWidth]);

  if (!visible && !isAnimating) return null;

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <Pressable style={styles.drawerBackdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.drawerContainer,
            { backgroundColor: theme.card, transform: [{ translateX: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          {/* Profile Section */}
          <Pressable
            style={styles.drawerProfile}
            onPress={() => {
              onNavigateToProfile();
              onClose();
            }}
          >
            <View style={[styles.drawerAvatar, { backgroundColor: theme.input }]}>
              <UserIcon color={theme.textSecondary} />
            </View>
            <Text style={[styles.drawerName, { color: theme.text }]}>{profile.name}</Text>
          </Pressable>

          {/* Divider */}
          <View style={[styles.drawerDivider, { backgroundColor: theme.border }]} />

          {/* Stats Section */}
          <View style={styles.drawerStats}>
            <View style={styles.drawerStatItem}>
              <FlameIcon color="#FF9500" />
              <Text style={[styles.drawerStatLabel, { color: theme.textSecondary }]}>Streak</Text>
            </View>
            <Text style={[styles.drawerStatValue, { color: theme.text }]}>15 days</Text>
          </View>

          <Pressable
            style={styles.drawerStats}
            onPress={() => {
              onNavigateToRank();
              onClose();
            }}
          >
            <View style={styles.drawerStatItem}>
              <TrophyIcon color="#FFD60A" />
              <Text style={[styles.drawerStatLabel, { color: theme.textSecondary }]}>Rank</Text>
            </View>
            <Text style={[styles.drawerStatValue, { color: theme.text }]}>#GymShark</Text>
          </Pressable>

          {/* Divider */}
          <View style={[styles.drawerDivider, { backgroundColor: theme.border }]} />

          {/* Menu Items */}
          <Pressable style={styles.drawerMenuItem} onPress={() => { onNavigateToLog(); onClose(); }}>
            <View style={styles.drawerMenuItemLeft}>
              <CalendarIcon color={theme.text} />
              <Text style={[styles.drawerMenuItemText, { color: theme.text }]}>Previous Logs</Text>
            </View>
            <ChevronRightIcon color={theme.textSecondary} />
          </Pressable>

          <Pressable style={styles.drawerMenuItem} onPress={() => { onNavigateToSettings(); onClose(); }}>
            <View style={styles.drawerMenuItemLeft}>
              <SettingsIcon color={theme.text} />
              <Text style={[styles.drawerMenuItemText, { color: theme.text }]}>Settings</Text>
            </View>
            <ChevronRightIcon color={theme.textSecondary} />
          </Pressable>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Logout Button */}
          <Pressable
            style={({ pressed }) => [
              styles.drawerLogoutButton,
              { backgroundColor: pressed ? '#111111' : '#000000' }
            ]}
            onPress={() => {
              onClose();
              onLogout();
            }}
          >
            <Text style={styles.drawerLogoutText}>Logout</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const lightTheme = {
  bg: '#F2F2F7', // iOS grouped background
  text: '#111111',
  textSecondary: '#3A3A3C',
  muted: '#8E8E93',
  card: '#FFFFFF',
  border: '#E5E5EA',
  input: '#F2F2F7',
  accent: '#000000', // primary pill buttons
  accentPressed: '#111111',
  onAccent: '#FFFFFF',
  danger: '#FF3B30',
  dangerPressed: '#D32F23',
};

const darkTheme = {
  bg: '#000000',
  text: '#FFFFFF',
  textSecondary: '#D1D1D6',
  muted: '#8E8E93',
  card: '#1C1C1E',
  border: '#2C2C2E',
  input: '#1C1C1E',
  accent: '#FFFFFF',
  accentPressed: '#E5E5EA',
  onAccent: '#000000',
  danger: '#FF453A',
  dangerPressed: '#FF3B30',
};

const RC = 16; // container radius (cards, rows, modals)
const RI = 12; // control radius (inputs, chips, buttons)
const CH = 44; // uniform control height
const CHART_H = 120; // bar max height in px
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    position: 'absolute',
    right: 0,
  },
  card: {
    borderRadius: RC,
    padding: 16,
    borderWidth: 1,
    marginBottom: 5,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTight: {
    gap: 0,
  },
  trioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trioItem: {
    flex: 1,
    height: CH,
  },
  trioButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  setInputsRow: {
    flex: 0.72,
    flexDirection: 'row',
    gap: 5,
  },
  column: {
    flexDirection: 'column',
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionsRowTwo: {
    flexDirection: 'row',
    gap: 8,
  },
  gapSmall: {
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RI,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    overflow: 'hidden',
  },
  inputTop: {
    marginTop: 12,
  },
  inputHalf: {
    flex: 0.5,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: RI,
    overflow: 'hidden',
  },
  buttonFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonLabel: {
    fontWeight: '500',
  },
  buttonLabelStrong: {
    fontWeight: '700',
  },
  buttonNarrow: {
    paddingHorizontal: 12,
  },
  buttonFixed: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconBtnSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  chip: {
    borderWidth: 1,
    borderRadius: RI,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  setsContainer: {
    gap: 8,
    marginTop: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: RC,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  setText: {
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '75%',
    borderTopLeftRadius: RC,
    borderTopRightRadius: RC,
    padding: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  shadowSoft: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: RC,
    paddingHorizontal: 12,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: RI,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabBtnActive: {
    // background handled inline with theme.accent
  },
  tabText: {
    fontWeight: '700',
  },
  // Progress metrics
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsSub: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
  statsValue: {
    textAlign: 'right',
    maxWidth: '55%',
    fontSize: 14,
    fontWeight: '600',
  },
  emph: {
    fontWeight: '800',
  },
  // Weekly bar chart
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
    height: 160,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  chartBarTrack: {
    width: 18,
    height: 130,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartWithAxis: {
    flexDirection: 'row',
    gap: 8,
  },
  yAxis: {
    width: 44,
    height: 160,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  yTickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0,
    paddingTop: 2,
  },
  yTickLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartArea: {
    flex: 1,
    height: 160,
    position: 'relative',
  },
  yGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    borderTopWidth: 1,
  },
  // New UI Styles
  addExerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: RC,
    borderWidth: 1,
    marginBottom: 16,
  },
  addExerciseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  plusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Bottom Sheet
  bottomSheet: {
    borderTopLeftRadius: RC,
    borderTopRightRadius: RC,
    padding: 24,
    borderWidth: 1,
    width: '100%',
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  dateTimeText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: RI,
    borderWidth: 1,
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBig: {
    borderWidth: 1,
    borderRadius: RI,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    overflow: 'hidden',
    minWidth: 120,
  },
  // Swipe Button
  swipeButtonContainer: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  swipeText: {
    fontWeight: '600',
    fontSize: 16,
  },
  swipeKnob: {
    position: 'absolute',
    left: 4,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Profile Button
  profileButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Drawer Menu
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '60%',
    height: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 0 },
    elevation: 5,
  },
  drawerProfile: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  drawerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  drawerName: {
    fontSize: 24,
    fontWeight: '700',
  },
  drawerDivider: {
    height: 1,
    marginVertical: 20,
  },
  drawerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  drawerStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerStatLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  drawerStatValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  drawerMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  drawerLogoutButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  drawerLogoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Logger Page Styles
  loggerCenteredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  addExerciseCardLarge: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: RC,
    borderWidth: 2,
    gap: 16,
    minWidth: 280,
  },
  plusIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExerciseTextLarge: {
    fontSize: 24,
    fontWeight: '700',
  },
  addExerciseHint: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Today Page Styles
  todayStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: RC,
    borderWidth: 1,
    marginBottom: 16,
  },
  todayStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  todayStatValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  todayStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  todayStatDivider: {
    width: 1,
    height: 40,
  },
  todayEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    borderRadius: RC,
    borderWidth: 1,
    gap: 16,
  },
  todayEmptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  todayEmptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  todayExerciseCard: {
    padding: 20,
    borderRadius: RC,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  todayExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayExerciseName: {
    fontSize: 20,
    fontWeight: '700',
  },
  todayExerciseTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  todaySetsContainer: {
    gap: 8,
    marginTop: 8,
  },
  todaySetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  todaySetText: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Workout Log Page Styles
  workoutLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  workoutLogBackButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutLogTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
  },
  calendarContainer: {
    borderRadius: RC,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDay: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  calendarDaySelected: {
    backgroundColor: '#000000',
  },
  calendarDayToday: {
    borderWidth: 2,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 8,
  },
  workoutDateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  noWorkoutsContainer: {
    padding: 32,
    borderRadius: RC,
    borderWidth: 1,
    alignItems: 'center',
  },
  noWorkoutsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutLogCard: {
    padding: 16,
    borderRadius: RC,
    borderWidth: 1,
    marginBottom: 12,
  },
  workoutLogCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutLogCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutLogCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  workoutLogCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  // Profile Screen Styles
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: RC,
    borderWidth: 1,
    gap: 8,
    width: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Edit Mode Inputs
  editInput: {
    fontSize: 16,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderColor: '#0A84FF',
    paddingVertical: 4,
    minWidth: 100,
    textAlign: 'right',
  },
});

export default App;
