import { View, ScrollView, Text, Modal } from "react-native";
import React, { useState } from "react";
import CustomButtonLarge from "../../components/CustomButtonLarge";
import CustomButton from "../../components/CustomButton";
import CustomHalfButton from "../../components/CustomHalfButton";
import SleepButton from "../../components/SleepButton";
import DailyStressQuiz from "../pages/Relaxations/DailyStressQuiz";
import { SafeAreaView } from "react-native-safe-area-context";
import SleepTracker from "../pages/Relaxations/SleepTracker";
import AlarmToggle from "../pages/Relaxations/AlarmToggle";
import MindfulMusic from "../pages/Relaxations/MindfulMusic";
import Recommendations from "../pages/Relaxations/Recommendations";
import { useNavigation } from "@react-navigation/native"; // React Navigation

const Relaxations = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigation = useNavigation(); // Navigation hook

  if (showQuiz) {
    return <DailyStressQuiz />;
  }
  if (showMusic) {
    return <MindfulMusic />;
  }
  if (showRecommendations) {
    return <Recommendations />;
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
          <CustomButton
            title="Recommendations"
            handlePress={() => setShowRecommendations(true)}
            containerStyles="w-full mb-2 "
          />
          <View className="flex flex-row">
            <CustomHalfButton
              minititle="Mindful "
              title="Music"
              handlePress={() => setShowMusic(true)}
              containerStyles=" m-1 p-6"
            />
            <CustomHalfButton
              minititle="Mindful "
              title="Videos"
              handlePress={() => setShowMusic(true)}
              containerStyles=" m-1 p-6"
            />
          </View>
          <SleepButton
            title="Sleep Analysis"
            handlePress={() => console.log("Button Pressed")}
            containerStyles="w-full p-10 mt-2"
            textStyles="text-white"
            isLoading={false}
            imageSource={require("../../assets/images/sleep.png")} // Add your image here
            imageStyle={{ width: 300, height: 300 }} // Adjust the image size
          />
          {/* <SleepTracker /> */}
          <AlarmToggle />
          {/* Add Mindful Music Button */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Relaxations;
