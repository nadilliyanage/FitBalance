import React from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Feather } from '@expo/vector-icons'; // Ensure you have this package installed

const ClassDetailsModal = ({ isVisible, classDetails, onClose }) => {
  if (!classDetails) return null; // Return null if no class details are passed

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 p-6 bg-white relative">
        {/* Back Arrow Icon */}
        <TouchableOpacity
          onPress={onClose}
          style={{ position: 'absolute', top: 30, left: 26, zIndex: 1 }}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-4 text-center">
          {classDetails.Name}
        </Text>

        <Image
          source={classDetails.image}
          className="w-full h-40 rounded-lg mb-4"
          resizeMode="cover"
        />

        <Text className="text-lg mb-2">
          <Text className="font-bold">Instructor: </Text>
          {classDetails.instructor}
        </Text>
        
        <Text className="text-lg mb-2">
          <Text className="font-bold">Description: </Text>
          {classDetails.description}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Duration: </Text>
          {classDetails.duration}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Level: </Text>
          {classDetails.level}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Class Type: </Text>
          {classDetails.classType}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Intensity: </Text>
          {classDetails.intensity}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Equipment Needed: </Text>
          {classDetails.equipmentNeeded || "None"}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Prerequisites: </Text>
          {classDetails.prerequisites || "None"}
        </Text>

        <Text className="text-lg mb-2">
          <Text className="font-bold">Additional Benefits: </Text>
          {classDetails.additionalBenefits || "None"}
        </Text>

        {/* Start Now Button */}
        <TouchableOpacity
          onPress={() => {
            // Handle start now action
          }}
          className="bg-blue-500 py-3 px-6 rounded-full mt-6"
        >
          <Text className="text-white text-center text-lg font-semibold">Start Now</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

ClassDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  classDetails: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ClassDetailsModal;
