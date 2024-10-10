import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  imageSource, // Optional image source
  imageStyle, // Optional image styles
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading} // Disable button when loading
      className={`bg-secondary rounded-xl h-[20%]  items-center flex-col ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <Text className={`text-primary font-psemibold text-xl  ${textStyles}`}>
        {title}
      </Text>
      <View className="absolute inset-x-0 -bottom-24 items-center">
        {imageSource && (
          <Image
            source={imageSource}
            style={[{ marginRight: 10 }, imageStyle]}
            resizeMode="contain"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
