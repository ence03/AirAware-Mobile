import { StyleSheet } from "react-native";
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="airQualityData"
          component={AirQualityDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="graphicalData"
          component={GraphicalDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="devices"
          component={DevicesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="purifier"
          component={PurifierScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="analysis"
          component={AnalysisScreen}
          options={{ headerShown: false }}
        />
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
