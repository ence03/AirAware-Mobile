import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import useAverageStore from "../store/avgDataStore";
import * as Progress from "react-native-progress"; // Importing from react-native-progress
import moment from "moment"; // Import moment for formatting dates

import { useNavigation } from "@react-navigation/native";

const AvgDataChart = () => {
  const [type, setType] = useState("hourly"); // Track selected type: hourly or daily
  const { averages, fetchAverages, loading, error, listenForNewData } =
    useAverageStore((state) => state);
  const [selectedData, setSelectedData] = useState(null); // Store selected data for analysis
  const navigation = useNavigation();

  // Fetch averages when component mounts, or when type changes
  useEffect(() => {
    fetchAverages(type); // Fetch data based on selected type
    listenForNewData(); // Listen for new data from the socket
  }, [fetchAverages, listenForNewData, type]);

  // Render loading or error states
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Filter daily data based on type
  const filteredAverages = averages.filter((item) => item.type === type);

  // Function to handle card press and navigate to analysis view
  const handleCardPress = (data) => {
    setSelectedData(data);
    navigation.navigate("analysis", { data: data });
  };

  return (
    <View style={styles.container}>
      {/* Toggle buttons to switch between "hourly" and "daily" */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setType("hourly")}
          style={[
            styles.tglbtn,
            { backgroundColor: type === "hourly" ? "#4caf50" : "#ccc" },
          ]}
        >
          <Text style={styles.tglbtnText}>Hourly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("daily")}
          style={[
            styles.tglbtn,
            { backgroundColor: type === "daily" ? "#4caf50" : "#ccc" },
          ]}
        >
          <Text style={styles.tglbtnText}>Daily</Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView for displaying data */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredAverages.length > 0 ? (
          filteredAverages.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardPress(item)} // Handle card press
              style={styles.card}
            >
              <Text style={styles.title}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Data
              </Text>

              {/* Displaying the hour or date of the data */}
              <Text style={styles.date}>
                {type === "hourly"
                  ? moment(item.createdAt).format("YYYY-MM-DD HH:mm") // Hourly data formatted with hour
                  : moment(item.createdAt).format("YYYY-MM-DD")}
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Temperature</Text>
                <Text style={styles.value}>{item.avgTemperature}°C</Text>
              </View>
              <Progress.Bar
                progress={item.avgTemperature ? item.avgTemperature / 105 : 0} // Fallback to 0 if null or undefined
                width={null} // Full width
                height={10}
                borderRadius={5}
                color="#4caf50"
                style={styles.progressBar}
              />

              <View style={styles.row}>
                <Text style={styles.label}>Humidity</Text>
                <Text style={styles.value}>{item.avgHumidity}%</Text>
              </View>
              <Progress.Bar
                progress={item.avgHumidity ? item.avgHumidity / 100 : 0} // Fallback to 0 if null or undefined
                width={null}
                height={10}
                borderRadius={5}
                color="#2196f3"
                style={styles.progressBar}
              />

              <View style={styles.row}>
                <Text style={styles.label}>TVOC</Text>
                <Text style={styles.value}>{item.avgTVOC} ppb</Text>
              </View>
              <Progress.Bar
                progress={item.avgTVOC ? item.avgTVOC / 30000 : 0} // Fallback to 0 if null or undefined
                width={null}
                height={10}
                borderRadius={5}
                color="#f44336"
                style={styles.progressBar}
              />

              <View style={styles.row}>
                <Text style={styles.label}>Air Quality Status</Text>
                <Text style={styles.status}>{item.airQualityStatus}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-evenly",
    width: "100%",
  },
  tglbtn: {
    width: 100,
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  tglbtnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center", // Center align items horizontally
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    width: "90%",
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#333",
  },
  value: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4caf50",
  },
  progressBar: {
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default AvgDataChart;
