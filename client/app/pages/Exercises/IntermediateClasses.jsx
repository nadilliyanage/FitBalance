import React from "react";
import { View } from "react-native";
import ClassCard from "../../../components/ClassCard";
const power_yoga = require("../../../assets/images/Exercises/power_yoga.jpeg");

const IntermediateClasses = () => {
  return (
    <View className="mt-4">
      <ClassCard
        Name="Power Yoga"
        instructor="Sophia"
        description="Increase strength and stamina through dynamic yoga."
        level="Intermediate"
        duration="1 hour"
        image={power_yoga}
      />
      <ClassCard
        Name="Functional Training"
        instructor="Max"
        description="Train your body for real-world activities."
        level="Intermediate"
        duration="1 hour"
        image={power_yoga}
      />
      <ClassCard
        Name="Pilates Fusion"
        instructor="Lucy"
        description="A balanced blend of Pilates and strength training."
        level="Intermediate"
        duration="1 hour"
        image={power_yoga}
      />
    </View>
  );
};

export default IntermediateClasses;
