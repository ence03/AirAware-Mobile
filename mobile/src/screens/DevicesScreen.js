import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { ActivityIndicator, Switch } from "react-native";
import Header from "../components/Header";
import useDeviceStore from "../store/deviceStore";
import useAuthStore from "../store/authStore";
import io from "socket.io-client";

const socket = io("http://192.168.1.197:7000");

const DevicesScreen = () => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("");
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const { devices, addDevice, deleteDevice, updateDevice, fetchDevices } =
    useDeviceStore();

  React.useEffect(() => {
    useAuthStore.getState().loadAuthState();
    fetchDevices();

    socket.on("deviceUpdated", (updatedDevice) => {
      set((state) => ({
        devices: state.devices.map((device) =>
          device._id === updatedDevice._id ? updatedDevice : device
        ),
      }));
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off("deviceUpdated");
    };
  }, [fetchDevices]);

  const handleAddDevice = () => {
    if (deviceName.trim() && deviceLocation.trim()) {
      setLoading(true);
      addDevice({
        name: deviceName,
        relayState: false,
        operationDuration: null,
        location: deviceLocation,
        isConnected: true,
      })
        .then(() => {
          setDeviceName("");
          setDeviceLocation("");
          setAddModalVisible(false);
        })
        .catch((error) => {
          setError(error.message || "Failed to add device");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Please fill in all fields");
    }
  };

  const handleDeleteDevice = (id) => {
    deleteDevice(id);
  };

  const handleEditDevice = (device) => {
    setDeviceToEdit(device);
    setDeviceName(device.name);
    setDeviceLocation(device.location);
    setEditModalVisible(true);
  };

  const handleUpdateDevice = async () => {
    if (deviceName.trim() && deviceLocation.trim() && deviceToEdit) {
      try {
        await updateDevice(deviceToEdit._id, {
          name: deviceName,
          location: deviceLocation,
        });
        setEditModalVisible(false);
      } catch (error) {
        console.error("Update failed:", error.message);
      }
    }
  };

  const handleToggleConnection = async (device) => {
    try {
      const updatedDevices = devices.map((d) => {
        if (d._id !== device._id) {
          return { ...d, isConnected: false };
        }
        return d;
      });

      const updatedDevice = {
        ...device,
        isConnected: !device.isConnected,
      };

      await updateDevice(device._id, updatedDevice);

      updatedDevices.forEach(async (d) => {
        if (d._id !== device._id) {
          await updateDevice(d._id, d);
        }
      });
    } catch (error) {
      console.error("Connection toggle failed:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Your Devices</Text>
      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceStatus}>
                {item.relayState ? "ON" : "OFF"}
              </Text>
              <Text style={styles.deviceStatus}>
                {item.isConnected ? "Connected" : "Disconnected"}
              </Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <Switch
                value={item.isConnected}
                onValueChange={() => handleToggleConnection(item)}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditDevice(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDevice(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No devices added yet.</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Device</Text>
      </TouchableOpacity>

      {/* Add Device Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Device</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter device location"
              value={deviceLocation}
              onChangeText={setDeviceLocation}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addDeviceButton}
                onPress={handleAddDevice}
              >
                <Text style={styles.buttonText}>Add Device</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Device Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Device</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter device location"
              value={deviceLocation}
              onChangeText={setDeviceLocation}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addDeviceButton}
                onPress={handleUpdateDevice}
              >
                <Text style={styles.buttonText}>Update Device</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  deviceItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  deviceLocation: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyList: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 16,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  addDeviceButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 14,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
});

export default DevicesScreen;
