import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const ClassDetailsModal = ({ isVisible, classDetails, onClose }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!classDetails) return null;

  const renderTabContent = () => {
    switch (activeTab) {
    case "Overview":
      return (
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            About this Activity
          </Text>
          <Text className="text-base text-gray-600 mb-4">
              {classDetails.description}
            </Text>
          <Text className="text-base text-gray-600 mb-4">
            <Text className="font-bold">Prerequisites:</Text> {classDetails.prerequisites || "None"}
          </Text>
          <Text className="text-base text-gray-600">
            <Text className="font-bold">Additional Benefits:</Text> {classDetails.additionalBenefits || "None"}
          </Text>
        </View>
      );
    case "Instructor":
      return (
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Instructor Information
          </Text>
          <Text className="text-base text-gray-600 mb-2">
            <Text className="font-bold">Instructor:</Text> {classDetails.instructor}
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            <Text className="font-bold">Bio:</Text> {classDetails.instructorBio || "No bio available."}
          </Text>
        </View>
      );
    case "Reviews":
      return (
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Reviews
          </Text>
          {classDetails.reviews && classDetails.reviews.length > 0 ? (
            classDetails.reviews.map((review, index) => (
              <View key={index} className="mb-2">
                <Text className="text-base font-bold text-gray-700">
                  {review.reviewer}
                </Text>
                <Text className="text-base text-gray-500">
                  {review.comment}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-base text-gray-600">
              No reviews available yet.
            </Text>
          )}
        </View>
      );
    case "Requirements":
      return (
        <View className="px-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Requirements
          </Text>
          <Text className="text-base text-gray-600 mb-2">
            <Text className="font-bold">Equipment Needed:</Text> {classDetails.equipmentNeeded || "None"}
          </Text>
        </View>
      );
    default:
      return null;
  }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white">
        {/* Top Section with Back Arrow */}
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={onClose} className="mr-4">
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="flex-1 text-xl font-bold text-center text-gray-900">
            Activity Details
          </Text>
        </View>

        {/* Image and Class Info Section */}
        <View className="p-4">
          <View className="shadow-md rounded-lg bg-white">
            <Image
              source={classDetails.image}
              className="w-full h-48 rounded-t-lg"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-2xl text-secondary-100 font-bold">
                {classDetails.Name}
              </Text>
              <Text className="text-base text-gray-600">
                By {classDetails.instructor}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="gray"
                    className="mr-1"
                  />
                  <Text className="text-base text-gray-500">
                    {classDetails.duration}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600 mr-1">Ratings</Text>
                  <Feather name="star" size={16} color="gold" />
                  <Text className="text-base text-yellow-500 ml-1">4.5</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Section (Overview, Instructor, etc.) */}
        <View className="flex-row justify-between px-4 mb-4">
          {["Overview", "Instructor", "Reviews", "Requirements"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab ? "border-b-2 border-purple-500" : ""
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  activeTab === tab ? "text-purple-500" : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Content Based on Active Tab */}
        <ScrollView className="flex-1">{renderTabContent()}</ScrollView>

        {/* Start Now Button */}
        <View className="p-4">
          <TouchableOpacity
            className="bg-purple-600 py-3 rounded-full"
            onPress={() => {
              // Handle Start Now action
            }}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Start Now
            </Text>
          </TouchableOpacity>
        </View>
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
