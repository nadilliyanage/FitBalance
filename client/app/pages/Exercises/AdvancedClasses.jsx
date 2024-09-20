import React from "react";
import { View } from "react-native";
import ClassCard from '../../../components/ClassCard';
const intensive_yoga = require('../../../assets/images/Exercises/intensive_yoga.jpg');

const AdvancedClasses = () => {
  return (
    <View className="mt-4">
      <ClassCard 
        Name="HIIT Extreme" 
        instructor="Jake" 
        description="High-Intensity Interval Training to push your limits." 
        level="Advanced" 
        duration="1 hour"
         image={intensive_yoga}
      />
      <ClassCard 
        Name="Advanced Strength" 
        instructor="Lily" 
        description="A class focused on heavy lifting and muscle building." 
        level="Advanced" 
        duration="1 hour"
         image={intensive_yoga}
      />
      <ClassCard 
        Name="Martial Arts Conditioning" 
        instructor="Bruce" 
        description="Get in shape with martial arts-inspired movements." 
        level="Advanced" 
        duration="1 hour"
         image={intensive_yoga}
      />
    </View>
  );
};

export default AdvancedClasses;
