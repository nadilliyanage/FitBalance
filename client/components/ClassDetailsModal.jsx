import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const ClassDetailsModal = ({
  isVisible,
  classDetails,
  onClose,
  onStartClass,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0); // Track progress
  const [countdownActive, setCountdownActive] = useState(false); // Track countdown state

  // Load progress from AsyncStorage when the modal is visible
  useEffect(() => {
    const loadProgress = async () => {
      if (isVisible) {
        try {
          const savedProgress = await AsyncStorage.getItem("userProgress");
          if (savedProgress !== null) {
            setProgress(JSON.parse(savedProgress));
          } else {
            setProgress(0); // Reset progress if nothing is saved
          }
        } catch (error) {
          console.error("Error loading progress", error);
        }
      }
    };

    loadProgress();
  }, [isVisible]);

  useEffect(() => {
    let timer;
    if (countdownActive) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0; // Reset remaining time when countdown completes
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdownActive]);

  const handleStartClass = () => {
    const durationInSeconds = Math.max(classDetails.duration || 0, 0);
    setRemainingTime(durationInSeconds);
    setCountdownActive(true); // Start the countdown
  };

  const checkAndIncreaseProgress = async () => {
    const durationInSeconds = Math.max(classDetails.duration || 0, 0);
    if (remainingTime <= 0) {
      // Only increase progress if the class duration has completed
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        saveProgressToStorage(newProgress);
        Alert.alert("Well done!", "You have completed a class!", [
          {
            text: "OK",
            onPress: () => {
              onClose(); // Close the modal when OK is pressed
              onStartClass(classDetails.duration, classDetails.Name); // Refresh the JustForYouPage
            },
          },
        ]);
        return newProgress;
      });
    }
  };

  const saveProgressToStorage = async (newProgress) => {
    try {
      await AsyncStorage.setItem("userProgress", JSON.stringify(newProgress)); // Save progress
    } catch (error) {
      console.error("Error saving progress to storage", error);
    }
  };

  useEffect(() => {
    if (remainingTime === 0 && countdownActive) {
      setCountdownActive(false); // Stop countdown
      checkAndIncreaseProgress(); // Check and increase progress
    }
  }, [remainingTime, countdownActive]);

  if (!classDetails) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">About this Activity</Text>
            <Text className="text-base text-gray-600 mb-4">{classDetails.description}</Text>
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
            <Text className="text-lg font-semibold text-gray-800 mb-2">Instructor Information</Text>
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
            <Text className="text-lg font-semibold text-gray-800 mb-2">Reviews</Text>
            {classDetails.reviews && classDetails.reviews.length > 0 ? (
              classDetails.reviews.map((review, index) => (
                <View key={index} className="mb-2">
                  <Text className="text-base font-bold text-gray-700">{review.reviewer}</Text>
                  <Text className="text-base text-gray-500">{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text className="text-base text-gray-600">No reviews available yet.</Text>
            )}
          </View>
        );
      case "Requirements":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Requirements</Text>
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
          <Text className="flex-1 text-xl font-bold text-center text-gray-900">Activity Details</Text>
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
              <Text className="text-2xl text-secondary-100 font-bold">{classDetails.Name}</Text>
              <Text className="text-base text-gray-600">By {classDetails.instructor}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="gray" className="mr-1" />
                  <Text className="text-base text-gray-500">{classDetails.duration} seconds</Text>
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
              className={`pb-2 ${activeTab === tab ? "border-b-2 border-purple-500" : ""}`}
            >
              <Text
                className={`text-base font-semibold ${activeTab === tab ? "text-purple-500" : "text-gray-500"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Content Based on Active Tab */}
        <ScrollView className="flex-1">{renderTabContent()}</ScrollView>

        <View className="p-4">
          <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Time: <Text className="text-3xl">{Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}</Text>
          </Text>
        </View>

        {/* Start Now Button */}
        <View className="p-4">
          <TouchableOpacity
            className="bg-secondary-100 p-3 rounded-lg"
            onPress={handleStartClass}
          >
            <Text className="text-white text-2xl text-center font-bold">Start Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

ClassDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  // classDetails: PropTypes.shape({
  //   Name: PropTypes.string.isRequired,
  //   instructor: PropTypes.string.isRequired,
  //   description: PropTypes.string.isRequired,
  //   prerequisites: PropTypes.string,
  //   additionalBenefits: PropTypes.string,
  //   duration: PropTypes.number.isRequired,
  //   equipmentNeeded: PropTypes.string,
  //   reviews: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       reviewer: PropTypes.string.isRequired,
  //       comment: PropTypes.string.isRequired,
  //     })
  //   ),
  //   image: PropTypes.node.isRequired,
  // }).isRequired,
  onClose: PropTypes.func.isRequired,
  onStartClass: PropTypes.func.isRequired,
};

export default ClassDetailsModal;
