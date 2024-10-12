import React, { useState } from "react";
import { View, Text } from "react-native";
import ClassCard from "../../../components/ClassCard";
import { classes } from "../../data/classes";
import ClassDetailsModal from "../../../components/ClassDetailsModal";

const AdvancedClasses = ({ filterText = "", searchBy = "Name" }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [duration, setDuration] = useState(0); 

  const filteredClasses = classes.Advanced.filter((classItem) => {
    const searchKey = searchBy === "Name" ? "Name" : "instructor";
    const searchValue = classItem[searchKey] || "";

    return searchValue.toLowerCase().includes(filterText.toLowerCase());
  });

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const handleStartClass = async (classDuration, className) => {
    setDuration(classDuration);
    setModalVisible(false);
    startCountdown(classDuration, className);
  };

  const startCountdown = (duration) => {
    let timeLeft = duration;
  
    const interval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(interval);
      } else {
        timeLeft -= 1; // Decrease the timer
      }
    }, 1000); // Update every second
  
    setCountdownInterval(interval); // Store interval ID for cleanup
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

  return (
    <View style={{ marginTop: 5 }}>
      {filteredClasses.length > 0 ? (
        filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem.Name}
            Name={classItem.Name}
            instructor={classItem.instructor}
            description={classItem.description}
            level={classItem.level}
            duration={classItem.duration}
            image={classItem.image}
            onPress={() => handleClassSelect(classItem)}
          />
        ))
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text>No classes found</Text>
        </View>
      )}

      <ClassDetailsModal
        isVisible={isModalVisible}
        classDetails={selectedClass}
        onClose={handleCloseModal}
        onStartClass={handleStartClass}
      />
    </View>
  );
};

export default AdvancedClasses;