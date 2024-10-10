import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClassCard from "../../../components/ClassCard";
import ClassDetailsModal from "../../../components/ClassDetailsModal"; // Import the ClassDetailsModal
import { classes } from "../../data/classes";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const JustForYouPage = ({ filterText = "", searchBy = "" }) => {
  const [bmiResult, setBmiResult] = useState(null);
  const [justForYouClasses, setJustForYouClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // State for selected class
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0); // Duration in seconds

  useEffect(() => {
    const fetchProgress = async () => {
      const storedProgress = await AsyncStorage.getItem("userProgress");
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    };

    fetchProgress();

    // Cleanup the interval if the component unmounts
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  const refreshProgress = async () => {
    const storedProgress = await AsyncStorage.getItem("userProgress");
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  };

  const handleStartClass = async (classDuration, className) => {
    const completedClasses = JSON.parse(await AsyncStorage.getItem("completedClasses")) || [];
    
    // Check if the class has already been completed
    if (completedClasses.includes(className)) {
      Alert.alert("Class Already Completed", "You have already completed this class.");
      setModalVisible(false);
      return; // Exit if the class is already completed
    }
  
    setDuration(classDuration);
    setModalVisible(false);
    startCountdown(classDuration, className); // Pass className to the countdown
    refreshProgress();
  };

  const startCountdown = (duration) => {
    let timeLeft = duration;
  
    const interval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1; // Increase progress
          AsyncStorage.setItem("userProgress", JSON.stringify(newProgress)); // Ensure consistent key
          return newProgress;
        });
      } else {
        timeLeft -= 1; // Decrease the timer
      }
    }, 1000); // Update every second
  
    setCountdownInterval(interval); // Store interval ID for cleanup
  };

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
    // Clear the countdown if a class is not started
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null); // Reset countdown interval
    }
  };

  const handleDeleteProgress = async () => {
    Alert.alert(
      "Confirm Reset",
      "Are you sure you want to reset your progress?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userProgress");
              setProgress(0);
            } catch (error) {
              console.error("Error deleting BMI results:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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
    <View className="flex-1 justify-center items-center bg-white">
      {/* Progress Tracker */}
      <View className="p-4 bg-purple-400 rounded-xl w-full flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-white">
          Progress: {progress} Class(es) Completed
        </Text>
        <TouchableOpacity onPress={handleDeleteProgress} className="bg-white rounded-full p-2 w-auto items-center justify-center">
        <FontAwesome name="repeat" size={18} color="red" />
        </TouchableOpacity>

      </View>

      <Text className="text-xl font-bold mb-5">Classes Just For You</Text>
      {bmiResult && filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.Name}
          // contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <Text>No classes available for your BMI category.</Text>
      )}

      <ClassDetailsModal
        isVisible={isModalVisible}
        classDetails={selectedClass}
        onClose={handleCloseModal}
        onStartClass={handleStartClass} // Pass the function to start the class
      />
    </View>
  );
};

export default JustForYouPage;
