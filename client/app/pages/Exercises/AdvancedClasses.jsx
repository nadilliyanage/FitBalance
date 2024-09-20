import React from "react";
import { View, Text } from "react-native";
import ClassCard from "../../../components/ClassCard";
import { classes } from "../../data/classes";

const AdvancedClasses = ({ filterText = "", searchBy = "Name" }) => {
  // Filter Advanced classes based on filterText
  const filteredClasses = classes.Advanced.filter((classItem) => {
    const searchKey = searchBy === "Name" ? "Name" : "instructor";
    const searchValue = classItem[searchKey] || "";

    return searchValue.toLowerCase().includes(filterText.toLowerCase());
  });

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
          />
        ))
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text>No classes found</Text>
        </View>
      )}
    </View>
  );
};

export default AdvancedClasses;
