// ProgressTracker.js

import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ProgressTracker = ({ progress, onDeleteProgress }) => {
  const handleDeleteProgress = async () => {
    Alert.alert(
      "Confirm Reset",
      "Are you sure you want to reset your progress?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userProgress");
              onDeleteProgress(0); // Call the callback to reset progress in parent
            } catch (error) {
              console.error("Error deleting progress:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="p-4 bg-purple-400 rounded-xl w-full flex-row justify-between items-center mb-2">
      <Text className="text-lg font-semibold text-white">
        Progress: {progress} Class(es) Completed
      </Text>
      <TouchableOpacity 
        onPress={handleDeleteProgress} 
        className="bg-white rounded-full p-2 w-auto items-center justify-center"
      >
        <FontAwesome name="repeat" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default ProgressTracker;
