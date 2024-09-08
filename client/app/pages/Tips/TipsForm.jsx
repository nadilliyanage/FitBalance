import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TipsForm() {
  const [disease, setDisease] = useState('');
  const [onsetTime, setOnsetTime] = useState('');
  const [treatment, setTreatment] = useState('');
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-lg mb-2">Select Disease:</Text>
      <TextInput
        className="border p-2 mb-4 w-full"
        placeholder="Enter Disease"
        value={disease}
        onChangeText={setDisease}
      />
      <Text className="text-lg mb-2">Time of Onset:</Text>
      <TextInput
        className="border p-2 mb-4 w-full"
        placeholder="Enter Onset Time"
        value={onsetTime}
        onChangeText={setOnsetTime}
      />
      <Text className="text-lg mb-2">Do you have treatments?</Text>
      <TextInput
        className="border p-2 mb-4 w-full"
        placeholder="Enter Yes/No"
        value={treatment}
        onChangeText={setTreatment}
      />
      <Button title="Show Tips" onPress={() => navigation.navigate('Tips')} />
    </View>
  );
}
