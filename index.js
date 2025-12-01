/**
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';

//import HeightSelectionScreen from './onboarding/height';
//import WeightSelectionScreen from './onboarding/weight';
//import AgeSelectionScreen from './onboarding/age';
//import GenderSelectionScreen from './onboarding/gender';
//import ActivitySelectionScreen from './onboarding/activity';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);
//AppRegistry.registerComponent(appName, () => ActivitySelectionScreen);
//AppRegistry.registerComponent(appName, () => HeightSelectionScreen);
//AppRegistry.registerComponent(appName, () => WeightSelectionScreen);
//AppRegistry.registerComponent(appName, () => AgeSelectionScreen);
//AppRegistry.registerComponent(appName, () => GenderSelectionScreen);
