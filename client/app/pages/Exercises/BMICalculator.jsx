import React, { useState, useCallback, lazy, Suspense, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import BMIModal from "./BMIModal"; // Import the BMIModal component
import AsyncStorage from '@react-native-async-storage/async-storage';
import BMIMeaning from "./BMIMeaningModal";

const LazyExercices = lazy(() => import("../../(tabs)/Exercises"));

const { width } = Dimensions.get("window");

const BMICalculator = () => {
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("50.0");
  const [age, setAge] = useState("20");
  const [height, setHeight] = useState("100.0");
  const [isModalVisible, setModalVisible] = useState(false);
  const [bmiResult, setBmiResult] = useState(null);
  const [back, setBack] = useState(false);
  const [isMeaningVisible, setMeaningVisible] = useState(false);

  // Refs for holding buttons
  const weightIntervalRef = useRef(null);
  const ageIntervalRef = useRef(null);

  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newHeight = Math.min(
      Math.max(Math.round(scrollPosition / 10) + 100, 100),
      220
    );
    setHeight(newHeight.toString());
  }, []);

  const calculateBMI = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;
    if (weightNum > 0 && heightNum > 0) {
      const bmi = (weightNum / (heightNum * heightNum)).toFixed(1);
      const bmiDetails = {
        bmi,
        weight: weightNum,
        height,
        age,
        gender,
      };
  
      try {
        // Store the BMI details in AsyncStorage
        await AsyncStorage.setItem('bmiResult', JSON.stringify(bmiDetails));
        setBmiResult(bmiDetails);
        setModalVisible(true);
      } catch (error) {
        console.error('Error saving BMI details to local storage:', error);
      }
    } else {
      Alert.alert("Invalid Input", "Please enter valid weight and height.");
    }
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyExercices />
      </Suspense>
    );
  }

  const pointerLeft = (parseInt(height) - 100) * 10 + width / 2 - 15;

  // Start and stop functions for handling hold
  const startChangingWeight = (delta) => {
    if (weightIntervalRef.current) clearInterval(weightIntervalRef.current);

    weightIntervalRef.current = setInterval(() => {
      setWeight((prev) => Math.max(1, parseInt(prev) + delta).toString());
    }, 100); // Faster speed on hold
  };

  const stopChangingWeight = () => {
    if (weightIntervalRef.current) clearInterval(weightIntervalRef.current);
  };

  const startChangingAge = (delta) => {
    if (ageIntervalRef.current) clearInterval(ageIntervalRef.current);

    ageIntervalRef.current = setInterval(() => {
      setAge((prev) => Math.max(1, parseInt(prev) + delta).toString());
    }, 100); // Faster speed on hold
  };

  const stopChangingAge = () => {
    if (ageIntervalRef.current) clearInterval(ageIntervalRef.current);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      
        <View className="pr-5 pl-5 pb-5">
          <View className="flex-row items-center justify-center mb-5">
            <TouchableOpacity
              style={{ position: "absolute", left: 10 }}
              onPress={() => setBack(true)}
            >
              <FontAwesome5 name="arrow-left" size={20} color="purple" />
            </TouchableOpacity>
            <Text className="text-xl font-bold">BMI Calculator</Text>
            <TouchableOpacity
              style={{ position: "absolute", right: 10 }}
              onPress={() => setMeaningVisible(true)}
            >
              <FontAwesome5 name="question-circle" size={20} color="purple" />
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-semibold mb-3">
            Please choose your gender
          </Text>
          <View className="flex-row justify-center mb-5">
            <TouchableOpacity
              onPress={() => setGender("Male")}
              className={`flex-1 items-center py-3 mx-2 rounded-lg ${
                gender === "Male" ? "bg-purple-200 border-4 border-secondary-300" : "bg-gray-200"
              }`}
              style={{ position: "relative" }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="mars"
                  size={18}
                  color={gender === "Male" ? "blue" : "gray"}
                />
              </View>
              <MaterialCommunityIcons
                name="face-man"
                size={40}
                color={gender === "Male" ? "blue" : "gray"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender("Female")}
              className={`flex-1 items-center py-3 mx-2 rounded-lg ${
                gender === "Female" ? "bg-purple-200 border-4 border-secondary-300" : "bg-gray-200"
              }`}
              style={{ position: "relative" }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="venus"
                  size={18}
                  color={gender === "Female" ? "red" : "gray"}
                />
              </View>
              <MaterialCommunityIcons
                name="face-woman"
                size={40}
                color={gender === "Female" ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-semibold mb-3">
            Please Modify the values
          </Text>
          <View className="flex-row justify-around mb-5">
            <View className="items-center bg-purple-200 w-36 py-8 rounded-lg">
              <Text className="text-lg font-semibold mb-2">Weight (kg)</Text>
              <TextInput
                style={{ fontSize: 40, fontWeight: "bold" }}
                keyboardType="numeric"
                value={weight}
                onChangeText={(text) => setWeight(text)}
              />
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPressIn={() => startChangingWeight(-1)}
                  onPressOut={stopChangingWeight}
                  onPress={() => setWeight((prev) => Math.max(1, parseInt(prev) - 1).toString())} // Single decrease
                  className="bg-white p-2 rounded-full mx-4"
                >
                  <FontAwesome5 name="minus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPressIn={() => startChangingWeight(1)}
                  onPressOut={stopChangingWeight}
                  onPress={() => setWeight((prev) => (parseInt(prev) + 1).toString())} // Single increase
                  className="bg-white p-2 rounded-full mx-4"
                >
                  <FontAwesome5 name="plus" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-center bg-purple-200 w-36 py-8 rounded-lg">
              <Text className="text-lg font-semibold mb-2">Age</Text>
              <TextInput
                style={{ fontSize: 40, fontWeight: "bold" }}
                keyboardType="numeric"
                value={age}
                onChangeText={(text) => setAge(text)}
              />
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPressIn={() => startChangingAge(-1)}
                  onPressOut={stopChangingAge}
                  onPress={() => setAge((prev) => Math.max(1, parseInt(prev) - 1).toString())} // Single decrease
                  className="bg-white p-2 rounded-full mx-4"
                >
                  <FontAwesome5 name="minus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPressIn={() => startChangingAge(1)}
                  onPressOut={stopChangingAge}
                  onPress={() => setAge((prev) => (parseInt(prev) + 1).toString())} // Single increase
                  className="bg-white p-2 rounded-full mx-4"
                >
                  <FontAwesome5 name="plus" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="bg-purple-200 py-5 mb-5 rounded-lg items-center">
            <Text className="text-lg font-semibold mb-2">Height (cm)</Text>
            <TextInput
              style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}
              keyboardType="numeric"
              value={height}
              onChangeText={(text) => setHeight(text)}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={10}
              bounces={false}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: width / 2 - 40,
                }}
              >
                {Array.from({ length: 121 }).map((_, i) => (
                  <View key={i} className="mx-2 items-center">
                    <View
                      style={{
                        height: i % 5 === 0 ? 40 : 20,
                        width: 3,
                        backgroundColor: "black",
                      }}
                    />
                    {i % 5 === 0 && (
                      <Text className="mt-2 font-semibold">{i + 100}</Text>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>

            <View
              style={{
                position: "absolute",
                top: 130,
                bottom: 0,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="arrow-up" size={24} color="purple" />
            </View>
          </View>

          <TouchableOpacity
            className="bg-secondary-100 rounded-lg py-4"
            onPress={calculateBMI}
          >
            <Text className="text-center text-white font-bold text-lg">
              Calculate BMI
            </Text>
          </TouchableOpacity>
        </View>

      {/* Show the BMI modal */}
      {isModalVisible && (
        <BMIModal
          bmiResult={bmiResult}
          onClose={() => setModalVisible(false)}
        />
      )}
      <BMIMeaning isVisible={isMeaningVisible} onClose={() => setMeaningVisible(false)} />
    </SafeAreaView>
  );
};

export default BMICalculator;
