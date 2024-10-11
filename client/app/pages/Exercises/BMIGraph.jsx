import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Circle } from "react-native-svg"; // Import Circle and Svg from react-native-svg
import { useNavigation } from "@react-navigation/native";

const BMIDetails = () => {
  const [bmiResult, setBmiResult] = useState(null);
  const navigation = useNavigation();

  const fetchBMIDetails = async () => {
    try {
      const storedBMI = await AsyncStorage.getItem("bmiResult");
      if (storedBMI) {
        const parsedBMI = JSON.parse(storedBMI);
        // Ensure BMI is a number
        parsedBMI.bmi = parseFloat(parsedBMI.bmi); // Convert the fetched BMI to a number
        setBmiResult(parsedBMI);
      }
    } catch (error) {
      console.error("Error fetching BMI details:", error);
    }
  };

  useEffect(() => {
    fetchBMIDetails(); // Initial fetch

    const intervalId = setInterval(fetchBMIDetails, 5000); // Update every 5 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, []);

  if (!bmiResult) {
    return (
      <View className="flex-1 justify-center items-center">
        <TouchableOpacity onPress={() => navigation.navigate("Exercises")}>
          <Text>Add Your BMI details to see the summary</Text>
        </TouchableOpacity>
      </View>
    ); // Show if no data is fetched
  }

  // Ensure BMI value is a number and valid
  const bmiValue =
    bmiResult.bmi && typeof bmiResult.bmi === "number"
      ? bmiResult.bmi.toFixed(1) // Format BMI to one decimal place
      : "N/A";

  // Function to get BMI status based on BMI value
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" }; // Blue
    if (bmi >= 18.5 && bmi < 24.9) return { label: "Normal", color: "#22c55e" }; // Green
    if (bmi >= 25 && bmi < 29.9)
      return { label: "Overweight", color: "#facc15" }; // Yellow
    return { label: "Obese", color: "#ef4444" }; // Red
  };

  const bmiStatus = getBMIStatus(bmiResult.bmi || 0);

  // Calculate the percentage for the arc progress
  const circumference = 2 * Math.PI * 50; // Adjust radius as needed
  const percentage = Math.min((bmiResult.bmi / 40) * 100, 100); // Prevent overflow
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="flex-1 justify-center items-center bg-white rounded-xl w-fit">
      <TouchableOpacity onPress={() => navigation.navigate("Exercises")}>
        <Text
          className={`text-lg font-bold text-center mt-2 ${bmiStatus.color}`}
        >
          Your BMI Value
        </Text>
        {/* Arc Progress Bar for BMI */}
        <View className="relative" style={{ marginTop: 5 }}>
          <Svg height={140} width={140}>
            <Circle
              cx="70"
              cy="70"
              r="60"
              stroke="#e5e7eb" // Background color of the circle
              strokeWidth="15"
              fill="none"
            />
            <Circle
              cx="70"
              cy="70"
              r="60"
              stroke={bmiStatus.color} // Use the valid hex color from bmiStatus
              strokeWidth="15"
              fill="none"
              strokeDasharray={circumference} // Set the total circumference
              strokeDashoffset={strokeDashoffset} // Control the visible arc length
              rotation="-90" // Rotate to start from the top
              originX="70"
              originY="70"
            />
          </Svg>

          {/* Displaying BMI value in the center of the circle */}
          <Text className="absolute top-14 left-12 text-lg font-bold transform -translate-x-1/2 -translate-y-1/2 ">
            {bmiValue}
          </Text>
        </View>

        <Text
          className={`text-lg font-semibold text-center`}
          style={{ color: bmiStatus.color }}
        >
          {bmiStatus.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BMIDetails;
