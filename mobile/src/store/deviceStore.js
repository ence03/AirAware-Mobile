import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";
import { io } from "socket.io-client";

const API_URL = "https://airaware.up.railway.app";
const socket = io("API_URL");

socket.on("deviceUpdated", (updatedDevice) => {
  set((state) => ({
    devices: state.devices.map((device) =>
      device._id === updatedDevice._id ? updatedDevice : device
    ),
  }));
});

const useDeviceStore = create((set, get) => ({
  devices: [],
  loading: false,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/device/`);
      set({ devices: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addDevice: async (device) => {
    set({ loading: true, error: null });
    try {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated || !user?.id)
        throw new Error("User is not authenticated or user ID is missing.");
      const response = await axios.post(
        `${API_URL}/api/device/`,
        { ...device, user: user.id },
        {
          headers: {
            Authorization: `Bearer ${get().token}`,
            "Content-Type": "application/json",
          },
        }
      );
      set((state) => ({
        devices: [...state.devices, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  updateDevice: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/api/device/${id}`, updates);
      const updatedDevice = response.data.data;

      socket.emit("updateDevice", updatedDevice);

      set((state) => ({
        devices: state.devices.map((device) =>
          device._id === id ? updatedDevice : device
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  deleteDevice: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/api/device/${id}`);

      // After deletion, we should check if the deleted device was the one marked as "isConnected: true"
      set((state) => {
        const deletedDevice = state.devices.find((device) => device._id === id);
        const updatedDevices = state.devices.filter(
          (device) => device._id !== id
        );

        // If the deleted device was the one connected, we should set another device to connected
        if (deletedDevice?.isConnected) {
          const nextDevice = updatedDevices.find(
            (device) => !device.isConnected
          );
          if (nextDevice) {
            nextDevice.isConnected = true;
          }
        }

        return {
          devices: updatedDevices,
          loading: false,
        };
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useDeviceStore;
