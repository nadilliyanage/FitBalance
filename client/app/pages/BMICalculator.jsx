import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from '@expo/vector-icons'; // For the gender icons and increment/decrement buttons
import { BlurView } from 'expo-blur'; // For blurring the background

const { width } = Dimensions.get('window'); // Get the device's width

const BMICalculator = () => {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('65');
  const [age, setAge] = useState('26');
  const [height, setHeight] = useState('170'); // Default height value as string
  const [isModalVisible, setModalVisible] = useState(false);
  const [bmiResult, setBmiResult] = useState(null);

  // Throttle the onScroll event to prevent too many updates
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newHeight = Math.min(Math.max(Math.round(scrollPosition / 10) + 100, 100), 220);
    setHeight(newHeight.toString());
  }, []);

  // Function to calculate BMI
  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert height to meters
    if (weightNum > 0 && heightNum > 0) {
      const bmi = (weightNum / (heightNum * heightNum)).toFixed(1);
      setBmiResult({
        bmi,
        weight: weightNum,
        height,
        age,
        gender,
      });
      setModalVisible(true); // Show the modal with the BMI result
    } else {
      Alert.alert('Invalid Input', 'Please enter valid weight and height.');
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="p-5">
          {/* Header */}
          <Text className="text-xl font-bold mb-5 text-center">BMI Calculator</Text>

          {/* Gender Selection */}
          <Text className="text-lg font-semibold mb-3">Please choose your gender</Text>
          <View className="flex-row justify-center mb-5">
            <TouchableOpacity
              onPress={() => setGender('male')}
              className={`flex-1 items-center py-3 mx-2 rounded-lg ${gender === 'male' ? 'bg-purple-200' : 'bg-gray-200'}`}
            >
              <FontAwesome5 name="mars" size={40} color={gender === 'male' ? 'blue' : 'gray'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender('female')}
              className={`flex-1 items-center py-3 mx-2 rounded-lg ${gender === 'female' ? 'bg-purple-200' : 'bg-gray-200'}`}
            >
              <FontAwesome5 name="venus" size={40} color={gender === 'female' ? 'red' : 'gray'} />
            </TouchableOpacity>
          </View>

          {/* Modify Values Section */}
          <Text className="text-lg font-semibold mb-3">Please Modify the values</Text>
          <View className="flex-row justify-between mb-5">
            {/* Weight */}
            <View className="items-center bg-purple-200 w-36 py-5 rounded-lg">
              <Text className="text-lg font-semibold mb-2">Weight (kg)</Text>
              <TextInput
                style={{ fontSize: 30, fontWeight: 'bold' }}
                keyboardType="numeric"
                value={weight}
                onChangeText={text => setWeight(text)}
              />
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPress={() => setWeight((prev) => (parseInt(prev) - 1).toString())}
                  className="bg-white p-2 rounded-full mx-2"
                >
                  <FontAwesome5 name="minus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWeight((prev) => (parseInt(prev) + 1).toString())}
                  className="bg-white p-2 rounded-full mx-2"
                >
                  <FontAwesome5 name="plus" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Age */}
            <View className="items-center bg-purple-200 w-36 py-5 rounded-lg">
              <Text className="text-lg font-semibold mb-2">Age</Text>
              <TextInput
                style={{ fontSize: 30, fontWeight: 'bold' }}
                keyboardType="numeric"
                value={age}
                onChangeText={text => setAge(text)}
              />
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPress={() => setAge((prev) => (parseInt(prev) - 1).toString())}
                  className="bg-white p-2 rounded-full mx-2"
                >
                  <FontAwesome5 name="minus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAge((prev) => (parseInt(prev) + 1).toString())}
                  className="bg-white p-2 rounded-full mx-2"
                >
                  <FontAwesome5 name="plus" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Draggable Height Ruler */}
          <View className="bg-purple-200 py-5 mb-5 rounded-lg items-center">
            <Text className="text-lg font-semibold mb-2">Height (cm)</Text>
            <TextInput
              style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}
              keyboardType="numeric"
              value={height}
              onChangeText={text => setHeight(text)}
            />

            {/* Scrollable Ruler */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentOffset={{ x: (parseInt(height) - 100) * 10 }}
              decelerationRate="fast"
              snapToInterval={10}
              bounces={false}
            >
              <View style={{ flexDirection: 'row', paddingHorizontal: width / 2 - 20 }}>
                {Array.from({ length: 121 }).map((_, index) => (
                  <View key={index} style={{ alignItems: 'center', marginRight: 10 }}>
                    <View
                      style={{
                        width: 2,
                        height: index % 5 === 0 ? 30 : 15,
                        backgroundColor: index % 5 === 0 ? '#000' : '#888',
                      }}
                    />
                    {index % 10 === 0 && (
                      <Text style={{ marginTop: 5 }}>{100 + index}</Text>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity className="bg-purple-500 py-4 rounded-lg" onPress={calculateBMI}>
            <Text className="text-center text-white text-lg font-bold">Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for BMI Results */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center">
            <BlurView intensity={100} className="absolute inset-0" />
            <View className="bg-white rounded-lg p-10 mx-5">
              <Text className="text-lg font-semibold mb-3 text-center">BMI Results</Text>
              <Text className="text-base mb-1">BMI: {bmiResult?.bmi}</Text>
              <Text className="text-base mb-1">Gender: {bmiResult?.gender}</Text>
              <Text className="text-base mb-1">Age: {bmiResult?.age}</Text>
              <Text className="text-base mb-1">Height: {bmiResult?.height} cm</Text>
              <Text className="text-base mb-4">Weight: {bmiResult?.weight} kg</Text>
              <TouchableOpacity
                className="bg-secondary py-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-center text-white">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BMICalculator;