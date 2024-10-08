import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  minititle,
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary-300 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      {/* Conditionally render minititle if it exists */}
      {minititle && (
        <Text
          className={`text-primary font-pregular mr-32 text-xl ${textStyles}`}
        >
          {minititle}
        </Text>
      )}
      <Text className={`text-primary font-psemibold text-3xl ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
