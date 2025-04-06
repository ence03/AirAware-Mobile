import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Save user and token, update state, and persist in AsyncStorage
  setUser: async (user, token) => {
    if (!user.id) {
      console.error("Error: User ID is missing in setUser.");
      return;
    }
    console.log("Setting user:", user);
    console.log("Setting token:", token);

    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("token", token);

    set({ user, token, isAuthenticated: true });

    console.log("User and token saved successfully.");
  },

  clearUser: async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
      console.log("User and token cleared successfully.");
    } catch (error) {
      console.error("Error clearing user/token from AsyncStorage:", error);
    }
  },

  checkAuth: async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (user && token) {
        set({ user: JSON.parse(user), token, isAuthenticated: true });
        console.log("User is authenticated.");
      } else {
        set({ user: null, token: null, isAuthenticated: false });
        console.log("No authenticated user found.");
      }
    } catch (error) {
      console.error("Error checking authentication state:", error);
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  loadAuthState: async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const storedToken = await AsyncStorage.getItem("token");

    if (storedUser && storedToken) {
      set({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
      });
      console.log("Auth state restored successfully.");
    } else {
      console.log("No stored auth state found.");
    }
  },
}));

export default useAuthStore;
