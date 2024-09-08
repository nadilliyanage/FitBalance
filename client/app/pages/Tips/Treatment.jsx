import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TreatmentsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4">Treatment Options</Text>
      <Text className="text-base mb-2">Treatment 1: [Expand]</Text>
      <Text className="text-base mb-2">Treatment 2: [Expand]</Text>

      <Button title="Go to Progress Tracker" onPress={() => navigation.navigate('ProgressTracker')} />
    </ScrollView>
  );
}
