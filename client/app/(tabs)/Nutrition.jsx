import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import NutritionCalculator from "../pages/Nutrition/NutritionCal";
import EnterHealthData from "../pages/Nutrition/HealthData";
import { SafeAreaView } from "react-native-safe-area-context";
import HealthData from "../pages/Nutrition/HealthData";

const NutriCal = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEnterHealthData, setShowEnterHealthData] = useState(false);

  if (showCalculator) {
    return <NutritionCalculator />; // Display the nutrition calculator directly
  }
  if (showEnterHealthData) {
    return <HealthData />; // Display the add health data directly
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          {/* Header section */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Track your diet journey</Text>

          {/* Calorie Progress */}
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>1721 Kcal</Text>
            <Text style={{ fontSize: 16, color: 'gray' }}>of 2213 kcal</Text>

            {/* Macros */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }}>
              <View>
                <Text style={{ fontSize: 18 }}>Protein</Text>
                <Text>78/90g</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>Fats</Text>
                <Text>45/70g</Text>
              </View>
              <View>
                <Text style={{ fontSize: 18 }}>Carbs</Text>
                <Text>95/110g</Text>
              </View>
            </View>
          </View>

          {/* Buttons for Health Data and Nutrition Calculator */}
          <View style={{ marginBottom: 30 }}>
            <CustomButton
              title="Enter Health Data"
              handlePress={() => setShowEnterHealthData(true)}
              containerStyles={{ backgroundColor: '#9b59b6', padding: 15, borderRadius: 10 }}
            />
          </View>

          <View>
            <CustomButton
              title="Nutrition Calculator"
              handlePress={() => setShowCalculator(true)}
              containerStyles={{ backgroundColor: '#9b59b6', padding: 15, borderRadius: 10 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutriCal;
