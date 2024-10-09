import React, { useState, lazy, Suspense, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LazyNutrition = lazy(() => import("../../(tabs)/Nutrition"));

const COMMON_FOODS = [
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
];

const DAILY_NUTRIENT_REQUIREMENTS = {
  calories: 2000,
  protein: 90,
  carbs: 110,
  fat: 70,
};

const NutritionCalculator = () => {
  const [selectedFood, setSelectedFood] = useState(COMMON_FOODS[0].name);
  const [weight, setWeight] = useState('');
  const [addedFoods, setAddedFoods] = useState([]);
  const [pastCalculations, setPastCalculations] = useState([]);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [recordsModalVisible, setRecordsModalVisible] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    loadPastCalculations();
  }, []);

  const calculateTotalNutrition = () => {
    return addedFoods.reduce((totals, food) => {
      const multiplier = food.weight / 100;
      totals.calories += food.calories * multiplier;
      totals.protein += food.protein * multiplier;
      totals.carbs += food.carbs * multiplier;
      totals.fat += food.fat * multiplier;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const addFood = () => {
    const food = COMMON_FOODS.find(f => f.name === selectedFood);
    const weightInGrams = parseFloat(weight);
    const newFood = { ...food, weight: weightInGrams };
    setAddedFoods([...addedFoods, newFood]);
    setWeight('');
  };

  const updateFood = (index, updatedWeight) => {
    const updatedFoods = [...addedFoods];
    const weight = parseFloat(updatedWeight);
    updatedFoods[index].weight = isNaN(weight) ? 0 : weight;
    setAddedFoods(updatedFoods);
  };

  const deleteFood = (index) => {
    setAddedFoods(addedFoods.filter((_, i) => i !== index));
  };

  const getLackingNutrients = (totalNutrition) => {
    const lackingNutrients = {};
    if (totalNutrition.calories < DAILY_NUTRIENT_REQUIREMENTS.calories)
      lackingNutrients.calories = DAILY_NUTRIENT_REQUIREMENTS.calories - totalNutrition.calories;
    if (totalNutrition.protein < DAILY_NUTRIENT_REQUIREMENTS.protein)
      lackingNutrients.protein = DAILY_NUTRIENT_REQUIREMENTS.protein - totalNutrition.protein;
    if (totalNutrition.carbs < DAILY_NUTRIENT_REQUIREMENTS.carbs)
      lackingNutrients.carbs = DAILY_NUTRIENT_REQUIREMENTS.carbs - totalNutrition.carbs;
    if (totalNutrition.fat < DAILY_NUTRIENT_REQUIREMENTS.fat)
      lackingNutrients.fat = DAILY_NUTRIENT_REQUIREMENTS.fat - totalNutrition.fat;
    return lackingNutrients;
  };

  const totalNutrition = calculateTotalNutrition();
  const lackingNutrients = getLackingNutrients(totalNutrition);

  const saveCalculation = async () => {
    const calculation = {
      foods: addedFoods,
      totalNutrition: calculateTotalNutrition(),
      date: new Date().toLocaleString(),
    };

    const updatedPastCalculations = [calculation, ...pastCalculations];
    setPastCalculations(updatedPastCalculations);

    // Save to local storage
    try {
      await AsyncStorage.setItem('pastCalculations', JSON.stringify(updatedPastCalculations));
      Alert.alert("Success", "Calculation saved successfully!");
    } catch (error) {
      console.error("Failed to save past calculations", error);
    }

    setSummaryModalVisible(false);
  };

  const loadPastCalculations = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem('pastCalculations');
      if (storedCalculations) {
        setPastCalculations(JSON.parse(storedCalculations));
      }
    } catch (error) {
      console.error("Failed to load past calculations", error);
    }
  };

  const deletePastCalculation = async (index) => {
    Alert.alert(
      "Delete Past Calculation",
      "Are you sure you want to delete this past calculation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            const updatedPastCalculations = pastCalculations.filter((_, i) => i !== index);
            setPastCalculations(updatedPastCalculations);
            try {
              await AsyncStorage.setItem('pastCalculations', JSON.stringify(updatedPastCalculations));
            } catch (error) {
              console.error("Failed to delete past calculation", error);
            }
          }
        }
      ]
    );
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyNutrition />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1 pt-4 px-4">
      <View className="flex-row items-center justify-center mb-5">
        <TouchableOpacity style={{ position: "absolute", left: 10 }} onPress={() => setBack(true)}>
          <FontAwesome5 name="arrow-left" size={20} color="purple" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Nutrition Calculator</Text>
      </View>

      {/* Food Picker and Weight Input */}
      <View className="flex-row items-center justify-between bg-white shadow-md rounded p-4 mb-4">
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text className="text-lg font-bold text-gray-700 mb-2">Select Food:</Text>
          <Picker
            selectedValue={selectedFood}
            style={{ height: 50, width: '100%' }}
            onValueChange={(itemValue) => setSelectedFood(itemValue)}
          >
            {COMMON_FOODS.map((food, index) => (
              <Picker.Item key={index} label={food.name} value={food.name} />
            ))}
          </Picker>
        </View>

        <View style={{ flex: 0.6 }}>
          <Text className="text-lg font-bold text-gray-700 mb-2">Enter Weight</Text>
          <View className="flex flex-row">
            <TextInput
              className="border border-gray-300 rounded p-2 text-lg w-full"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text className="text-lg font-bold text-gray-700 mb-2">g</Text>
          </View>
        </View>
      </View>

      {/* Add Food Button */}
      <TouchableOpacity
        onPress={addFood}
        className="bg-purple-600 p-4 rounded mb-4"
      >
        <Text className="text-white text-center text-lg font-bold">Add Food</Text>
      </TouchableOpacity>

      {/* Added Foods List in a ScrollView */}
      <Text className="text-2xl font-bold text-gray-800 mb-2">Added Foods:</Text>
      <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={true}>
        {addedFoods.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center bg-white p-4 shadow-md rounded mb-2">
            <Text className="text-lg text-gray-700">{item.name} - {item.weight}g</Text>
            <View className="flex-row items-center">
              <TextInput
                className="border border-gray-300 rounded p-2 text-lg w-20 mr-4"
                keyboardType="numeric"
                value={item.weight.toString()}
                onChangeText={(value) => updateFood(index, value)}
              />
              <TouchableOpacity
                onPress={() => deleteFood(index)}
                className="bg-red-600 p-2 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Show Summary Button */}
      <TouchableOpacity
        onPress={() => setSummaryModalVisible(true)}
        className="bg-blue-600 p-4 rounded mt-4"
      >
        <Text className="text-white text-center text-lg font-bold">Show Summary</Text>
      </TouchableOpacity>

      {/* Nutrition Summary Modal */}
      <Modal
        visible={summaryModalVisible}
        animationType="slide"
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-200">
          <View className="w-11/12 p-5 bg-white rounded-lg shadow-lg">
            <Text className="text-xl font-bold text-center mb-4">Nutritional Summary</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <View>
                <Text className="text-lg">Total Calories: {totalNutrition.calories.toFixed(2)} / {DAILY_NUTRIENT_REQUIREMENTS.calories}</Text>
                {lackingNutrients.calories && (
                  <Text className="text-red-500">Lacking Calories: {lackingNutrients.calories.toFixed(2)}</Text>
                )}
                <Text className="text-lg">Total Protein: {totalNutrition.protein.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.protein}g</Text>
                {lackingNutrients.protein && (
                  <Text className="text-red-500">Lacking Protein: {lackingNutrients.protein.toFixed(2)}g</Text>
                )}
                <Text className="text-lg">Total Carbs: {totalNutrition.carbs.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.carbs}g</Text>
                {lackingNutrients.carbs && (
                  <Text className="text-red-500">Lacking Carbs: {lackingNutrients.carbs.toFixed(2)}g</Text>
                )}
                <Text className="text-lg">Total Fat: {totalNutrition.fat.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.fat}g</Text>
                {lackingNutrients.fat && (
                  <Text className="text-red-500">Lacking Fat: {lackingNutrients.fat.toFixed(2)}g</Text>
                )}
              </View>
            </ScrollView>
            <View className="flex-row justify-between mt-5">
              <TouchableOpacity onPress={saveCalculation} className="bg-green-600 p-3 rounded">
                <Text className="text-white text-center">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSummaryModalVisible(false)} className="bg-gray-400 p-3 rounded">
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Past Calculations Button */}
      <TouchableOpacity
        onPress={() => setRecordsModalVisible(true)}
        className="bg-purple-600 p-4 rounded mt-4"
      >
        <Text className="text-white text-center text-lg font-bold">Past Calculations</Text>
      </TouchableOpacity>

      {/* Past Calculations Modal */}
      <Modal
        visible={recordsModalVisible}
        animationType="slide"
        onRequestClose={() => setRecordsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-200">
          <View className="w-11/12 p-5 bg-white rounded-lg shadow-lg">
            <Text className="text-xl font-bold text-center mb-4">Past Calculations</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {pastCalculations.map((calculation, index) => (
                <View key={index} className="p-4 border-b border-gray-300">
                  <Text className="text-lg">Date: {calculation.date}</Text>
                  <Text className="text-lg font-bold mt-2">Foods:</Text>
                  {calculation.foods.map((food, idx) => (
                    <Text key={idx} className="text-lg text-gray-600">
                      {food.name} - {food.weight}g
                    </Text>
                  ))}
                  <Text className="text-lg mt-2">Total Calories: {calculation.totalNutrition.calories.toFixed(2)} / {DAILY_NUTRIENT_REQUIREMENTS.calories}</Text>
                  <Text className="text-lg">Total Protein: {calculation.totalNutrition.protein.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.protein}g</Text>
                  <Text className="text-lg">Total Carbs: {calculation.totalNutrition.carbs.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.carbs}g</Text>
                  <Text className="text-lg">Total Fat: {calculation.totalNutrition.fat.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.fat}g</Text>
                  <TouchableOpacity onPress={() => deletePastCalculation(index)} className="bg-red-600 p-2 rounded mt-2">
                    <Text className="text-white text-center">Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setRecordsModalVisible(false)} className="bg-gray-400 p-3 rounded mt-4">
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


export default NutritionCalculator;