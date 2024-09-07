import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // For the gender icons and increment/decrement buttons
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get the device's width

const BMICalculator = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('65');
  const [age, setAge] = useState('26');
  const [height, setHeight] = useState('170'); // Default height value as string

  // Throttle the onScroll event to prevent too many updates
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    
    // Calculate the height based on scroll position, clamped between 100 and 220
    const newHeight = Math.min(Math.max(Math.round(scrollPosition / 10) + 100, 100), 220);
    setHeight(newHeight.toString()); // Convert to string for consistency
  }, []);

  return (
    <View className="flex-1 p-5 bg-white mt-10">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.navigate('Exercises')} className="p-2">
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center flex-1">BMI Calculator</Text>
      </View>

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
          <FontAwesome5 name="venus" size={40} color={gender === 'female' ? 'pink' : 'gray'} />
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
        <Text className="text-3xl font-bold mb-3">{height}</Text>

        {/* Scrollable Ruler */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Throttle the scroll event to 16ms to improve performance
          contentOffset={{ x: (parseInt(height) - 100) * 10 }} // Initial scroll position corresponding to the current height
          decelerationRate="fast" // Makes the scrolling feel smooth and stops sooner
          snapToInterval={10} // Snap to each 1 cm (10 px per cm)
          bounces={false} // Prevents bouncing at the edges
        >
          <View style={{ flexDirection: 'row', paddingHorizontal: width / 2 - 20 }}>
            {/* Render tick marks from 100 cm to 220 cm */}
            {Array.from({ length: 121 }).map((_, index) => (
              <View key={index} style={{ alignItems: 'center', marginRight: 10 }}>
                <View
                  style={{
                    width: 2,
                    height: index % 5 === 0 ? 30 : 15, // Longer tick every 5th mark
                    backgroundColor: index % 5 === 0 ? '#000' : '#888',
                  }}
                />
                {index % 10 === 0 && (
                  <Text style={{ marginTop: 5 }}>{100 + index}</Text> // Height values every 10 cm
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity className="bg-purple-500 py-4 rounded-lg">
        <Text className="text-center text-white text-lg font-bold">Calculate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BMICalculator;
