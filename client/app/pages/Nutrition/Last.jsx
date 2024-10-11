import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LastNutritionSummary = () => {
  const [lastCalculation, setLastCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Initial load of the calculation data
    loadLastCalculation();

    // Set up an interval to refresh the data every 30 seconds (30000ms)
    const intervalId = setInterval(() => {
      loadLastCalculation();
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const loadLastCalculation = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem("pastCalculations");
      if (storedCalculations) {
        const calculationsArray = JSON.parse(storedCalculations);
        if (calculationsArray.length > 0) {
          const lastSavedCalculation = calculationsArray[0];
          setLastCalculation(lastSavedCalculation);
        }
      }
    } catch (error) {
      console.error("Failed to load past calculations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!lastCalculation) {
    return (
      <View className="flex-1 items-center justify-center bg-purple-200 rounded-xl p-5 shadow-lg">
        <TouchableOpacity onPress={() => navigation.navigate("Nutrition")}>
          <Text className="text-2xl font-bold text-purple-700 text-center">
            Add Foods to see the Summary
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { totalNutrition } = lastCalculation;
  const { calories, protein, fat, carbs } = totalNutrition;

  return (
    <View className="flex-1 items-center bg-purple-200 rounded-2xl p-4 shadow-lg mx-2 my-2">
      <TouchableOpacity onPress={() => navigation.navigate("Nutrition")}>
        <Text className={`text-lg font-bold text-center mb-1`}>
          Nutrients from your Previous Meal
        </Text>
        {/* Calorie Info */}
        {/* <Text className="text-6xl font-bold text-indigo-600">{calories.toFixed(2)} Kcal</Text>
      <Text className="text-xl font-bold text-gray-500">of 2000 kcal</Text> */}

        {/* Macros */}
        <View className="flex-row justify-around w-full mt-2">
          {/* Protein */}
          <View className="flex-1 bg-white rounded-lg p-4 mx-1 shadow-md items-center">
            <Text className="text-xl font-bold mb-2 text-blue-600">
              Protein
            </Text>
            <Text className="text-lg text-gray-700 ">{protein.toFixed(1)}</Text>
            <Text className="text-lg text-gray-700 mb-2 ">/ 90g</Text>
            <View className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(protein / 90) * 100}%`,
                  backgroundColor: "#4A90E2",
                }}
              />
            </View>
          </View>

          {/* Fats */}
          <View className="flex-1 bg-white rounded-lg p-4 mx-1 shadow-md items-center">
            <Text className="text-xl font-bold mb-2 text-pink-600">Fats</Text>
            <Text className="text-lg text-gray-700">{fat.toFixed(1)}</Text>
            <Text className="text-lg text-gray-700 mb-2">/ 70g</Text>
            <View className="w-full bg-gray-300 rounded-full h-2 overflow-hidden ">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(fat / 70) * 100}%`,
                  backgroundColor: "#D5006D",
                }}
              />
            </View>
          </View>

          {/* Carbs */}
          <View className="flex-1 bg-white rounded-lg p-4 mx-1 shadow-md items-center">
            <Text className="text-xl font-bold mb-2 text-yellow-600">
              Carbs
            </Text>
            <Text className="text-lg text-gray-700 ">{carbs.toFixed(1)}</Text>
            <Text className="text-lg text-gray-700 mb-2">/ 110g</Text>
            <View className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(carbs / 110) * 100}%`,
                  backgroundColor: "#FBC02D",
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LastNutritionSummary;
