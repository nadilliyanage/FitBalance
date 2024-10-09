import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import CustomButton from "../../components/CustomButton";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import HealthData from "../pages/Nutrition/HealthData";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <Text style={{ fontSize: 40, fontWeight: "bold" }}>{calories} Kcal</Text>
            <Text style={{ fontSize: 16, color: "gray" }}>of 2000 kcal</Text>

            {/* Macros */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 20 }}>
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
          <View style={{ marginBottom: 30 }}>
            <CustomButton
              title="Food Suggestions"
              handlePress={() => setShowEnterHealthData(true)}
              containerStyles={{ backgroundColor: "#9b59b6", padding: 15, borderRadius: 10 }}
            />
          </View>

          {/* Row for Nutrition Calculator and Health Data buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
            <CustomButton
              title="Health Data"
              handlePress={() => setShowEnterHealthData(true)}
              containerStyles={{ backgroundColor: "#9b59b6", padding: 15, borderRadius: 10, flex: 1, marginRight: 10 }} // Left button with margin to the right
            />
            <CustomButton
              title="Nutrition Calculator"
              handlePress={() => setShowCalculator(true)}
              containerStyles={{ backgroundColor: "#9b59b6", padding: 15, borderRadius: 10, flex: 1 }} // Right button
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
