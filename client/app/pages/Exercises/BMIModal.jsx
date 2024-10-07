import React, { useEffect, useRef, lazy, useState, Suspense } from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { BlurView } from "expo-blur";
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this library is installed

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
        return "#007bff"; // Blue
      case "Normal weight":
        return "#28a745"; // Green
      case "Overweight":
        return "#ffc107"; // Yellow
      case "Obesity":
        return "#dc3545"; // Red
      default:
        return "#ffffff"; // Default to white
    }
  };

  // Function to get chat bubble style
  const getChatBubbleStyle = (category) => {
    return {
      padding: 10,
      borderRadius: 8,
      backgroundColor: getCategoryColor(category),
      borderColor: getCategoryColor(category),
      borderWidth: 1,
      position: "relative",
      marginTop: 10, // Adjusted to ensure space below BMI value
    };
  };

  // Function to calculate the healthy weight range
  const calculateHealthyWeightRange = (height) => {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    // Calculate weight range based on BMI values of 18.5 to 24.9
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;
    return { minWeight: Math.round(minWeight), maxWeight: Math.round(maxWeight) };
  };

  // Determine the BMI category and color
  const bmiCategory = bmiResult ? getBMICategory(parseFloat(bmiResult.bmi)) : "";
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

  // Determine the font color for the BMI value
  const bmiFontColor = getCategoryColor(bmiCategory);

  // Calculate healthy weight range
  const healthyWeightRange = bmiResult ? calculateHealthyWeightRange(bmiResult.height) : { minWeight: 0, maxWeight: 0 };

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
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 8,
            width: 320,
            position: 'relative', // Ensure chat bubble is positioned relative to the modal content
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Your BMI:
          </Text>
          {bmiResult && (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 48,
                  fontWeight: "bold",
                  marginBottom: 8,
                  color: bmiFontColor, // Set the BMI font color based on category
                }}
              >
                {bmiResult.bmi}
              </Text>

              {/* BMI Category Message */}
              <View style={{ position: "relative", marginBottom: 16 }}>
                <View style={chatBubbleStyle}>
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {categoryMessage[bmiCategory]}
                  </Text>
                </View>

                {/* BMI Category Bar */}
                <View style={{ marginTop: 20 }}>
                  <View style={{ height: 10, flexDirection: "row" }}>
                    <View style={{ flex: 1, backgroundColor: "#007bff" }} />
                    <View style={{ flex: 2, backgroundColor: "#28a745" }} />
                    <View style={{ flex: 1, backgroundColor: "#ffc107" }} />
                    <View style={{ flex: 2, backgroundColor: "#dc3545" }} />
                  </View>
                </View>
              </View>

              {/* Display weight and height on the left side, age and gender on the right */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: "left", fontSize: 18, marginBottom: 8 }}>
                    Weight: {bmiResult.weight} kg
                  </Text>
                  <Text style={{ textAlign: "left", fontSize: 18, marginBottom: 8 }}>
                    Height: {bmiResult.height} cm
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ textAlign: "right", fontSize: 18, marginBottom: 8 }}>
                    Age: {bmiResult.age} years
                  </Text>
                  <Text style={{ textAlign: "right", fontSize: 18 }}>
                    Gender: {bmiResult.gender}
                  </Text>
                </View>
              </View>

              {/* Healthy Weight Range */}
              <View style={{ marginBottom: 8}}>
                <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 8, fontWeight: '600' }}>
                  Healthy Weight Range for Your Height:
                </Text>
                <Text style={{ textAlign: "center", fontSize: 22, fontWeight: 'bold' }}>
                  {healthyWeightRange.minWeight} - {healthyWeightRange.maxWeight} kg
                </Text>
              </View>

            </View>
          )}

          {/* Navigate Button */}
          <TouchableOpacity
            onPress={() => setBack(true)}
            style={{
              backgroundColor: "#28a745",
              paddingVertical: 8,
              borderRadius: 8,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                marginRight: 8
              }}
            >
              Let's Start Journey
            </Text>
            <Animated.View style={{ transform: [{ translateX: moveValue }] }}>
              <Icon name="arrow-right" size={20} color="white" />
            </Animated.View>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#6a0dad",
              paddingVertical: 8,
              borderRadius: 8,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BMIModal;
