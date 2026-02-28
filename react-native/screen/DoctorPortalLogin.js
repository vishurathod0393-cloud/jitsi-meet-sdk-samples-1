import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function DoctorPortalLogin({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (!email || !password) {
      Alert.alert("Error", "Please enter Email and Password");
      return;
    }

    // Static Login (for now)
    if (email === "doctor@tia.com" && password === "123456") {
      navigation.replace("MainApp");
    } else {
      Alert.alert("Login Failed", "Invalid Credentials");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#071C2D" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={{ color: "#ffffff" }}>Tia</Text>
          <Text style={{ color: "#19B5FE" }}>Tele</Text>
        </Text>

        <Text style={styles.portalTag}>DOCTOR PORTAL</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>

        {/* Email */}
        <Text style={styles.label}>EMAIL / DOCTOR ID</Text>
        <View style={styles.inputContainer}>
          <Icon name="user" size={18} color="#8FA3B8" />
          <TextInput
            placeholder="Enter email or doctor id"
            placeholderTextColor="#8FA3B8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={18} color="#8FA3B8" />
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#8FA3B8"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Sign In */}
        <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Biometric */}
        <Text style={styles.orText}>or use</Text>

        <TouchableOpacity style={styles.bioBtn}>
          <Text style={styles.bioText}>👉 Face / Fingerprint</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#071C2D",
    justifyContent: "center",
    paddingHorizontal: 20
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40
  },

  logoText: {
    fontSize: 36,
    fontWeight: "bold"
  },

  portalTag: {
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#19B5FE",
    color: "#19B5FE",
    fontSize: 12,
    letterSpacing: 1
  },

  card: {
    backgroundColor: "#0F2A3D",
    borderRadius: 20,
    padding: 20
  },

  label: {
    color: "#8FA3B8",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 15,
    letterSpacing: 1
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12344D",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50
  },

  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 10
  },

  signInBtn: {
    backgroundColor: "#19B5FE",
    marginTop: 25,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

  orText: {
    textAlign: "center",
    color: "#8FA3B8",
    marginVertical: 15
  },

  bioBtn: {
    backgroundColor: "#1C3B52",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  bioText: {
    color: "#8FA3B8"
  }
});

