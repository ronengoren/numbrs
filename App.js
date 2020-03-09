import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import RandomFact from './src/screens/RandomFact';
import HomeScreen from './src/screens/HomeScreen';
import FavNumber from './src/screens/FavNumber';
import Quiz from './src/screens/Quiz';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Quiz">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RandomFact" component={RandomFact} />
        <Stack.Screen name="FavNumber" component={FavNumber} />
        <Stack.Screen name="Quiz" component={Quiz} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
