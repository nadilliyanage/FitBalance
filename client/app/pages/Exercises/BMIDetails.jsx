// BMIDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur"; // Import BlurView
import { Feather } from '@expo/vector-icons';

const BMIDetails = ({ visible, onClose, onDelete }) => {
  const [bmiResult, setBmiResult] = useState(null);

  useEffect(() => {
    const fetchBMIDetails = async () => {
      try {
        const storedBMI = await AsyncStorage.getItem("bmiResult");
        if (storedBMI) {
          setBmiResult(JSON.parse(storedBMI));
        }
      } catch (error) {
        console.error("Error fetching BMI details:", error);
      }
    };

    fetchBMIDetails();
  }, []);

  const handleDeleteBMIResults = () => {
   Alert.alert(
     "Confirm Deletion",
     "Are you sure you want to delete your BMI results?",
     [
       {
         text: "Cancel",
         style: "cancel",
       },
       {
         text: "Delete",
         onPress: async () => {
           try {
             await AsyncStorage.removeItem("bmiResult");
             setBmiResult(null); // Clear local state
             onDelete(); // Call the callback to refresh ExerciseMainPage
             onClose(); // Close modal after deletion
           } catch (error) {
             console.error("Error deleting BMI results:", error);
           }
         },
       },
     ],
     { cancelable: true }
   );
 };

  if (!bmiResult) return null; // Don't render anything if no BMI result is available

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView
        intensity={180} // Adjust the intensity of the blur
        style={{ flex: 1 }} // Make sure it covers the entire modal
      >
        <View className="flex-1 justify-center items-center bg-transparent">
        <View className="bg-white w-11/12 p-6 rounded-lg shadow-lg">
            {/* Use flex-row to place heading and button in the same line */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Your BMI Results</Text>

              <TouchableOpacity
                onPress={handleDeleteBMIResults}
                className="bg-red-500 rounded-full p-2 w-1/6 items-center justify-center"
              >
               <Feather name="trash" size={18} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-lg">
              Your BMI is: <Text className="font-bold text-3xl text-secondary-300">{bmiResult.bmi}</Text>
            </Text>
            <Text className="text-lg">
              Weight: <Text className="font-bold">{bmiResult.weight} kg</Text>
            </Text>
            <Text className="text-lg">
              Age: <Text className="font-bold">{bmiResult.age}</Text>
            </Text>
            <Text className="text-lg">
              Height: <Text className="font-bold">{bmiResult.height} cm</Text>
            </Text>
            <Text className="text-lg">
              Gender: <Text className="font-bold">{bmiResult.gender}</Text>
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="mt-6 bg-purple-500 rounded-full p-2"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BMIDetails;
