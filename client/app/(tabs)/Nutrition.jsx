import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import HealthData from "../pages/Nutrition/HealthData";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const NutriCal = () => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEnterHealthData, setShowEnterHealthData] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const lastEntries = {
        calories: 850,
        protein: 85,
        fats: 50,
        carbs: 100,
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="px-6 py-8">
          {/* Header */}
          <Text className="text-2xl font-extrabold text-gray-900 mb-10 mt-8">
            Track your diet journey
          </Text>

          {/* Calorie Progress */}
          <View className="flex items-center mb-10 bg-blue-100 rounded-xl p-8 shadow-lg">
            <Text className="text-4xl font-bold text-blue-600">{calories} Kcal</Text>
            <Text className="text-base text-gray-500">of 2000 kcal</Text>

            {/* Macros */}
            <View className="flex-row justify-around w-full mt-8 mb-4">
              <View className="items-center bg-white rounded-lg p-4 shadow-md">
                <Text className="text-lg font-semibold text-blue-600">Protein</Text>
                <Text className="text-blue-400 font-bold text-lg">{protein}/90g</Text>
                <View className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <View
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(protein / 90) * 100}%` }}
                  />
                </View>
              </View>
              <View className="items-center bg-white rounded-lg p-4 shadow-md">
                <Text className="text-lg font-semibold text-pink-600">Fats</Text>
                <Text className="text-pink-400 font-bold text-lg">{fats}/70g</Text>
                <View className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <View
                    className="bg-pink-500 h-2 rounded-full"
                    style={{ width: `${(fats / 70) * 100}%` }}
                  />
                </View>
              </View>
              <View className="items-center bg-white rounded-lg p-4 shadow-md">
                <Text className="text-lg font-semibold text-yellow-600">Carbs</Text>
                <Text className="text-yellow-400 font-bold text-lg">{carbs}/110g</Text>
                <View className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <View
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(carbs / 110) * 100}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Food Suggestions Button */}
          <TouchableOpacity
            onPress={() => setShowEnterHealthData(true)}
            className="bg-blue-500 p-4 rounded-lg mb-8 shadow-md"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Food Suggestions
            </Text>
          </TouchableOpacity>

          {/* Row for Nutrition Calculator and Health Data buttons */}
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              onPress={() => setShowEnterHealthData(true)}
              className="bg-blue-500 h-36 w-36 rounded-lg shadow-md flex items-center justify-center"
            >
              <Icon name="clipboard" size={30} color="white" />
              <Text className="text-white text-lg text-center mt-1">Health Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCalculator(true)}
              className="bg-blue-500 h-36 w-36 rounded-lg shadow-md flex items-center justify-center"
            >
              <Icon name="calculator" size={30} color="white" />
              <Text className="text-white text-lg text-center mt-1">
                Nutrition Calculator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
