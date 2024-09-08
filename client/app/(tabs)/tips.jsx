import { View, Text, ScrollView, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import TipsForm from '../pages/Tips/TipsForm';

const Tips = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Tips</Text>
      <Text className="text-base mb-2">Tip 1: Stay hydrated throughout the day.</Text>
      <Text className="text-base mb-2">Tip 2: Eat a balanced diet with plenty of fruits and vegetables.</Text>
      <Text className="text-base mb-2">Tip 3: Exercise regularly to keep your body healthy.</Text>

      {/* Button to navigate back to the Home screen */}
      <Button title="Go to Tips Form" onPress={() => navigation.navigate('TipsForm')} />
    </View>
  );
};

export default Tips;
