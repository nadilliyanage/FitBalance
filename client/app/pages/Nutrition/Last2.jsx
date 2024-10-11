import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Circle } from "react-native-svg"; // Import the Circle component from react-native-svg
import Svg from "react-native-svg"; // Import Svg component

const LastNutritionSummary = () => {
  const [lastCalculation, setLastCalculation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLastCalculation();
  }, []);

  const loadLastCalculation = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem("pastCalculations");
      if (storedCalculations) {
        const calculationsArray = JSON.parse(storedCalculations);
        if (calculationsArray.length > 0) {
          const lastSavedCalculation = calculationsArray[0];
          setLastCalculation(lastSavedCalculation);
        }
      }
    } catch (error) {
      console.error("Failed to load past calculations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!lastCalculation) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSummaryText}>No Summary Found</Text>
      </View>
    );
  }

  const { totalNutrition } = lastCalculation;
  const { calories, protein, fat, carbs } = totalNutrition;

  // Function to calculate stroke dasharray for circular progress
  const getStrokeDasharray = (value, max) => {
    const radius = 30; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const progress = (value / max) * circumference; // Calculate the progress based on value
    return `${progress} ${circumference}`; // Return dasharray for the circle
  };

  return (
    <View style={styles.container}>
      <Text style={styles.calorieText}>{calories.toFixed(2)} Kcal</Text>
      <Text style={styles.calorieGoalText}>of 2000 kcal</Text>

      {/* Macros */}
      <View style={styles.macroContainer}>
        {/* Protein */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Protein</Text>
          <Svg height="80" width="80">
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#E0E0E0"
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#4A90E2"
              strokeWidth="10"
              fill="none"
              strokeDasharray={getStrokeDasharray(protein, 90)}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.macroValue}>{protein.toFixed(1)}</Text>
          <Text style={styles.macroValue}>/ 90 g</Text>
        </View>

        {/* Fats */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Fats</Text>
          <Svg height="80" width="80">
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#E0E0E0"
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#D5006D"
              strokeWidth="10"
              fill="none"
              strokeDasharray={getStrokeDasharray(fat, 70)}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.macroValue}>{fat.toFixed(1)}</Text>
          <Text style={styles.macroValue}>/ 70 g</Text>
        </View>

        {/* Carbs */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Carbs</Text>
          <Svg height="80" width="80">
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#E0E0E0"
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="40"
              cy="40"
              r="30"
              stroke="#FBC02D"
              strokeWidth="10"
              fill="none"
              strokeDasharray={getStrokeDasharray(carbs, 110)}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.macroValue}>{carbs.toFixed(1)}</Text>
          <Text style={styles.macroValue}>/ 110 g</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E1BEE7",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  noSummaryText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A1B9A",
  },
  calorieText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#3F51B5",
  },
  calorieGoalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#757575",
  },
  macroContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  macroBox: {
    alignItems: "center",
    width: 100,
    marginHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  macroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1976D2",
  },
  macroValue: {
    fontSize: 18,
    color: "#424242",
    marginTop: 5,
  },
});

export default LastNutritionSummary;
