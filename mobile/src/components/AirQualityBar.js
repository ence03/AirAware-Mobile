import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

const AirQualityBar = ({ airQualityStatus }) => {
  useEffect(() => {
    console.log("Air Quality Status Updated:", airQualityStatus);
  }, [airQualityStatus]);

  let barColor = "#4caf50";
  let progress = 1; // Good
  let label = "Good";

  if (airQualityStatus === "Fair") {
    barColor = "#FFC107";
    progress = 0.5;
    label = "Fair";
  } else if (airQualityStatus === "Bad") {
    barColor = "#F44336";
    progress = 0.25;
    label = "Bad";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Air Quality: {label}</Text>
      <Progress.Bar
        progress={progress}
        width={200}
        height={10}
        color={barColor}
        borderWidth={0}
        borderRadius={5}
        unfilledColor="#e0e0e0"
        animationType="spring"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AirQualityBar;
