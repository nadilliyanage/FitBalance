import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import HealthData from "../pages/Nutrition/HealthData";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon library

const NutriCal = () => {
  // States to track the values from the Nutrition Calculator
  const [calories, setCalories] = useState(0); // default value
  const [protein, setProtein] = useState(0); // default value
  const [fats, setFats] = useState(0); // default value
  const [carbs, setCarbs] = useState(0); // default value

  const [showCalculator, setShowCalculator] = useState(false);
  const [showEnterHealthData, setShowEnterHealthData] = useState(false);

  // Fetch data from Nutrition Calculator's last entries
  useEffect(() => {
    // Simulating fetching data from the calculator (use actual data from the last entries)
    const fetchData = () => {
      // This data should come from NutritionCalculator's last saved state/entries
      const lastEntries = {
        calories: 1850,
        protein: 85,
        fats: 50,
        carbs: 100,
      };

      setCalories(lastEntries.calories);
      setProtein(lastEntries.protein);
      setFats(lastEntries.fats);
      setCarbs(lastEntries.carbs);
    };

    fetchData();
  }, [showCalculator]);

  if (showCalculator) {
    return <NutritionCalculator />; // Display the nutrition calculator directly
  }
  if (showEnterHealthData) {
    return <HealthData />; // Display the add health data directly
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* Header section */}
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Track your diet journey
          </Text>

          {/* Calorie Progress */}
          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <Text style={{ fontSize: 40, fontWeight: "bold" }}>
              {calories} Kcal
            </Text>
            <Text style={{ fontSize: 16, color: "gray" }}>of 2213 kcal</Text>

            {/* Macros */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 20,
              }}
            >
              <View>
                <Text style={{ fontSize: 18 }}>Protein</Text>
                <Text>{protein}/90g</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>Fats</Text>
                <Text>{fats}/70g</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>Carbs</Text>
                <Text>{carbs}/110g</Text>
              </View>
            </View>
          </View>

          {/* Food Suggestions Button */}
          <View className="mb-8">
            <TouchableOpacity
              onPress={() => setShowEnterHealthData(true)}
              className="bg-purple-600 p-4 rounded-lg"
            >
              <Text className="text-white text-center">Food Suggestions</Text>
            </TouchableOpacity>
          </View>

          {/* Row for Nutrition Calculator and Health Data buttons */}
          <View className="flex-row justify-between mx-au mb-8">
            <TouchableOpacity
              onPress={() => setShowEnterHealthData(true)}
              className="bg-purple-600 p-4 rounded-lg  mr-2 h-26 w-5/12 "
            >
              <Icon name="clipboard" size={20} color="white" className="mr-2" />
              <Text className="text-white text-center">Health Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCalculator(true)}
              className="bg-purple-600 p-4 rounded-lg  mr-2 h-26 w-5/12"
            >
              <Icon
                name="calculator"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white text-center">
                Nutrition Calculator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
