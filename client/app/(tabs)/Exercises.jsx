import { View } from "react-native";
import React, { useState } from "react";
import BMICalculator from "../pages/BMICalculator";
import CustomButton from "../../components/CustomButton";

const Exercises = () => {
  const [showBMICalculator, setShowBMICalculator] = useState(false);

  if (showBMICalculator) {
    return <BMICalculator />;
  }

  return (
    <View className="flex-1 items-center pt-10">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <CustomButton
        title="Calculate BMI"
        handlePress={() => setShowBMICalculator(true)}
        containerStyles="w-4/5 mt-5"
      />
    </View>
  );
};

export default Exercises;
