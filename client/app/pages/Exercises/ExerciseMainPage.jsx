import React, { useState } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from "../../../components/CustomButton";
import BeginnerClasses from "./BeginnerClasses";
import IntermediateClasses from "./IntermediateClasses";
import AdvancedClasses from "./AdvancedClasses";

const ExerciseMainPage = ({ onBMIClick }) => {
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("Name");

  const renderClasses = () => {
    switch (selectedLevel) {
      case "Beginner":
        return <BeginnerClasses filterText={searchText} searchBy={searchBy} />;
      case "Intermediate":
        return <IntermediateClasses filterText={searchText} searchBy={searchBy} />;
      case "Advanced":
        return <AdvancedClasses filterText={searchText} searchBy={searchBy} />;
      default:
        return <BeginnerClasses filterText={searchText} searchBy={searchBy} />;
    }
  };

  return (
    <ScrollView className="flex-1 px-5 pt-10 bg-white">
      <View className="items-center">
        <Text className="text-3xl font-bold text-center">Exercises</Text>

        <CustomButton
          title="Calculate BMI to Get Started"
          handlePress={onBMIClick}
          containerStyles="w-full mt-4 bg-purple-500"
          textStyle="text-white text-lg"
        />
      </View>

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

      <View className="flex-row items-center mt-5">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Icon name="search" size={20} color="black" />
          <TextInput 
            placeholder={`Search by ${searchBy}`} 
            className="flex-1 text-gray-700 ml-2"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity 
            onPress={() => setSearchText('')}
            className="ml-2"
          >
            <Icon name="times" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="ml-3 mr-[-10]" style={{ width: 150 }}>
          <Picker
            selectedValue={searchBy}
            style={{ height: 30, width: '100%' }}
            onValueChange={(itemValue) => setSearchBy(itemValue)}
          >
            <Picker.Item label="By Class Name" value="Name" />
            <Picker.Item label="By Instructor" value="Instructor" />
          </Picker>
        </View>
      </View>

      {renderClasses()}
    </ScrollView>
  );
};

export default ExerciseMainPage;
