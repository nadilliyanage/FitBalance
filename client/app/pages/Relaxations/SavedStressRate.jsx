import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
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

  return (
    <View className="p-4 bg-white rounded-lg shadow-md items-center">
      <TouchableOpacity onPress={() => navigation.navigate("Relaxations")}>
        {stressData ? (
          <View className="items-center">
            <Text className={`text-lg font-bold`}>Stress Level</Text>

            {/* Circle Progress Bar */}
            <View className="mt-2">
              <Progress.Circle
                progress={stressData.progress} // Progress should be a decimal (e.g., 0.75 for 75%)
                size={125} // Size of the circle
                thickness={15} // Thickness of the progress arc
                color={getProgressBarColor(stressData.level)} // Dynamic color based on stress level
                showsText={true} // Display the percentage inside the circle
                formatText={() => `${Math.round(stressData.progress * 100)}%`} // Custom text display
                textStyle={{ fontSize: 18, fontWeight: "bold" }} // Text style inside the circle
              />
            </View>
            <Text className={`text-lg  ${getStressColor(stressData.level)}`}>
              {stressData.level}
            </Text>
          </View>
        ) : (
          <Text className="text-lg text-gray-600">
            No saved stress data available.
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SavedStressRate;
