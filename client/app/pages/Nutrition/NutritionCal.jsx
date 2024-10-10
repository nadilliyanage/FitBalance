import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
import { BlurView } from "expo-blur";

const LazyNutrition = lazy(() => import("../../(tabs)/Nutrition"));

const COMMON_FOODS = [
  { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Broccoli", calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
];

const DAILY_NUTRIENT_REQUIREMENTS = {
  calories: 2000,
  protein: 90,
  carbs: 110,
  fat: 70,
};

const NutritionCalculator = () => {
  const [selectedFood, setSelectedFood] = useState(COMMON_FOODS[0].name);
  const [weight, setWeight] = useState("");
  const [addedFoods, setAddedFoods] = useState([]);
  const [pastCalculations, setPastCalculations] = useState([]);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [recordsModalVisible, setRecordsModalVisible] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    loadPastCalculations();
  }, []);

  const calculateTotalNutrition = () => {
    return addedFoods.reduce(
      (totals, food) => {
        const multiplier = food.weight / 100;
        totals.calories += food.calories * multiplier;
        totals.protein += food.protein * multiplier;
        totals.carbs += food.carbs * multiplier;
        totals.fat += food.fat * multiplier;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const addFood = () => {
    const food = COMMON_FOODS.find((f) => f.name === selectedFood);
    const weightInGrams = parseFloat(weight);
    const newFood = { ...food, weight: weightInGrams };
    setAddedFoods([...addedFoods, newFood]);
    setWeight("");
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
      lackingNutrients.calories =
        DAILY_NUTRIENT_REQUIREMENTS.calories - totalNutrition.calories;
    if (totalNutrition.protein < DAILY_NUTRIENT_REQUIREMENTS.protein)
      lackingNutrients.protein =
        DAILY_NUTRIENT_REQUIREMENTS.protein - totalNutrition.protein;
    if (totalNutrition.carbs < DAILY_NUTRIENT_REQUIREMENTS.carbs)
      lackingNutrients.carbs =
        DAILY_NUTRIENT_REQUIREMENTS.carbs - totalNutrition.carbs;
    if (totalNutrition.fat < DAILY_NUTRIENT_REQUIREMENTS.fat)
      lackingNutrients.fat =
        DAILY_NUTRIENT_REQUIREMENTS.fat - totalNutrition.fat;
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
      await AsyncStorage.setItem(
        "pastCalculations",
        JSON.stringify(updatedPastCalculations)
      );
      Alert.alert("Success", "Calculation saved successfully!");
    } catch (error) {
      console.error("Failed to save past calculations", error);
    }

    setSummaryModalVisible(false);
  };

  const loadPastCalculations = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem("pastCalculations");
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
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const updatedPastCalculations = pastCalculations.filter(
              (_, i) => i !== index
            );
            setPastCalculations(updatedPastCalculations);
            try {
              await AsyncStorage.setItem(
                "pastCalculations",
                JSON.stringify(updatedPastCalculations)
              );
            } catch (error) {
              console.error("Failed to delete past calculation", error);
            }
          },
        },
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
    <SafeAreaView
      className="bg-gray-50 flex-1 pt-4 px-4"
    >
      <View className="flex-row items-center justify-center mb-5">
        <TouchableOpacity
          style={{ position: "absolute", left: 10 }}
          onPress={() => setBack(true)}
        >
          <FontAwesome5 name="arrow-left" size={20} color="purple" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Nutrition Calculator</Text>
      </View>

      {/* Food Picker and Weight Input */}
      <View className="bg-white rounded-lg shadow-xl shadow-black p-8 mb-4 ">
        {/* Select Food */}
        <View className="flex flex-row mb-4">
          <Text className="text-xl font-bold text-black mt-3">
            Select Food:
          </Text>
          <View className="border-2 border-gray-300 rounded-lg ml-2 w-48  bg-white ">
            <Picker
              selectedValue={selectedFood}
              className="h-8 w-full font-bold"
              onValueChange={(itemValue) => setSelectedFood(itemValue)}
            >
              {COMMON_FOODS.map((food, index) => (
                <Picker.Item key={index} label={food.name} value={food.name} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Enter Weight */}
        <View className="flex flex-row mb-4">
          <Text className="text-xl font-bold text-black mb-2 mt-4">
            Enter Weight (g):
          </Text>
          <View className=" ml-2 w-40 ">
            <TextInput
              className="text-center border-2 border-gray-300 rounded-lg text-lg mr-1 flex-1 bg-white "
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>
        {/* Add Food Button */}
        <TouchableOpacity
          onPress={addFood}
          className="bg-secondary-100 p-4 rounded-xl mt-6 border border-white"
        >
          <Text className="text-white text-center text-lg font-bold">
            Add Food
          </Text>
        </TouchableOpacity>
      </View>

      {/* Added Foods List in a ScrollView */}
      <Text className="text-2xl font-bold text-gray-800 mb-2">Added Foods</Text>
      {addedFoods.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={true}>
          {addedFoods.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center bg-secondary-100 p-4 shadow-md rounded-2xl mb-2"
            >
              <Text className="ml-4 text-xl text-white font-semibold">
                {item.name} - {item.weight}g
              </Text>
              <View className="flex-row items-center ">
                <TextInput
                  className="border bg-white text-black font-semibold border-gray-300 rounded p-2 text-lg w-20 mr-4"
                  keyboardType="numeric"
                  value={item.weight.toString()}
                  onChangeText={(value) => updateFood(index, value)}
                />
                <TouchableOpacity
                  onPress={() => deleteFood(index)}
                  className="p-2 rounded"
                >
                  <Text className="text-white">
                    <FontAwesome name="close" size={24} color="white" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text className="text-lg text-gray-700">No foods added yet.</Text>
      )}

      {/* Show Summary Button */}
      <TouchableOpacity
        onPress={() => setSummaryModalVisible(true)}
        className="bg-secondary-100 p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center text-lg font-bold">
          Show Summary
        </Text>
      </TouchableOpacity>

      {/* Nutrition Summary Modal */}
      <Modal
        transparent={true}
        visible={summaryModalVisible}
        animationType="slide"
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <BlurView
          intensity={180} // Adjust the intensity of the blur
          style={{ flex: 1 }} // Make sure it covers the entire modal
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-11/12 p-5 bg-white rounded-lg shadow-lg">
              <View className="flea flex-row justify-between">
                <Text className="text-xl font-bold text-center mb-4">
                  Nutritional Summary
                </Text>
                <TouchableOpacity
                  onPress={() => setSummaryModalVisible(false)}
                  className=" p-1 rounded"
                >
                  <Text className="text-white text-center">
                    <FontAwesome name="close" size={24} color="black" />
                  </Text>
                </TouchableOpacity>
              </View>
              {/* ScrollView for progress bars */}
              <ScrollView style={{ maxHeight: 800 }}>
                {/* Calories */}
                <Text className="text-lg font-bold text-gray-700 mb-2">
                  Total Calories: {totalNutrition.calories.toFixed(2)} /{" "}
                  {DAILY_NUTRIENT_REQUIREMENTS.calories}
                </Text>
                <Progress.Bar
                  progress={
                    totalNutrition.calories /
                    DAILY_NUTRIENT_REQUIREMENTS.calories
                  }
                  width={null}
                  height={20}
                  borderRadius={10}
                  color="#4CBF50"
                  unfilledColor="#E0E0E0"
                />
                {lackingNutrients.calories && (
                  <Text className="text-red-500">
                    Lacking Calories: {lackingNutrients.calories.toFixed(2)}
                  </Text>
                )}

                {/* Protein */}
                <Text className="text-lg font-bold text-gray-700 mt-4 mb-2">
                  Total Protein: {totalNutrition.protein.toFixed(2)}g /{" "}
                  {DAILY_NUTRIENT_REQUIREMENTS.protein}g
                </Text>
                <Progress.Bar
                  progress={
                    totalNutrition.protein / DAILY_NUTRIENT_REQUIREMENTS.protein
                  }
                  width={null}
                  height={20}
                  borderRadius={10}
                  color="#2196F3"
                  unfilledColor="#E0E0E0"
                />
                {lackingNutrients.protein && (
                  <Text className="text-red-500">
                    Lacking Protein: {lackingNutrients.protein.toFixed(2)}g
                  </Text>
                )}

                {/* Carbs */}
                <Text className="text-lg font-bold text-gray-700 mt-4 mb-2">
                  Total Carbs: {totalNutrition.carbs.toFixed(2)}g /{" "}
                  {DAILY_NUTRIENT_REQUIREMENTS.carbs}g
                </Text>
                <Progress.Bar
                  progress={
                    totalNutrition.carbs / DAILY_NUTRIENT_REQUIREMENTS.carbs
                  }
                  width={null}
                  height={20}
                  borderRadius={10}
                  color="#FF9800"
                  unfilledColor="#E0E0E0"
                />
                {lackingNutrients.carbs && (
                  <Text className="text-red-500">
                    Lacking Carbs: {lackingNutrients.carbs.toFixed(2)}g
                  </Text>
                )}

                {/* Fat */}
                <Text className="text-lg font-bold text-gray-700 mt-4 mb-2">
                  Total Fat: {totalNutrition.fat.toFixed(2)}g /{" "}
                  {DAILY_NUTRIENT_REQUIREMENTS.fat}g
                </Text>
                <Progress.Bar
                  progress={
                    totalNutrition.fat / DAILY_NUTRIENT_REQUIREMENTS.fat
                  }
                  width={null}
                  height={20}
                  borderRadius={10}
                  color="#FF5722"
                  unfilledColor="#E0E0E0"
                />
                {lackingNutrients.fat && (
                  <Text className="text-red-500">
                    Lacking Fat: {lackingNutrients.fat.toFixed(2)}g
                  </Text>
                )}
              </ScrollView>

              {/* Save & Close Buttons */}
              <View className="w-full mt-8 ">
                <TouchableOpacity
                  onPress={saveCalculation}
                  className="bg-green-600 p-3 rounded-xl"
                >
                  <Text className="text-white text-center font-psemibold text-xl">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Past Calculations Button */}
      <TouchableOpacity
        onPress={() => setRecordsModalVisible(true)}
        className="bg-secondary-300 p-4 rounded-xl my-4"
      >
        <Text className="text-white text-center text-lg font-bold">
          Past Calculations
        </Text>
      </TouchableOpacity>

      {/* Past Calculations Modal */}
      <Modal
        visible={recordsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRecordsModalVisible(false)}
      >
        <BlurView
          intensity={180} // Adjust the intensity of the blur
          style={{ flex: 1 }} // Make sure it covers the entire modal
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-11/12 p-5 bg-white rounded-lg shadow-lg h-[70%]">
              <View className="flex flex-row justify-between">
                <Text className="text-2xl font-bold text-center mb-4">
                  Past Calculations
                </Text>
                <TouchableOpacity
                  onPress={() => setRecordsModalVisible(false)}
                  className=""
                >
                  <Text className="text-white text-center">
                    <FontAwesome name="close" size={34} color="black" />
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {pastCalculations.map((calculation, index) => (
                  <View key={index} className="p-4 border-b  border-gray-300">
                    <Text className="text-lg font-pregular">
                      Date: {calculation.date}
                    </Text>
                    <Text className="text-2xl font-bold mt-2">Foods:</Text>
                    {calculation.foods.map((food, idx) => (
                      <Text
                        key={idx}
                        className="text-xl font-pregular text-gray-600"
                      >
                        {food.name} - {food.weight}g
                      </Text>
                    ))}
                    <Text className="text-xl font-pregular mt-2">
                      Total Calories:{" "}
                      {calculation.totalNutrition.calories.toFixed(2)} /{" "}
                      {DAILY_NUTRIENT_REQUIREMENTS.calories}
                    </Text>
                    <Text className="text-xl font-pregular">
                      Total Protein:{" "}
                      {calculation.totalNutrition.protein.toFixed(2)}g /{" "}
                      {DAILY_NUTRIENT_REQUIREMENTS.protein}g
                    </Text>
                    <Text className="text-xl font-pregular">
                      Total Carbs: {calculation.totalNutrition.carbs.toFixed(2)}
                      g / {DAILY_NUTRIENT_REQUIREMENTS.carbs}g
                    </Text>
                    <Text className="text-xl font-pregular ">
                      Total Fat: {calculation.totalNutrition.fat.toFixed(2)}g /{" "}
                      {DAILY_NUTRIENT_REQUIREMENTS.fat}g
                    </Text>
                    <TouchableOpacity
                      onPress={() => deletePastCalculation(index)}
                      className="bg-red-600 p-2 rounded mt-2"
                    >
                      <Text className="text-white font-semibold text-lg text-center">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

export default NutritionCalculator;
