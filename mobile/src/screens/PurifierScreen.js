import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For icons
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";

const PurifierScreen = () => {
  const { devices, updateDevice, fetchDevices } = useDeviceStore();
  const [purifyingMessage, setPurifyingMessage] = useState({});
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleRelayState = (device) => {
    const updatedRelayState = !device.relayState;

    // Update the relay state
    updateDevice(device._id, { relayState: updatedRelayState });

    // Animate the state change
    Animated.timing(animatedValue, {
      toValue: updatedRelayState ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (!updatedRelayState) {
      // Reset duration when turning off
      updateDevice(device._id, { operationDuration: null });
      setPurifyingMessage((prev) => ({
        ...prev,
        [device._id]: null,
      }));
    }
  };

  const updateDuration = (device, duration) => {
    const durationInMinutes = duration === "1hr" ? 60 : parseInt(duration);
    const durationString =
      durationInMinutes === 60 ? "1hr" : `${durationInMinutes}min`;

    updateDevice(device._id, { operationDuration: durationString });

    setPurifyingMessage((prev) => ({
      ...prev,
      [device._id]: `Purifying for ${durationString}`,
    }));
  };

  const getCardBackgroundColor = (relayState) => {
    return relayState ? "#e8f5e9" : "#ffebee"; // Green for ON, Red for OFF
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Purifier Control</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.deviceItem,
              { backgroundColor: getCardBackgroundColor(item.relayState) },
            ]}
          >
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceName}>{item.name}</Text>
              {/* Display Location next to the device name */}
              {item.location && (
                <Text style={styles.deviceLocation}>{item.location}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.relayButton,
                { backgroundColor: item.relayState ? "#4CAF50" : "#F44336" },
              ]}
              onPress={() => toggleRelayState(item)}
            >
              <MaterialCommunityIcons
                name={item.relayState ? "power" : "power-off"}
                size={24}
                color="#fff"
              />
              <Text style={styles.relayButtonText}>
                {item.relayState ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>

            <View style={styles.durationContainer}>
              {["10min", "30min", "1hr"].map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.durationButton,
                    item.operationDuration === duration
                      ? styles.durationButtonSelected
                      : null,
                  ]}
                  onPress={() =>
                    item.relayState && updateDuration(item, duration)
                  }
                  disabled={!item.relayState} // Disable if relay is off
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      item.operationDuration === duration
                        ? styles.durationButtonTextSelected
                        : null,
                      !item.relayState
                        ? styles.durationButtonTextDisabled
                        : null, // Gray text if disabled
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {purifyingMessage[item._id] && (
              <Text style={styles.purifyingMessage}>
                {purifyingMessage[item._id]}
              </Text>
            )}
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No devices available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
    textAlign: "center",
  },
  deviceItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin: 16,
  },
  deviceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap", // Allow wrapping of text
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deviceLocation: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    flexShrink: 1,
  },
  relayButton: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  relayButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  durationButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
    width: 90,
  },
  durationButtonSelected: {
    backgroundColor: "#007BFF",
  },
  durationButtonText: {
    fontSize: 14,
    textAlign: "center",
  },
  durationButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  durationButtonTextDisabled: {
    color: "#aaa",
  },
  purifyingMessage: {
    marginTop: 8,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
  },
});

export default PurifierScreen;
