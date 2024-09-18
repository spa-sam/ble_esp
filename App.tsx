import React from 'react';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { BleProvider } from './src/context/BleContext';
import { colors } from './src/styles/colors';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  enableScreens();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <BleProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color }) => {
                let iconName;

                if (route.name === 'Головна') {
                  iconName = focused ? 'bluetooth-connect' : 'bluetooth';
                } else if (route.name === 'Налаштування') {
                  iconName = focused ? 'cog' : 'cog-outline';
                }

                return (
                  <Icon
                    name={iconName || 'default-icon'}
                    size={24}
                    color={color}
                  />
                );
              },
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.lightText,
              tabBarStyle: { backgroundColor: colors.background },
              tabBarIndicatorStyle: { backgroundColor: colors.primary },
            })}
          >
            <Tab.Screen name="Головна" component={MainScreen} />
            <Tab.Screen name="Налаштування" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </BleProvider>
    </SafeAreaProvider>
  );
}
