import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import ChartMeter from "../components/ChartMeter";
import AirQualityBar from "../components/AirQualityBar";
import Header from "../components/Header";
import { useSensorDataStore } from "../store/sensorDataStore";
import useAverageStore from "../store/avgDataStore";

const AirQualityDataScreen = () => {
  const {
    latestData,
    isLoading,
    error,
    fetchLatestSensorData,
    listenForNewData,
  } = useSensorDataStore();

  const { calculateAndSendHourlyAverage, calculateAndSendDailyAverage } =
    useAverageStore();

  const [lastProcessedData, setLastProcessedData] = useState(null);
  const [lastHourlyCalculation, setLastHourlyCalculation] = useState(null);

  const fetchData = useCallback(() => {
    fetchLatestSensorData();
    listenForNewData();
  }, [fetchLatestSensorData, listenForNewData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (latestData && latestData !== lastProcessedData) {
      const now = new Date();

      // Calculate hourly average
      if (
        !lastHourlyCalculation ||
        now - new Date(lastHourlyCalculation) >= 60 * 60 * 1000
      ) {
        calculateAndSendHourlyAverage(latestData);
        setLastHourlyCalculation(now.toISOString());
      }

      setLastProcessedData(latestData);
    }
  }, [
    latestData,
    lastProcessedData,
    lastHourlyCalculation,
    calculateAndSendHourlyAverage,
  ]);

  useEffect(() => {
    calculateAndSendDailyAverage();
  }, [calculateAndSendDailyAverage]);

  const getColor = (value, ranges) => {
    for (const range of ranges) {
      if (value >= range.min && value <= range.max) return range.color;
    }
    return ranges[ranges.length - 1].color; // Default
  };

  const metricConfig = [
    {
      title: "Temperature (°C)",
      value: latestData?.temperature,
      max: 105,
      ranges: [
        { min: -Infinity, max: 17.99, color: "#f44336" },
        { min: 18, max: 20.99, color: "#4caf50" },
        { min: 21, max: 24, color: "#FFC107" },
        { min: 24.01, max: Infinity, color: "#f44336" },
      ],
    },
    {
      title: "Humidity (%)",
      value: latestData?.humidity,
      max: 100,
      ranges: [
        { min: -Infinity, max: 39.99, color: "#f44336" },
        { min: 40, max: 60, color: "#4caf50" },
        { min: 60.01, max: Infinity, color: "#f44336" },
      ],
    },
    {
      title: "TVOC (ppb)",
      value: latestData?.tvoc,
      max: 30000,
      ranges: [
        { min: 0, max: 399, color: "#4caf50" },
        { min: 400, max: 2199, color: "#FFC107" },
        { min: 2200, max: Infinity, color: "#f44336" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text>Loading sensor data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {latestData ? (
        <>
          {metricConfig.map((metric, index) => (
            <ChartMeter
              key={index}
              title={metric.title}
              value={metric.value}
              max={metric.max}
              color={getColor(metric.value, metric.ranges)}
            />
          ))}
          <AirQualityBar
            airQualityStatus={latestData.airQualityStatus || "Good"}
          />
        </>
      ) : (
        <Text>No sensor data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default AirQualityDataScreen;
