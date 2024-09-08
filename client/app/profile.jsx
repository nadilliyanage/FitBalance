import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../constants";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

axios.defaults.baseURL = API_BASE_URL;

const Profile = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      await AsyncStorage.removeItem("@auth");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged out successfully",
      });

      router.push("/sign-in");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Logout failed",
      });
      console.error("Logout Error:", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Image
          source={icons.logout}
          resizeMode="contain"
          style={styles.logoutIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 20,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "red",
  },
});

export default Profile;
