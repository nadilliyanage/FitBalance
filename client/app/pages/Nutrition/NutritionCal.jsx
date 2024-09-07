import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

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
    const lackingNutrients = [];
    if (totalNutrition.calories < DAILY_NUTRIENT_REQUIREMENTS.calories)
      lackingNutrients.push(`Calories: ${DAILY_NUTRIENT_REQUIREMENTS.calories - totalNutrition.calories}`);
    if (totalNutrition.protein < DAILY_NUTRIENT_REQUIREMENTS.protein)
      lackingNutrients.push(`Protein: ${DAILY_NUTRIENT_REQUIREMENTS.protein - totalNutrition.protein}`);
    if (totalNutrition.carbs < DAILY_NUTRIENT_REQUIREMENTS.carbs)
      lackingNutrients.push(`Carbs: ${DAILY_NUTRIENT_REQUIREMENTS.carbs - totalNutrition.carbs}`);
    if (totalNutrition.fat < DAILY_NUTRIENT_REQUIREMENTS.fat)
      lackingNutrients.push(`Fat: ${DAILY_NUTRIENT_REQUIREMENTS.fat - totalNutrition.fat}`);
    return lackingNutrients.length > 0 ? lackingNutrients.join(', ') : 'None';
  };

  const totalNutrition = calculateTotalNutrition();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Back</Text>
      </TouchableOpacity>

      {/* App Title */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Nutrition Calculator</Text>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Daily Nutrition Calculator</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Text>Select Food:</Text>
        <Picker
          selectedValue={selectedFood}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setSelectedFood(itemValue)}>
          {COMMON_FOODS.map((food, index) => (
            <Picker.Item key={index} label={food.name} value={food.name} />
          ))}
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Text>Enter Weight (g):</Text>
        <TextInput
          style={{ marginLeft: 8, padding: 8, borderColor: 'gray', borderWidth: 1, width: 80, borderRadius: 5 }}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <Button title="Add Food" onPress={addFood} />

      {/* List of added foods */}
      <Text style={{ fontSize: 18, marginTop: 16, marginBottom: 8 }}>Added Foods:</Text>
      <FlatList
        data={addedFoods}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, padding: 8, borderColor: 'gray', borderWidth: 1, borderRadius: 5 }}>
            <Text>{item.name} - {item.weight}g</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ width: 60, padding: 8, borderColor: 'gray', borderWidth: 1, marginRight: 8, borderRadius: 5 }}
                keyboardType="numeric"
                value={item.weight.toString()}
                onChangeText={(value) => updateFood(index, value)}
              />
              <TouchableOpacity onPress={() => deleteFood(index)} style={{ backgroundColor: 'red', padding: 8, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        scrollEnabled={false}  /* Fix: Disable internal scrolling */
      />

      {/* Nutritional Summary */}
      <Text style={{ fontSize: 18, marginTop: 16 }}>Total Calories: {totalNutrition.calories.toFixed(2)}</Text>
      <Text style={{ fontSize: 18 }}>Total Protein: {totalNutrition.protein.toFixed(2)}g</Text>
      <Text style={{ fontSize: 18 }}>Total Carbs: {totalNutrition.carbs.toFixed(2)}g</Text>
      <Text style={{ fontSize: 18 }}>Total Fat: {totalNutrition.fat.toFixed(2)}g</Text>

      <Text style={{ fontSize: 18, marginTop: 16 }}>Lacking Nutrients: {getLackingNutrients(totalNutrition)}</Text>
    </ScrollView>
  );
};

export default NutritionCalculator;
