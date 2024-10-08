import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const SleepTracker = () => {
  const [averageSleep, setAverageSleep] = useState(0);
  const [sleepQuality, setSleepQuality] = useState("");
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [customSleepData, setCustomSleepData] = useState(Array(7).fill("")); // Custom sleep data state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  // Load custom sleep data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCustomSleepData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("customSleepData");
        if (storedData) {
          setCustomSleepData(JSON.parse(storedData)); // Parse the JSON data
        }
      } catch (error) {
        console.error("Failed to load custom sleep data:", error);
      }
    };

    loadCustomSleepData();
  }, []);

  // Calculate average sleep and determine sleep quality
  useEffect(() => {
    const sleepData =
      timeFrame === "weekly"
        ? customSleepData.map(Number).filter((hour) => hour > 0) // Filter out zero or empty values
        : generateMonthlySleepData(selectedMonth);

    const totalSleep = sleepData.reduce((sum, hours) => sum + hours, 0);
    const avgSleep = sleepData.length > 0 ? totalSleep / sleepData.length : 0; // Prevent division by zero
    setAverageSleep(avgSleep);

    if (avgSleep >= 7 && avgSleep <= 9) {
      setSleepQuality("Good");
    } else if (avgSleep >= 6 && avgSleep < 7) {
      setSleepQuality("Normal");
    } else {
      setSleepQuality("Bad");
    }
  }, [timeFrame, selectedMonth, customSleepData]);

  const getWeeklyDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Adjust if today is Sunday (day 0)

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
    }
    return dates;
  };

  const saveCustomSleepData = async (data) => {
    try {
      await AsyncStorage.setItem("customSleepData", JSON.stringify(data)); // Save the data as JSON
    } catch (error) {
      console.error("Failed to save custom sleep data:", error);
    }
  };

  const labels =
    timeFrame === "weekly"
      ? getWeeklyDates()
      : ["Week 1", "Week 2", "Week 3", "Week 4"];

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View className="w-full h-fit">
      <View className="flex-row justify-center mb-4">
        <TouchableOpacity onPress={() => setTimeFrame("weekly")}>
          <Text
            className={`text-lg font-bold ${
              timeFrame === "weekly" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <Text className="mx-4 text-lg font-bold">|</Text>
        <TouchableOpacity onPress={() => setTimeFrame("monthly")}>
          <Text
            className={`text-lg font-bold ${
              timeFrame === "monthly" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {timeFrame === "monthly" && (
        <View className="mb-4">
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={{ height: 50, width: screenWidth - 20 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item
                key={i}
                label={new Date(0, i).toLocaleString("default", {
                  month: "long",
                })}
                value={i}
              />
            ))}
          </Picker>
        </View>
      )}

      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data:
                timeFrame === "weekly"
                  ? customSleepData.map(Number) // Use custom sleep data for weekly
                  : generateMonthlySleepData(selectedMonth),
            },
          ],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="h"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#ffa726",
          },
          propsForLabels: {
            fontSize: 8,
          },
        }}
        bezier
        style={{
          marginVertical: 2,
          borderRadius: 16,
        }}
      />

      {/* Show the button only when timeFrame is "weekly" */}
      {timeFrame === "weekly" && (
        <CustomButton
          title="Customize Sleep Data"
          handlePress={() => setModalVisible(true)}
          containerStyles="w-full mb-2"
        />
      )}

      <View className="mt-4">
        <Text className="text-lg font-bold text-black">
          Sleep Quality:{" "}
          <Text
            style={{
              color: sleepQuality === "Bad" ? "red" : "blue",
            }}
          >
            {sleepQuality}
          </Text>
        </Text>
        <Text className="text-gray-600 mt-2">
          Average Sleep: {averageSleep.toFixed(2)} hours
        </Text>
      </View>

      {/* Modal for Custom Sleep Data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-4/5 bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-4">
              Enter Your Sleep Data
            </Text>
            {customSleepData.map((sleepHour, index) => (
              <TextInput
                key={index}
                value={sleepHour}
                onChangeText={(text) => {
                  const updatedData = [...customSleepData];
                  updatedData[index] = text;
                  setCustomSleepData(updatedData);
                }}
                placeholder={`Day ${index + 1} (hours)`}
                keyboardType="numeric"
                className="border border-gray-300 rounded p-2 mb-2"
              />
            ))}

            <CustomButton
              title="Save Data"
              handlePress={() => {
                saveCustomSleepData(customSleepData); // Save to AsyncStorage
                setModalVisible(false);
              }}
              containerStyles="w-full"
            />
            <CustomButton
              title="Close"
              handlePress={() => setModalVisible(false)}
              containerStyles="w-full mt-2"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Function to generate sleep data for the month
const generateMonthlySleepData = (selectedMonth) => {
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    selectedMonth + 1,
    0
  ).getDate();

  const randomSleepData = Array.from(
    { length: daysInMonth },
    () => Math.random() * (9 - 6) + 6
  ); // Random sleep hours between 6 and 9

  return randomSleepData;
};

export default SleepTracker;
