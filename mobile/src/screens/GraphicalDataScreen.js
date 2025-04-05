import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AvgDataChart from "../components/AvgDataChart";
import Header from "../components/Header";

const GraphicalDataScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <AvgDataChart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GraphicalDataScreen;
