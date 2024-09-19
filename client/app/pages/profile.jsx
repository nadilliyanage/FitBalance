import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../../constants";
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
      // Perform the API logout request
      await axios.post("/auth/logout");

      // Remove the authentication token from AsyncStorage
      await AsyncStorage.removeItem("@auth");

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged out successfully",
      });

      // Navigate to the sign-in page
      router.replace("/sign-in"); // replace prevents back navigation to profile
    } catch (error) {
      // Show error toast if logout fails
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Logout failed",
      });

      // Log detailed error information for debugging
      console.error("Logout Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center mt-5 px-5">
      <TouchableOpacity className="self-end my-5" onPress={logout}>
        <Image
          source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6 tint-red-500"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
