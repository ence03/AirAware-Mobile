import { create } from "zustand";
import axios from "axios";
import io from "socket.io-client";

const API_BASE_URL = "https://airaware.up.railway.app"; // API base URL
const socket = io(API_BASE_URL);

const useAverageStore = create((set) => ({
  averages: [],
  loading: false,
  error: null,

  // Action to fetch averages from the backend (hourly or daily)
  fetchAverages: async (type = "hourly") => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/average?type=${type}`
      );
      set({ averages: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action to create a new average and update the state
  createAverage: async (newAverageData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/average/`,
        newAverageData
      );
      if (response.data.success) {
        set((state) => ({
          averages: [...state.averages, response.data.data],
        }));
      }
    } catch (error) {
      console.error("Failed to create average:", error);
    }
  },

  // Action to start listening for new average data from the socket
  listenForNewData: () => {
    socket.off("newAvgData"); // Clear any existing listeners
    socket.on("newAvgData", (newAvgData) => {
      set((state) => ({
        averages: [...state.averages, newAvgData], // Add new average to the state
      }));
    });
  },

  // Action to calculate and send the hourly average
  calculateAndSendHourlyAverage: async () => {
    try {
      const pastHourData = await axios.get(
        `${API_BASE_URL}/api/sensordata?last=1hour`
      );
      const sensorData = pastHourData.data;

      if (!Array.isArray(sensorData) || sensorData.length === 0) {
        console.log("[Warning] No data available for the past hour.");
        return;
      }

      const avgTemperature =
        sensorData.reduce((sum, data) => sum + data.temperature, 0) /
        sensorData.length;
      const avgHumidity =
        sensorData.reduce((sum, data) => sum + data.humidity, 0) /
        sensorData.length;
      const avgTVOC =
        sensorData.reduce((sum, data) => sum + data.tvoc, 0) /
        sensorData.length;
      const airQualityStatus =
        avgTemperature > 30 ? "Bad" : avgHumidity > 60 ? "Fair" : "Good";

      const newAverageData = {
        type: "hourly",
        avgTemperature,
        avgHumidity,
        avgTVOC,
        airQualityStatus,
      };

      set({ loading: true });
      const response = await axios.post(
        `${API_BASE_URL}/api/average`,
        newAverageData
      );

      if (response.data.success) {
        set({ loading: false });
        socket.emit("newAvgData", response.data.data); // Emit new average data to clients
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  // Action to calculate and send the daily average
  calculateAndSendDailyAverage: async () => {
    try {
      const pastDayData = await axios.get(
        `${API_BASE_URL}/api/sensordata?last=24hours`
      );
      const sensorData = pastDayData.data;

      if (!Array.isArray(sensorData) || sensorData.length === 0) {
        console.log("No data available for the past 24 hours.");
        return;
      }

      const avgTemperature =
        sensorData.reduce((sum, data) => sum + data.temperature, 0) /
        sensorData.length;
      const avgHumidity =
        sensorData.reduce((sum, data) => sum + data.humidity, 0) /
        sensorData.length;
      const avgTVOC =
        sensorData.reduce((sum, data) => sum + data.tvoc, 0) /
        sensorData.length;
      const airQualityStatus =
        avgTemperature > 30 ? "Bad" : avgHumidity > 60 ? "Fair" : "Good";

      const newAverageData = {
        type: "daily",
        avgTemperature,
        avgHumidity,
        avgTVOC,
        airQualityStatus,
      };

      set({ loading: true });
      const response = await axios.post(
        `${API_BASE_URL}/api/average`,
        newAverageData
      );

      if (response.data.success) {
        set({ loading: false });
        socket.emit("newAvgData", response.data.data); // Emit new average data to clients
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useAverageStore;
