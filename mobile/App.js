import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native"; // Added Text for loading state
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AirQualityDataScreen from "./src/screens/AirQualityDataScreen";
import GraphicalDataScreen from "./src/screens/GraphicalDataScreen";
import DevicesScreen from "./src/screens/DevicesScreen";
import PurifierScreen from "./src/screens/PurifierScreen";
import AnalysisScreen from "./src/screens/AnalysisScreen";
import useAuthStore from "./src/store/authStore";

const Stack = createStackNavigator();

export default function App() {
  const { user, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth(); // Check if user is logged in
      setIsLoading(false);
    };
    initializeAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <Text>Loading...</Text>; // Show loading state while checking auth
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "home" : "login"} // Direct to home if logged in, login if not
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="airQualityData" component={AirQualityDataScreen} />
        <Stack.Screen name="graphicalData" component={GraphicalDataScreen} />
        <Stack.Screen name="devices" component={DevicesScreen} />
        <Stack.Screen name="purifier" component={PurifierScreen} />
        <Stack.Screen name="analysis" component={AnalysisScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
