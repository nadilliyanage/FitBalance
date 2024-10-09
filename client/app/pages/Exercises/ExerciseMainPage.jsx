import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../../components/CustomButton";
import BeginnerClasses from "./BeginnerClasses";
import IntermediateClasses from "./IntermediateClasses";
import AdvancedClasses from "./AdvancedClasses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JustForYouPage from "./JustForYouPage";
import BMIDetails from "./BMIDetails";

const ExerciseMainPage = ({ onBMIClick }) => {
  const [selectedLevel, setSelectedLevel] = useState("Beginner"); // Default is Beginner
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("Name");
  const [hasBMIResult, setHasBMIResult] = useState(false); // Track if BMI result exists
  const [showBMIDetails, setShowBMIDetails] = useState(false); // State to toggle BMI details
  const [bmiResult, setBmiResult] = useState(null); // Store the BMI result

  useEffect(() => {
    checkBMIResult();
  }, []);

  const checkBMIResult = async () => {
    try {
      const result = await AsyncStorage.getItem("bmiResult");
      const hasResult = !!result;
      setHasBMIResult(hasResult);
      setBmiResult(result); // Set the BMI result if it exists

      // If BMI result exists, set "JustForYou" as the default tab
      if (hasResult) {
        setSelectedLevel("JustForYou");
      } else {
        setSelectedLevel("Beginner"); // Default to Beginner if no BMI result
      }
    } catch (error) {
      console.error("Error retrieving BMI result from AsyncStorage", error);
    }
  };

  const renderClasses = () => {
    switch (selectedLevel) {
      case "JustForYou":
        return <JustForYouPage filterText={searchText} searchBy={searchBy} />;
      case "Beginner":
        return <BeginnerClasses filterText={searchText} searchBy={searchBy} />;
      case "Intermediate":
        return (
          <IntermediateClasses filterText={searchText} searchBy={searchBy} />
        );
      case "Advanced":
        return <AdvancedClasses filterText={searchText} searchBy={searchBy} />;
      default:
        return <BeginnerClasses filterText={searchText} searchBy={searchBy} />;
    }
  };

  const handleBMIResultClick = () => {
    setShowBMIDetails(true); // Show the BMI details
  };

  return (
    <View className="flex-1 px-5 pt-10 bg-white">
      <View className="items-center">
        <Text className="text-3xl font-bold text-center">Exercises</Text>

        {!hasBMIResult && (
          <CustomButton
            title="Calculate BMI to Get Started"
            handlePress={onBMIClick}
            containerStyles="w-full mt-4 bg-purple-500"
            textStyle="text-white text-lg"
          />
        )}

        {hasBMIResult && (
          <View className="flex-row justify-between mt-4">
            <CustomButton
              title="Calculate BMI"
              handlePress={onBMIClick}
              containerStyles="flex-1 bg-purple-500 rounded-xl p-2 mr-2"
              textStyle="text-white text-lg text-center"
            />
            <TouchableOpacity
              onPress={handleBMIResultClick}
              className="p-2 rounded-xl w-1/3 border-2 border-secondary-100"
            >
              <Text className="text-secondary-100 font-bold text-base text-center my-auto">
                BMI Results
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tab selection */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="mt-6 h-16 flex"
      >
        {/* Conditionally render the "Just for You" tab */}
        {hasBMIResult && (
          <TouchableOpacity
            onPress={() => setSelectedLevel("JustForYou")}
            className={`px-4 py-2 mx-2 rounded-full h-10 ${
              selectedLevel === "JustForYou"
                ? "bg-purple-500"
                : "bg-white border border-gray-400"
            }`}
          >
            <Text
              className={
                selectedLevel === "JustForYou" ? "text-white" : "text-black"
              }
            >
              Just for You
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setSelectedLevel("Beginner")}
          className={`px-4 py-2 mx-2 rounded-full h-10 ${
            selectedLevel === "Beginner"
              ? "bg-purple-500"
              : "bg-white border border-gray-400"
          }`}
        >
          <Text
            className={
              selectedLevel === "Beginner" ? "text-white" : "text-black"
            }
          >
            Beginner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedLevel("Intermediate")}
          className={`px-4 py-2 mx-2 rounded-full h-10 ${
            selectedLevel === "Intermediate"
              ? "bg-purple-500"
              : "bg-white border border-gray-400"
          }`}
        >
          <Text
            className={
              selectedLevel === "Intermediate" ? "text-white" : "text-black"
            }
          >
            Intermediate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedLevel("Advanced")}
          className={`px-4 py-2 mx-2 rounded-full h-10 ${
            selectedLevel === "Advanced"
              ? "bg-purple-500"
              : "bg-white border border-gray-400"
          }`}
        >
          <Text
            className={
              selectedLevel === "Advanced" ? "text-white" : "text-black"
            }
          >
            Advanced
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed search field and dropdown */}
      <View className="flex-row items-center mt-5 mb-2">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Icon name="search" size={20} color="black" />
          <TextInput
            placeholder={`Search by ${searchBy}`}
            className="flex-1 text-gray-700 ml-2"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => setSearchText("")} className="ml-2">
            <Icon name="times" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="ml-3 mr-[-10]" style={{ width: 160 }}>
          <Picker
            selectedValue={searchBy}
            style={{ height: 30, width: "100%" }}
            onValueChange={(itemValue) => setSearchBy(itemValue)}
          >
            <Picker.Item label="By Class Name" value="Name" />
            <Picker.Item label="By Instructor" value="Instructor" />
          </Picker>
        </View>
      </View>

      {/* BMI Details Modal */}
      {showBMIDetails && (
        <BMIDetails
          visible={showBMIDetails}
          onClose={() => setShowBMIDetails(false)}
          onDelete={checkBMIResult} // Refresh after deletion
        />
      )}

      {/* Use FlatList to render the class components */}
      <FlatList
        data={[selectedLevel]} // Use the selected level as a single data point
        renderItem={() => renderClasses()} // Render classes based on the selected level
        keyExtractor={(item) => item} // Simple key extractor
        scrollEnabled={true} // Disable scrolling since we already have a ScrollView for the top content
      />
    </View>
  );
};

export default ExerciseMainPage;
