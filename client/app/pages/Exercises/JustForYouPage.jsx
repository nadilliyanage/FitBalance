import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassCard from "../../../components/ClassCard";
import ClassDetailsModal from "../../../components/ClassDetailsModal"; // Import the ClassDetailsModal
import { classes } from "../../data/classes";

const JustForYouPage = ({ filterText = "", searchBy = "" }) => {
  const [bmiResult, setBmiResult] = useState(null);
  const [justForYouClasses, setJustForYouClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // State for selected class
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchBMIDetails = async () => {
      try {
        const storedBMI = await AsyncStorage.getItem("bmiResult");
        if (storedBMI) {
          const bmiData = JSON.parse(storedBMI);
          setBmiResult(bmiData);
          filterClasses(bmiData.bmi);
        }
      } catch (error) {
        console.error("Error fetching BMI details from local storage:", error);
        Alert.alert("Error", "Failed to load BMI data.");
      }
    };

    fetchBMIDetails();
  }, []);

  const filterClasses = (bmi) => {
    let recommendedClasses;

    if (bmi < 18.5) {
      recommendedClasses = classes.Beginner; // Underweight -> Beginner classes
    } else if (bmi >= 18.5 && bmi < 24.9) {
      recommendedClasses = classes.Intermediate; // Healthy weight -> Intermediate classes
    } else if (bmi >= 25 && bmi < 29.9) {
      recommendedClasses = classes.Advanced; // Overweight -> Advanced classes
    } else {
      recommendedClasses = classes.Advanced; // Obese -> Recommend Advanced classes
    }

    setJustForYouClasses(recommendedClasses);
  };

  // Filtering the classes based on filterText and searchBy criteria
  const filteredClasses = justForYouClasses.filter((classItem) => {
    const searchKey = searchBy === "Name" ? "Name" : "instructor";
    const searchValue = classItem[searchKey] || "";

    return searchValue.toLowerCase().includes(filterText.toLowerCase());
  });

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedClass(null);
  };

  const renderClassItem = ({ item }) => (
    <ClassCard
      Name={item.Name}
      instructor={item.instructor}
      description={item.description}
      level={item.level}
      duration={item.duration}
      image={item.image}
      onPress={() => handleClassSelect(item)} // Use handleClassSelect
    />
  );

  return (
    <View className="flex-1 justify-center items-center bg-white py-5">
      <Text className="text-xl font-bold mb-5">Classes Just For You</Text>
      {bmiResult && filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.Name}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text>No classes available for your BMI category.</Text>
      )}

      <ClassDetailsModal
        isVisible={isModalVisible}
        classDetails={selectedClass}
        onClose={handleCloseModal} // Pass the close function
      />
    </View>
  );
};

export default JustForYouPage;
