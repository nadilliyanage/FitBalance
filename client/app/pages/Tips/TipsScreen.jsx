import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TipsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4">Tips for Selected Disease</Text>
      <Text className="text-base mb-2">Tip 1: [Expand]</Text>
      <Text className="text-base mb-2">Tip 2: [Expand]</Text>
      <Text className="text-base mb-2">Tip 3: [Expand]</Text>

      <Button title="Go to Side Effects" onPress={() => navigation.navigate('SideEffects')} />
    </ScrollView>
  );
}
