import React, { useState, lazy, Suspense } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

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
  protein: 50,
  carbs: 275,
  fat: 70,
};

const NutritionCalculator = () => {
  const [selectedFood, setSelectedFood] = useState(COMMON_FOODS[0].name);
  const [weight, setWeight] = useState('');
  const [addedFoods, setAddedFoods] = useState([]);
  const navigation = useNavigation();
  const [back, setBack] = useState(false);

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

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyNutrition />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1 pt-4 px-4">
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
         */}
        <View className="flex-row items-center justify-center mb-5">
          {/* Back Button */}
          <TouchableOpacity
            style={{ position: "absolute", left: 10 }}
            onPress={() => setBack(true)}
          >
            <FontAwesome5 name="arrow-left" size={20} color="purple" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Nutrition Calculator</Text>
        </View>

        {/* Food Picker and Weight Input in the same row */}
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
            <View className ="flex flex-row"> 
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
        {/* Add Food Button */}
<TouchableOpacity
  onPress={addFood}
  style={{ backgroundColor: '#9b59b6', padding: 15, borderRadius: 10, marginBottom: 20 }} // Added marginBottom for spacing
>
  <Text className="text-white text-center text-lg font-bold">Add Food</Text>
</TouchableOpacity>



        {/* List of Added Foods (Scroll List with minimum 2 items shown) */}
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

        {/* Nutritional Summary */}
        <View className="bg-white shadow-md rounded p-4 mt-4">
          <Text className="text-xl font-bold text-gray-800">Nutritional Summary:</Text>
          
          {/* Calories */}
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600">Calories:</Text>
            <Text className={`text-lg font-bold ${totalNutrition.calories >= DAILY_NUTRIENT_REQUIREMENTS.calories ? 'text-green-600' : 'text-red-600'}`}>
              {totalNutrition.calories.toFixed(2)} / {DAILY_NUTRIENT_REQUIREMENTS.calories}
            </Text>
          </View>
          {lackingNutrients.calories && (
            <Text className="text-red-500 text-sm">Lacking: {lackingNutrients.calories.toFixed(2)} kcal</Text>
          )}

          {/* Protein */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg text-gray-600">Protein:</Text>
            <Text className={`text-lg font-bold ${totalNutrition.protein >= DAILY_NUTRIENT_REQUIREMENTS.protein ? 'text-green-600' : 'text-red-600'}`}>
              {totalNutrition.protein.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.protein}g
            </Text>
          </View>
          {lackingNutrients.protein && (
            <Text className="text-red-500 text-sm">Lacking: {lackingNutrients.protein.toFixed(2)}g</Text>
          )}

          {/* Carbs */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg text-gray-600">Carbs:</Text>
            <Text className={`text-lg font-bold ${totalNutrition.carbs >= DAILY_NUTRIENT_REQUIREMENTS.carbs ? 'text-green-600' : 'text-red-600'}`}>
              {totalNutrition.carbs.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.carbs}g
            </Text>
          </View>
          {lackingNutrients.carbs && (
            <Text className="text-red-500 text-sm">Lacking: {lackingNutrients.carbs.toFixed(2)}g</Text>
          )}

          {/* Fat */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg text-gray-600">Fat:</Text>
            <Text className={`text-lg font-bold ${totalNutrition.fat >= DAILY_NUTRIENT_REQUIREMENTS.fat ? 'text-green-600' : 'text-red-600'}`}>
              {totalNutrition.fat.toFixed(2)}g / {DAILY_NUTRIENT_REQUIREMENTS.fat}g
            </Text>
          </View>
          {lackingNutrients.fat && (
            <Text className="text-red-500 text-sm">Lacking: {lackingNutrients.fat.toFixed(2)}g</Text>
          )}
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default NutritionCalculator;
