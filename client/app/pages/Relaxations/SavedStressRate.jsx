import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Circle } from "react-native-svg"; // Importing Svg and Circle from react-native-svg
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const SavedStressRate = () => {
  const navigation = useNavigation(); // Get navigation object from hook
  const [stressData, setStressData] = useState(null);

  useEffect(() => {
    const fetchStressData = async () => {
      const savedStressRate = await AsyncStorage.getItem("stressRate");
      if (savedStressRate) {
        setStressData(JSON.parse(savedStressRate));
      }
    };

    // Fetch the data every time the component mounts
    fetchStressData();

    // Set up an interval to refresh data every 5 seconds
    const intervalId = setInterval(() => {
      fetchStressData();
    }, 5000); // Adjust the interval as needed (5000ms = 5 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Function to determine the color based on stress level
  const getStressColor = (level) => {
    if (level === "High Stress") return "text-red-600"; // Red
    if (level === "Moderate Stress") return "text-orange-500"; // Orange
    if (level === "Mid Stress") return "text-yellow-500"; // Yellow
    if (level === "Low Stress") return "text-green-500"; // Green
    return "text-gray-600"; // Default color if none match
  };

  // Function to determine the progress bar color based on stress level
  const getProgressBarColor = (level) => {
    if (level === "High Stress") return "#ff4d4d"; // Red
    if (level === "Moderate Stress") return "#ffcc00"; // Orange
    if (level === "Mid Stress") return "#ffff00"; // Yellow
    if (level === "Low Stress") return "#4caf50"; // Green
    return "#ccc"; // Default color if none match
  };

  if (!stressData) {
    return (
      <View className="p-4 bg-white rounded-lg shadow-md items-center">
        <TouchableOpacity onPress={() => navigation.navigate("Relaxations")}>
          <Text className="text-lg text-gray-600">
            Do the Daily Quiz to see Stress Rate
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate the percentage for the arc progress
  const circumference = 2 * Math.PI * 60; // Adjust radius as needed (60 is the radius)
  const percentage = Math.min(stressData.progress, 1); // Ensure progress is between 0 and 1
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <View className="p-4 bg-white rounded-lg shadow-md items-center">
      <TouchableOpacity onPress={() => navigation.navigate("Relaxations")}>
        <View className="items-center">
          <Text className={`text-lg font-bold`}>Stress Level</Text>

          {/* Circle Progress Bar using SVG */}
          <View className="mt-2">
            <Svg height={140} width={140}>
              <Circle
                cx="70" // Center x
                cy="70" // Center y
                r="60" // Radius of the circle
                stroke="#e5e7eb" // Background circle color
                strokeWidth="15"
                fill="none"
              />
              <Circle
                cx="70"
                cy="70"
                r="60"
                stroke={getProgressBarColor(stressData.level)} // Dynamic color based on stress level
                strokeWidth="15"
                fill="none"
                strokeDasharray={circumference} // Set the total circumference
                strokeDashoffset={strokeDashoffset} // Control the visible arc length
                rotation="-90" // Rotate to start from the top
                originX="70" // Center point x for rotation
                originY="70" // Center point y for rotation
              />
            </Svg>
            <Text className="absolute top-14 left-12 text-lg font-bold transform -translate-x-1/2 -translate-y-1/2">
              {Math.round(stressData.progress * 100)}%
            </Text>
          </View>
          <Text className={`text-lg ${getStressColor(stressData.level)}`}>
            {stressData.level}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SavedStressRate;
