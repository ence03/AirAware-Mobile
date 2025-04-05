import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For adding icons
import * as Progress from "react-native-progress"; // For progress bars

const AnalysisScreen = ({ route }) => {
  const { data } = route.params;

  // Actionable feedback based on thresholds
  const getTemperatureFeedback = (temp) => {
    if (temp > 24) return "High temperature! Consider improving ventilation.";
    if (temp < 18) return "Low temperature. It might feel chilly.";
    return "Temperature is within good range.";
  };

  const getHumidityFeedback = (humidity) => {
    if (humidity < 40 || humidity > 60) return "Humidity is moderate.";
    if (humidity < 35 || humidity > 65)
      return "Humidity is outside optimal range.";
    return "Humidity is within good range.";
  };

  const getTVOCFeedback = (tvoc) => {
    if (tvoc <= 400) return "TVOC levels are good.";
    if (tvoc >= 401 && tvoc <= 2200) return "TVOC levels are fair/moderate.";
    return "High TVOC levels! Consider improving air quality.";
  };

  // Determine progress bar color based on thresholds
  const getProgressColor = (value, maxValue, type) => {
    let percentage = value / maxValue;
    if (type === "temp") {
      if (value < 18 || value > 24) return "#f44336"; // Red for bad temperature
      if (value >= 21 && value <= 24) return "#ff9800"; // Orange for moderate
      return "#4caf50"; // Green for good
    }
    if (type === "humidity") {
      if (value < 35 || value > 65) return "#f44336"; // Red for bad humidity
      if (value >= 40 && value <= 60) return "#4caf50"; // Green for good
      return "#ff9800"; // Orange for moderate
    }
    if (type === "tvoc") {
      if (value <= 400) return "#4caf50"; // Green for good TVOC
      if (value >= 401 && value <= 2200) return "#ff9800"; // Orange for moderate
      return "#f44336"; // Red for bad TVOC
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Analysis</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Date/Time</Text>
        <Text style={styles.cardContent}>
          {moment(data.createdAt).format("YYYY-MM-DD HH:mm")}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Temperature</Text>
        <View style={styles.row}>
          <Text style={styles.cardContent}>{data.avgTemperature}°C</Text>
          <MaterialCommunityIcons
            name="thermometer"
            size={24}
            color={getProgressColor(data.avgTemperature, 40, "temp")}
            style={styles.icon}
          />
        </View>
        <Progress.Bar
          progress={data.avgTemperature / 40} // Assuming 40°C is max temperature
          width={null}
          height={10}
          borderRadius={5}
          color={getProgressColor(data.avgTemperature, 40, "temp")}
          style={styles.progressBar}
        />
        <Text style={styles.feedback}>
          {getTemperatureFeedback(data.avgTemperature)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Humidity</Text>
        <View style={styles.row}>
          <Text style={styles.cardContent}>{data.avgHumidity}%</Text>
          <MaterialCommunityIcons
            name="water-percent"
            size={24}
            color={getProgressColor(data.avgHumidity, 100, "humidity")}
            style={styles.icon}
          />
        </View>
        <Progress.Bar
          progress={data.avgHumidity / 100} // Max 100%
          width={null}
          height={10}
          borderRadius={5}
          color={getProgressColor(data.avgHumidity, 100, "humidity")}
          style={styles.progressBar}
        />
        <Text style={styles.feedback}>
          {getHumidityFeedback(data.avgHumidity)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TVOC</Text>
        <View style={styles.row}>
          <Text style={styles.cardContent}>{data.avgTVOC} ppb</Text>
          <MaterialCommunityIcons
            name="cloud-search"
            size={24}
            color={getProgressColor(data.avgTVOC, 30000, "tvoc")}
            style={styles.icon}
          />
        </View>
        <Progress.Bar
          progress={data.avgTVOC / 30000} // Assuming 30000 ppb is the max threshold
          width={null}
          height={10}
          borderRadius={5}
          color={getProgressColor(data.avgTVOC, 30000, "tvoc")}
          style={styles.progressBar}
        />
        <Text style={styles.feedback}>{getTVOCFeedback(data.avgTVOC)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Air Quality Status</Text>
        <Text style={styles.cardContent}>{data.airQualityStatus}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4, // Add shadow for Android
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  cardContent: {
    fontSize: 16,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  progressBar: {
    marginTop: 10,
  },
  feedback: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
});

export default AnalysisScreen;
