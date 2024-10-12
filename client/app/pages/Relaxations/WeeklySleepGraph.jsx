// WeeklySleepGraph.jsx
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, SafeAreaView, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const WeeklySleepGraph = () => {
  const [customSleepData, setCustomSleepData] = useState(Array(7).fill(0)); // Initialize with zero for 7 days
  const navigation = useNavigation();

  // Function to fetch sleep data from AsyncStorage
  const fetchSleepData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("customSleepData");
      if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse the JSON data
        setCustomSleepData(parsedData); // Set the fetched data
      }
    } catch (error) {
      console.error("Failed to load custom sleep data:", error);
    }
  };

  // Fetch sleep data whenever the component mounts
  useEffect(() => {
    fetchSleepData(); // Initial fetch

    const interval = setInterval(() => {
      fetchSleepData(); // Fetch data every 5 seconds (adjust as needed)
    }, 5000); // 5000 ms = 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only on mount

  const labels = getWeeklyDates(); // Generate labels for the graph

  return (
    <SafeAreaView className="my-2 flex items-center justify-center bg-[#eff3ff] w-full rounded-xl px-4">
      <TouchableOpacity onPress={() => navigation.navigate("Relaxations")}>
        <Text className="text-center font-bold text-lg">Weelky Sleep Data</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: customSleepData.map(Number), // Use custom sleep data for weekly
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
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Function to get the weekly dates
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

export default WeeklySleepGraph;
