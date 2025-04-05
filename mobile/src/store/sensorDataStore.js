import { create } from "zustand";
import axios from "axios";
import io from "socket.io-client";

// API Base URL
const API_URL = "https://airaware.up.railway.app";
const socket = io(API_URL);

export const useSensorDataStore = create((set) => ({
  latestData: null,
  isLoading: false,
  error: null,

  fetchLatestSensorData: async (authToken) => {
    set({ isLoading: true, error: null });

    try {
      console.log("Fetching sensor data...");

      const response = await axios.get(`${API_URL}/api/sensorData/latest`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // authorization token
        },
      });

      console.log("API Response:", response.data);

      if (!response.data || !response.data.data) {
        throw new Error("No sensor data available.");
      }

      set({ latestData: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error fetching latest sensor data:", errorMessage);
      set({
        error: errorMessage || "Failed to fetch sensor data.",
        isLoading: false,
      });
    }
  },

  listenForNewData: () => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("newSensorData", (newData) => {
      console.log("Received new sensor data:", newData);
      set({ latestData: newData });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  },
}));
