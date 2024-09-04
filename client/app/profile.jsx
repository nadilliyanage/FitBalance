import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../constants";
import { signOut } from "../lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const Profile = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity
        className="w-full items-end mb-10 mt-10"
        onPress={logout}
      >
        <Image
          source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6"
          style={{ tintColor: "red" }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
