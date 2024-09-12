import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import { SafeAreaView } from "react-native-safe-area-context";

const NutriCal = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return <NutritionCalculator />; // Display the nutrition calculator directly
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
