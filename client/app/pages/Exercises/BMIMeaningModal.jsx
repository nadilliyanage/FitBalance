import { BlurView } from "expo-blur";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const BMIMeaning = ({ isVisible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    ><BlurView
    intensity={180} // Adjust the intensity of the blur
    style={{ flex: 1 }} // Make sure it covers the entire modal
  >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-4/5 bg-white rounded-lg p-5 items-center">
          <Text className="text-2xl font-bold mb-2">What is BMI?</Text>
          <Text className="text-base mb-5">
            Body Mass Index (BMI) is a measure of body fat based on your height and weight. It is calculated by taking your weight in kilograms and dividing it by your height in meters squared (kg/m²).
            {"\n\n"}BMI is used to categorize individuals into weight categories:
            {"\n"}- Normal weight: BMI 18.5 – 24.9
            {"\n"}- Overweight: BMI 25 – 29.9
            {"\n"}- Obesity: BMI ≥ 30
          </Text>
          <TouchableOpacity onPress={onClose} className="bg-purple-600 rounded-lg p-2 w-full items-center">
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      </BlurView>
    </Modal>
  );
};

export default BMIMeaning;
