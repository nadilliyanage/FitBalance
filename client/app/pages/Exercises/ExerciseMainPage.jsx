import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from "../../../components/CustomButton";
import BeginnerClasses from "./BeginnerClasses";
import IntermediateClasses from "./IntermediateClasses";
import AdvancedClasses from "./AdvancedClasses";

const ExerciseMainPage = ({ onBMIClick }) => {
  const [selectedLevel, setSelectedLevel] = useState("Beginner");

  const renderClasses = () => {
    switch (selectedLevel) {
      case "Beginner":
        return <BeginnerClasses />;
      case "Intermediate":
        return <IntermediateClasses />;
      case "Advanced":
        return <AdvancedClasses />;
      default:
        return <BeginnerClasses />;
    }
  };

  return (
    <ScrollView className="flex-1 px-5 pt-10 bg-white">
      {/* Calculate BMI Section */}
      <View className="items-center">
        <Text className="text-3xl font-bold text-center">Exercises</Text>

        <CustomButton
          title="Calculate BMI to Get Started"
          handlePress={onBMIClick}
          containerStyles="w-full mt-4 bg-purple-500"
          textStyle="text-white text-lg"
        />
      </View>

      {/* Level Selection Buttons (Scrollable) */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-6">
        <TouchableOpacity
          onPress={() => setSelectedLevel("Beginner")}
          className={`px-4 py-2 mx-2 rounded-full ${selectedLevel === "Beginner" ? "bg-purple-500" : "bg-white border border-gray-400"}`}
        >
          <Text className={selectedLevel === "Beginner" ? "text-white" : "text-black"}>Beginner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedLevel("Intermediate")}
          className={`px-4 py-2 mx-2 rounded-full ${selectedLevel === "Intermediate" ? "bg-purple-500" : "bg-white border border-gray-400"}`}
        >
          <Text className={selectedLevel === "Intermediate" ? "text-white" : "text-black"}>Intermediate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedLevel("Advanced")}
          className={`px-4 py-2 mx-2 rounded-full ${selectedLevel === "Advanced" ? "bg-purple-500" : "bg-white border border-gray-400"}`}
        >
          <Text className={selectedLevel === "Advanced" ? "text-white" : "text-black"}>Advanced</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-lg mt-5 px-3 py-2">
        <TextInput placeholder="Search by class or instructor" className="flex-1 text-gray-700" />
        <TouchableOpacity className="ml-2">
          <Icon name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Render the classes based on selected level */}
      {renderClasses()}
    </ScrollView>
  );
};

export default ExerciseMainPage;