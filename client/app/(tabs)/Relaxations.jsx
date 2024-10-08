import { View, ScrollView, Text, Modal } from "react-native";
import React, { useState } from "react";
import CustomButtonLarge from "../../components/CustomButtonLarge";
import DailyStressQuiz from "../pages/Relaxations/DailyStressQuiz";
import { SafeAreaView } from "react-native-safe-area-context";
import SleepTracker from "../pages/Relaxations/SleepTracker"; // Import the SleepTracker component
import AlarmToggle from "../pages/Relaxations/AlarmToggle"; // Import the AlarmToggle component

const Relaxations = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <DailyStressQuiz />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex absolute w-full h-[20%] bg-secondary-100 rounded-b-2xl"></View>
        <View>
          <Text className="font-bold text-3xl text-center mt-6 text-white">
            Sleep & Relaxations
          </Text>
        </View>

        <View className="w-full min-h-[85vh] px-4 my-4">
          <CustomButtonLarge
            minititle="Join in "
            title="Daily Quiz"
            handlePress={() => setShowQuiz(true)}
            containerStyles="w-full mb-2 p-10"
          />
          <SleepTracker />
          <AlarmToggle />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Relaxations;
