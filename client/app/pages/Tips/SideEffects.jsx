import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SideEffectsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4">Major Side Effects</Text>
      <Text className="text-base mb-2">Major Side Effect 1: [Expand]</Text>
      <Text className="text-base mb-2">Major Side Effect 2: [Expand]</Text>

      <Text className="text-xl font-bold mt-4 mb-4">Minor Side Effects</Text>
      <Text className="text-base mb-2">Minor Side Effect 1: [Expand]</Text>
      <Text className="text-base mb-2">Minor Side Effect 2: [Expand]</Text>

      <Button title="Go to Treatments" onPress={() => navigation.navigate('Treatments')} />
    </ScrollView>
  );
}
