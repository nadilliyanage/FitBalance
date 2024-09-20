import React from "react";
import { View } from "react-native";
import ClassCard from "../../../components/ClassCard";
const yoga_stretch = require("../../../assets/images/Exercises/yoga_stretch.jpeg");
const beginner_yoga = require("../../../assets/images/Exercises/beginner_yoga.jpg");

const BeginnerClasses = () => {
  return (
    <View className="mt-4">
      <ClassCard
        Name="Yoga Basics"
        instructor="Amantha"
        description="Learn the basics of yoga for flexibility and calmness."
        level="Beginner"
        duration="1 hour"
        image={yoga_stretch}
      />

      <ClassCard
        Name="Bodyweight Training"
        instructor="Sara"
        description="An introduction to exercises that require no equipment."
        level="Beginner"
        duration="1 hour"
        image={beginner_yoga}
      />
      <ClassCard
        Name="Stretch and Relax"
        instructor="John"
        description="Relax your muscles with gentle stretching exercises."
        level="Beginner"
        duration="1 hour"
        image={yoga_stretch}
      />
    </View>
  );
};

export default BeginnerClasses;
