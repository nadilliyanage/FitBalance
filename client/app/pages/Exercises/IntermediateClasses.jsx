import React, { useState } from "react";
import { View, Text } from "react-native";
import ClassCard from "../../../components/ClassCard";
import { classes } from "../../data/classes";
import ClassDetailsModal from "../../../components/ClassDetailsModal";

const IntermediateClasses = ({ filterText = "", searchBy = "Name" }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Filter Intermediate classes based on filterText
  const filteredClasses = classes.Intermediate.filter((classItem) => {
    const searchKey = searchBy === "Name" ? "Name" : "instructor";
    const searchValue = classItem[searchKey] || "";

    return searchValue.toLowerCase().includes(filterText.toLowerCase());
  });

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedClass(null);
  };

  return (
    <View style={{ marginTop: 16 }}>
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
      />
    </View>
  );
};

export default IntermediateClasses;