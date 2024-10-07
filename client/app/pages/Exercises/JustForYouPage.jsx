import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { classes } from '../../data/classes'; // Adjust the path to your classes data

const JustForYouPage = () => {
  const [bmiResult, setBmiResult] = useState(null);
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    const fetchBMIDetails = async () => {
      try {
        const storedBMI = await AsyncStorage.getItem('bmiResult');
        if (storedBMI) {
          const bmiData = JSON.parse(storedBMI);
          setBmiResult(bmiData);
          filterClasses(bmiData.bmi);
        }
      } catch (error) {
        console.error('Error fetching BMI details from local storage:', error);
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

    setFilteredClasses(recommendedClasses);
  };

  const renderClassItem = ({ item }) => (
    <View className="border p-3 rounded mb-2">
      <Text className="font-bold">{item.Name}</Text>
      <Text>Instructor: {item.instructor}</Text>
      <Text>{item.description}</Text>
      <Text>Level: {item.level}</Text>
      <Text>Duration: {item.duration}</Text>
    </View>
  );

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-xl font-bold mb-5">Classes Just For You</Text>
      {bmiResult && filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.Name}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text>No classes available for your BMI category.</Text> // Ensure this is wrapped in <Text>
      )}
      
    </View>
  );
};

export default JustForYouPage;
