import React, { useEffect, useRef, lazy, useState, Suspense } from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome"; // Ensure this library is installed

const LazyExercices = lazy(() => import("../../(tabs)/Exercises"));

const BMIModal = ({ visible, onClose, bmiResult, navigation }) => {
  const moveValue = useRef(new Animated.Value(0)).current;
  const [back, setBack] = useState(false);

  // Define the horizontal movement animation
  const moveAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(moveValue, {
        toValue: 10, // Move 10 units to the right
        duration: 500, // Duration for the movement
        useNativeDriver: true,
      }),
      Animated.timing(moveValue, {
        toValue: 0, // Return to the original position
        duration: 500, // Duration for the return
        useNativeDriver: true,
      }),
    ])
  );

  // Start the animation when the component mounts
  useEffect(() => {
    moveAnimation.start();
  }, [moveAnimation]);

  // Function to determine the BMI category based on BMI value
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  // Function to get color based on BMI category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal weight":
        return "text-green-600";
      case "Overweight":
        return "text-yellow-500";
      case "Obesity":
        return "text-red-600";
      default:
        return "text-white";
    }
  };

  // Function to get chat bubble style
  const getChatBubbleStyle = (category) => {
    const baseStyles = "p-3 rounded-lg";
    switch (category) {
      case "Underweight":
        return `${baseStyles} bg-blue-500`;
      case "Normal weight":
        return `${baseStyles} bg-green-600`;
      case "Overweight":
        return `${baseStyles} bg-yellow-500`;
      case "Obesity":
        return `${baseStyles} bg-red-600`;
      default:
        return `${baseStyles} bg-white`;
    }
  };

  // Function to calculate the healthy weight range
  const calculateHealthyWeightRange = (height) => {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    // Calculate weight range based on BMI values of 18.5 to 24.9
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;
    return {
      minWeight: Math.round(minWeight),
      maxWeight: Math.round(maxWeight),
    };
  };

  // Determine the BMI category and color
  const bmiCategory = bmiResult
    ? getBMICategory(parseFloat(bmiResult.bmi))
    : "";
  const chatBubbleStyle = getChatBubbleStyle(bmiCategory);

  // Message based on BMI category
  const categoryMessage = {
    Underweight:
      "You are underweight. Consider consulting with a healthcare provider.",
    "Normal weight":
      "Your weight is normal. Keep maintaining a healthy lifestyle.",
    Overweight:
      "You are overweight. It might be beneficial to review your diet and exercise.",
    Obesity:
      "You are in the obesity range. It's important to consult with a healthcare provider for advice.",
  };

  // Calculate healthy weight range
  const healthyWeightRange = bmiResult
    ? calculateHealthyWeightRange(bmiResult.height)
    : { minWeight: 0, maxWeight: 0 };

  // Navigation function
  const handleNavigate = () => {
    navigation.navigate("/ExercisePage"); // Replace "ExercisePage" with your actual route name
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyExercices />
      </Suspense>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        tint="light"
        intensity={100}
        className="flex-1 justify-center items-center"
      >
        <View className="bg-white p-4 rounded-2xl w-80 shadow-2xl shadow-black">
          <Text className="text-center text-2xl font-bold mb-4">Your BMI:</Text>
          {bmiResult && (
            <View>
              <Text
                className={`text-center text-6xl font-bold mb-2 ${getCategoryColor(
                  bmiCategory
                )}`}
              >
                {bmiResult.bmi}
              </Text>

              {/* BMI Category Message */}
              <View className="relative mb-4">
                <View className={chatBubbleStyle}>
                  <Text className="text-white text-center">
                    {categoryMessage[bmiCategory]}
                  </Text>
                </View>
              </View>

              {/* Display weight and height on the left side, age and gender on the right */}
              <View className="flex-row justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-left text-lg mb-2">
                    Weight:{" "}
                    <Text className="font-bold"> {bmiResult.weight} kg</Text>
                  </Text>
                  <Text className="text-left text-lg mb-2">
                    Height:{" "}
                    <Text className="font-bold">{bmiResult.height} cm</Text>
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-right text-lg mb-2">
                    Age:{" "}
                    <Text className="font-bold">{bmiResult.age} years</Text>
                  </Text>
                  <Text className="text-right text-lg">
                    Gender:{" "}
                    <Text className="font-bold">{bmiResult.gender}</Text>
                  </Text>
                </View>
              </View>

              {/* Healthy Weight Range */}
              <View className="mb-2">
                <Text className="text-center text-lg mb-2 font-semibold">
                  Healthy Weight Range for Your Height:
                </Text>
                <Text className="text-center text-2xl font-bold">
                  {healthyWeightRange.minWeight} -{" "}
                  {healthyWeightRange.maxWeight} kg
                </Text>
              </View>
            </View>
          )}

          {/* Navigate Button */}
          <TouchableOpacity
            onPress={() => setBack(true)}
            className="bg-green-600 py-2 rounded-lg mt-4 flex-row items-center justify-center"
          >
            <Text className="text-white font-bold text-lg mr-2">
              Let's Start Journey
            </Text>
            <Animated.View style={{ transform: [{ translateX: moveValue }] }}>
              <Icon name="arrow-right" size={20} color="white" />
            </Animated.View>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-purple-700 py-2 rounded-lg mt-4"
          >
            <Text className="text-center text-white font-bold text-lg">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BMIModal;
