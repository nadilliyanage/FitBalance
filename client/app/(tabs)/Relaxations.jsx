import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import DailyStressQuiz from "../pages/Relaxations/DailyStressQuiz";
import { SafeAreaView } from "react-native-safe-area-context";

const Relaxations = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <DailyStressQuiz />; // Display the quiz directly
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6">
          <CustomButton
            title="Go to Daily Quiz"
            handlePress={() => setShowQuiz(true)} // Set to show the quiz
            containerStyles="w-full mt-20"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Relaxations;
