import { BlurView } from "expo-blur";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

const BMIMeaning = ({ isVisible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={180} // Adjust the intensity of the blur
        style={{ flex: 1 }} // Make sure it covers the entire modal
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-4/5 bg-white rounded-lg p-5 items-center">

            <Text className="text-2xl font-bold mb-2">What is BMI?</Text>
            <Text className="text-base mb-5 text-center">
              Body Mass Index (BMI) is a simple calculation used to assess
              whether a person has a healthy body weight for a given height. It
              is an indicator of body fat and is often used to screen for weight
              categories that may lead to health problems.
            </Text>

            <Text className="text-2xl font-bold mb-2">
              Why is BMI important?
            </Text>
            <Text className="text-base mb-5 text-center">
              BMI provides an easy-to-understand measure of body weight status,
              which can help individuals make informed decisions about their
              health. However, BMI does not directly measure body fat or muscle
              mass and should be considered alongside other health indicators.
            </Text>

            <Text className="text-2xl font-bold mb-2">Limitations of BMI:</Text>

            {/* Unordered List with Disk Icons */}
            <View className="flex flex-row items-start mb-2">
              <Icon name="circle" size={8} color="black" className="mr-2 mt-1" />
              <Text className="text-base flex-1">
                BMI does not account for muscle mass.
              </Text>
            </View>
            <View className="flex flex-row items-start mb-2">
              <Icon name="circle" size={8} color="black" className="mr-2 mt-1" />
              <Text className="text-base flex-1">
                BMI may not accurately reflect health for all body types.
              </Text>
            </View>
            <View className="flex flex-row items-start mb-2">
              <Icon name="circle" size={8} color="black" className="mr-2 mt-1" />
              <Text className="text-base flex-1">
                It may not distinguish between different types of fat distribution.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="bg-purple-600 rounded-lg p-2 w-full items-center"
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BMIMeaning;
