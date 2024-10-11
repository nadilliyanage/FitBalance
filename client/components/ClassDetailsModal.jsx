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
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClassDetailsModal = ({
  isVisible,
  classDetails,
  onClose,
  onStartClass,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [remainingTime, setRemainingTime] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0); // New state to store original duration
  const [progress, setProgress] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (isVisible) {
        try {
          const savedProgress = await AsyncStorage.getItem("userProgress");
          if (savedProgress !== null) {
            setProgress(JSON.parse(savedProgress));
          } else {
            setProgress(0);
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
    if (countdownActive && !isPaused) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdownActive, isPaused]);

  const handleStartClass = () => {
    if (classDetails) {
      const durationInSeconds = Math.max(classDetails.duration || 0, 0);
      setOriginalDuration(durationInSeconds); // Set original duration
      setRemainingTime(durationInSeconds);
      setCountdownActive(true);
      setIsPaused(false);
    }
  };

  const handlePauseClass = () => {
    setIsPaused((prev) => !prev);
  };

  const handleResetClass = () => {
    setCountdownActive(false);
    setIsPaused(false);
    setRemainingTime(originalDuration); // Reset to original duration
  };

  const checkAndIncreaseProgress = async () => {
    if (classDetails) {
      const durationInSeconds = Math.max(classDetails.duration || 0, 0);
      if (remainingTime <= 0) {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1;
          saveProgressToStorage(newProgress);
          Alert.alert("Well done!", "You have completed a class!", [
            {
              text: "OK",
              onPress: () => {
                onClose();
                onStartClass(classDetails.duration, classDetails.Name);
              },
            },
          ]);
          return newProgress;
        });
      }
    }
  };

  const saveProgressToStorage = async (newProgress) => {
    try {
      await AsyncStorage.setItem("userProgress", JSON.stringify(newProgress));
    } catch (error) {
      console.error("Error saving progress to storage", error);
    }
  };

  useEffect(() => {
    if (remainingTime === 0 && countdownActive) {
      setCountdownActive(false);
      checkAndIncreaseProgress();
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
      <View className="flex-1 bg-white px-1">
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

        {/* Render the content of the active tab */}
        <ScrollView>{renderTabContent()}</ScrollView>

        {/* Countdown Timer and Buttons */}
        <View className="px-4 py-4">
          {countdownActive ? (
            <>
              <Text className="text-lg font-semibold text-center mb-4">Remaining Time: <Text className="text-3xl">{remainingTime} seconds</Text></Text>
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={handlePauseClass}
                  className="bg-purple-500 px-4 py-4 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name={isPaused ? "play-outline" : "pause-outline"} size={25} color="white" />
                  {/* <Text className="text-white font-bold text-base">{isPaused ? "Resume" : "Pause"}</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleResetClass} // Call reset function here
                  className="bg-red-500 px-4 py-4 rounded-lg"
                >
                  <FontAwesome name="repeat" size={25} color="white"/>
                  {/* <Text className="text-white">Reset</Text> */}
                </TouchableOpacity>
               </View>
            </>
          ) : (
            <TouchableOpacity onPress={handleStartClass} className="bg-secondary-100 px-4 py-4 rounded-lg flex-row items-center justify-center">
              <Feather name="play" size={25} color="white"/>
              <Text className="text-white text-center font-bold text-xl ml-4">Start Class</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Prop Types
ClassDetailsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  // classDetails: PropTypes.shape({
  //   Name: PropTypes.string.isRequired,
  //   description: PropTypes.string.isRequired,
  //   instructor: PropTypes.string.isRequired,
  //   instructorBio: PropTypes.string,
  //   duration: PropTypes.number.isRequired,
  //   equipmentNeeded: PropTypes.string,
  //   additionalBenefits: PropTypes.string,
  //   prerequisites: PropTypes.string,
  //   image: PropTypes.any.isRequired,
  //   reviews: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       reviewer: PropTypes.string.isRequired,
  //       comment: PropTypes.string.isRequired,
  //     })
  //   ),
  // }),
  onClose: PropTypes.func.isRequired,
  onStartClass: PropTypes.func.isRequired,
};

export default ClassDetailsModal;
