import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import BMICalculator from "../pages/Exercises/BMICalculator";
import ExerciseMainPage from "../pages/Exercises/ExerciseMainPage";

const Exercises = () => {
  const [showBMICalculator, setShowBMICalculator] = useState(false);

  return (
    <SafeAreaView className="flex-1 pt-2">
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
      />
      {showBMICalculator ? (
        <BMICalculator />
      ) : (
        <ExerciseMainPage onBMIClick={() => setShowBMICalculator(true)} />
      )}
    </SafeAreaView>
  );
};

export default Exercises;
