import React, { useState, lazy, Suspense } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

const Recommendations = ({ stressLevel }) => {
  const [back, setBack] = useState(false);

  const getRecommendations = () => {
    switch (stressLevel) {
      case "High Stress Day":
        return ["Meditation", "Deep Breathing Exercises", "Gentle Yoga"];
      case "Moderate Stress Day":
        return ["Short Walks", "Listening to Music", "Journaling"];
      case "Mild Stress Day":
        return ["Reading", "Creative Hobbies", "Relaxing Bath"];
      default:
        return [
          "Take a moment to appreciate your day!",
          "Enjoy a favorite hobby.",
        ];
    }
  };

  const recommendations = getRecommendations();

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="flex-1 p-4 justify-center items-center">
            <Text className="text-xl font-bold mb-4">
              Relaxation Recommendations
            </Text>
            {recommendations.map((rec, index) => (
              <Text key={index} className="text-lg mb-2">
                - {rec}
              </Text>
            ))}
            <CustomButton
              title="Back to Relaxations"
              handlePress={() => setBack(true)}
              containerStyles="w-full mt-7"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Recommendations;
