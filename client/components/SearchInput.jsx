import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setshowPassword] = useState(false);

  return (
    <View
      className="border-2 border-black-200 w-full h-16 px-4 
      bg-primary rounded-2xl focus:border-secondary-200 items-center flex-row space-x-4"
    >
      <TextInput
        className="text-base my-0.5 text-black flex-1 font-pregular"
        value={value}
        placeholder="Type to search"
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        secureTextEntry={title === "Password" && !showPassword}
      />

      <TouchableOpacity>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
