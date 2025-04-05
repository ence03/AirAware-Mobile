import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleToAirQualityData = () => {
    navigation.navigate("airQualityData");
  };

  const handleToGraphicalData = () => {
    navigation.navigate("graphicalData");
  };

  const handleToDevices = () => {
    navigation.navigate("devices");
  };

  const handleToPurifier = () => {
    navigation.navigate("purifier");
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.dashboard}>
        <Image
          style={styles.logo}
          source={require("../../assets/appIcon.png")}
          resizeMode="contain"
        />
        <Text style={styles.label}>Where would you like to go?</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleToAirQualityData}
            style={[styles.btns, styles.shadow]}
          >
            <Text style={styles.btnsText}>Air Quality Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToGraphicalData}
            style={[styles.btns, styles.shadow]}
          >
            <Text style={styles.btnsText}>Graphical Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToPurifier}
            style={[styles.btns, styles.shadow]}
          >
            <Text style={styles.btnsText}>Purifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToDevices}
            style={[styles.btns, styles.shadow]}
          >
            <Text style={styles.btnsText}>Devices</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB", // Light gray background for modern feel
  },
  dashboard: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    color: "#333", // Neutral dark color for text
    marginBottom: 20,
    fontWeight: "500",
  },
  buttons: {
    width: "80%",
    alignItems: "center",
    gap: 20, // Consistent spacing between buttons
  },
  btns: {
    width: "100%",
    borderRadius: 10, // Rounded buttons for modern design
    padding: 15,
    backgroundColor: "#5073FA", // Vibrant blue color
    alignItems: "center",
  },
  btnsText: {
    color: "#fff", // White text for contrast
    fontWeight: "600",
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android shadow
  },
});

export default HomeScreen;
