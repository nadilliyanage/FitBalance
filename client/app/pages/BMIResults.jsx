import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from '@react-navigation/native'; // Use route to get the passed params

const BMIResults = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bmi, weight, height, age, gender } = route.params;

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-2xl font-bold">BMI Results</Text>
        <Text className="text-xl my-4">BMI: {bmi}</Text>
        <Text className="text-lg">Gender: {gender}</Text>
        <Text className="text-lg">Age: {age}</Text>
        <Text className="text-lg">Height: {height} cm</Text>
        <Text className="text-lg">Weight: {weight} kg</Text>

        {/* Button to go back */}
        <TouchableOpacity
          className="bg-purple-500 py-4 rounded-lg mt-5"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-center text-white text-lg font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BMIResults;
