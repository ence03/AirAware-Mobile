import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "../axiosConfig";
import useAuthStore from "../store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://airaware.up.railway.app/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data;

        // Debugging logs
        console.log("Login response user:", user);
        console.log("Login response token:", token);

        // Save user and token to Zustand store
        await useAuthStore.getState().setUser(user, token);

        await AsyncStorage.setItem("token", token);
        console.log("Token saved to AsyncStorage");

        await useAuthStore.getState().checkAuth();

        navigation.navigate("home");
      } else {
        console.error("Login failed at server level.");
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate("register");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Login an account</Text>
      <View style={styles.fields}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.toggleButton}
          >
            <Icon
              name={isPasswordVisible ? "visibility-off" : "visibility"}
              size={30}
              color="#5073FA"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.btn}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {" "}
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoToRegister}>
          <Text style={styles.btn2Text}>
            Don't have an account? Register here.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
    color: "#5073FA",
    letterSpacing: 2,
  },
  fields: {
    width: "80%",
    alignSelf: "center",
    marginTop: 40,
    gap: 20,
  },
  input: {
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  btn: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#5073FA",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  btn2Text: {
    fontSize: 12,
    textAlign: "center",
  },
  toggleButton: {
    position: "absolute",
    right: 5,
    padding: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default LoginScreen;
