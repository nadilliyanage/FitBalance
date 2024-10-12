import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProgressTracker = () => {
  const [progress, setProgress] = useState(0); // Default progress value
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem("userProgress");
        if (storedProgress !== null) {
          const parsedProgress = JSON.parse(storedProgress);
          setProgress(parsedProgress);
        } else {
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    // Fetch initial progress
    fetchProgress();

    // Set up an interval to update the progress every 5 seconds
    const intervalId = setInterval(() => {
      fetchProgress();
    }, 5000); // Update interval in milliseconds (5000ms = 5 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  let progressMessage;
  if (progress === 0) {
    progressMessage = "Not Joined Classes";
  } else if (progress === 1) {
    progressMessage = "1 Class Completed";
  } else {
    progressMessage = `${progress} Classes Completed`;
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Exercises")}>
      <View className="p-2 bg-purple-400 rounded-xl w-full flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-white mx-2">
          Progress: {progressMessage}
        </Text>
        <Text className="mx-2">
          <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProgressTracker;
