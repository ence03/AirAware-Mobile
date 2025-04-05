import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ChartMeter = ({ title, value, max, color }) => {
  return (
    <View style={styles.meterContainer}>
      <AnimatedCircularProgress
        size={140} // Diameter of the meter
        width={15} // Thickness of the circle
        fill={(value / max) * 100} // Calculate percentage
        tintColor={color} // Color of the progress
        backgroundColor="#e0e0e0" // Background circle color
        lineCap="round" // Smooth ends
      >
        {() => (
          <Text style={styles.meterText}>
            {value}
            <Text style={styles.unitText}> / {max}</Text>
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text style={styles.meterTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  meterContainer: {
    alignItems: "center",
  },
  meterText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  unitText: {
    fontSize: 12,
    color: "#666",
  },
  meterTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ChartMeter;
