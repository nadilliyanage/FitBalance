import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import HealthData from "../pages/Nutrition/HealthData";
import FSuggetions from "../pages/Nutrition/FSuggest";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LastNutritionSummary from "../pages/Nutrition/Last"; // Adjust the path as needed
import LastNutritionSummary2 from "../pages/Nutrition/Last2";

const NutriCal = () => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEnterHealthData, setShowEnterHealthData] = useState(false);
  const [showFSuggetions, setShowFSuggetions] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const lastEntries = {
        calories: 0,
        protein: 0,
        fats: 0,
        carbs: 0,
      };
      setCalories(lastEntries.calories);
      setProtein(lastEntries.protein);
      setFats(lastEntries.fats);
      setCarbs(lastEntries.carbs);
    };
    fetchData();
  }, [showCalculator]);

  if (showCalculator) {
    return <NutritionCalculator />;
  }
  if (showEnterHealthData) {
    return <HealthData />;
  }
  if (showFSuggetions) {
    return <FSuggetions />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="px-6 py-8">
          {/* Header */}
          <Text className="text-2xl font-extrabold text-gray-900 mb-8 mt-2 text-center">
            Track your diet journey
          </Text>

          <View>
            {/* Other components of the screen */}
            <LastNutritionSummary2 />
            {/* Other components of the screen */}
          </View>

          {/* Food Suggestions Button */}
          <TouchableOpacity
            onPress={() => setShowFSuggetions(true)}
            className="bg-secondary-100 p-4 rounded-xl shadow-sm shadow-black mb-6 mt-4"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Food Suggestions
            </Text>
          </TouchableOpacity>

          {/* Row for Nutrition Calculator and Health Data buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setShowEnterHealthData(true)}
              className="bg-secondary-100 h-36 w-40 rounded-xl shadow-sm shadow-black flex items-center justify-center"
            >
              <Icon name="clipboard" size={30} color="white" />
              <Text className="text-white text-lg text-center mt-1">
                Health Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCalculator(true)}
              className="bg-secondary-100 h-36 w-40 rounded-xl shadow-sm shadow-black flex items-center justify-center"
            >
              <Icon name="calculator" size={30} color="white" />
              <Text className="text-white text-lg text-center mt-1">
                Nutrition
              </Text>
              <Text className="text-white text-lg text-center mt-1">
                Calculator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
