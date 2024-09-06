import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import DailyStressQuiz from "../../components/DailyStressQuiz";

const Relaxations = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <DailyStressQuiz />; // Display the quiz directly
  }

  return (
    <View>
      <CustomButton
        title="Go to Daily Quiz"
        handlePress={() => setShowQuiz(true)} // Set to show the quiz
        containerStyles="w-full mt-20"
      />
    </View>
  );
};

export default Relaxations;
