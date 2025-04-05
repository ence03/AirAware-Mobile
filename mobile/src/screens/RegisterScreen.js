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
import axios from "axios";
import useAuthStore from "../store/authStore";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(""); // Reset error message before attempting to register
    try {
      const response = await axios.post(
        "https://airaware.up.railway.app/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.data.success) {
        console.log("Registration successful:", response.data.message);

        // Optional: Automatically log the user in after registration
        setUser(response.data.user, response.data.token);
        navigation.navigate("login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Register an account</Text>
      <View style={styles.fields}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
          onPress={handleRegister}
          style={styles.btn}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoToLogin}>
          <Text style={styles.btn2Text}>
            Already have an account? Sign in here.
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

export default RegisterScreen;
