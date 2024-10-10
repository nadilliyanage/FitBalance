import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LastNutritionSummary = () => {
  const [lastCalculation, setLastCalculation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLastCalculation();
  }, []);

  const loadLastCalculation = async () => {
    try {
      const storedCalculations = await AsyncStorage.getItem('pastCalculations');
      if (storedCalculations) {
        const calculationsArray = JSON.parse(storedCalculations);
        if (calculationsArray.length > 0) {
          const lastSavedCalculation = calculationsArray[0];
          setLastCalculation(lastSavedCalculation);
        }
      }
    } catch (error) {
      console.error('Failed to load past calculations', error);
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

  return (
    <View style={styles.container}>
      <Text style={styles.calorieText}>{calories.toFixed(2)} Kcal</Text>
      <Text style={styles.calorieGoalText}>of 2000 kcal</Text>

      {/* Macros */}
      <View style={styles.macroContainer}>
        {/* Protein */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Protein</Text>
          <Text style={styles.macroValue}>{protein.toFixed(1)} / 90g</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(protein / 90) * 100}%`, backgroundColor: '#4A90E2' },
              ]}
            />
          </View>
        </View>

        {/* Fats */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Fats</Text>
          <Text style={styles.macroValue}>{fat.toFixed(1)} / 70g</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(fat / 70) * 100}%`, backgroundColor: '#D5006D' },
              ]}
            />
          </View>
        </View>

        {/* Carbs */}
        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>Carbs</Text>
          <Text style={styles.macroValue}>{carbs.toFixed(1)} / 110g</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(carbs / 110) * 100}%`, backgroundColor: '#FBC02D' },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#E1BEE7',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  noSummaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  calorieText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  calorieGoalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#757575',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  macroBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 14,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  macroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976D2',
  },
  macroValue: {
    fontSize: 18,
    color: '#424242',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
});

export default LastNutritionSummary;
