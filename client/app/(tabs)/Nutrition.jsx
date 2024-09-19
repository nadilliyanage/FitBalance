import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import EnterHealthData from "../pages/Nutrition/HealthData";
import { SafeAreaView } from "react-native-safe-area-context";
import HealthData from "../pages/Nutrition/HealthData";

const NutriCal = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEnterHealthData, setShowEnterHealthData] = useState(false);

  if (showCalculator) {
    return <NutritionCalculator />; // Display the nutrition calculator directly
  }
  if (showEnterHealthData) {
    return <HealthData />; // Display the add health data directly
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <CustomButton
            title="Calculate Nutrition"
            handlePress={() => setShowCalculator(true)} // Set to Nutrition Calculator
            containerStyles="w-full"
          />
          <CustomButton
            title="Enter Health Data"
            handlePress={() => setShowEnterHealthData(true)} // Set to Enter Health Data
            containerStyles="w-full"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
