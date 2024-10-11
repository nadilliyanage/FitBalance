import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const AlarmToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [alarmTime, setAlarmTime] = useState(new Date());

  const alarmSound =
    "https://firebasestorage.googleapis.com/v0/b/fitbalace360.appspot.com/o/alarm%2Falarmsound.wav?alt=media&token=cdca16a2-4c28-40fa-b12a-234dc67cf53e";

  // Toggle the alarm on/off
  const toggleSwitch = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    if (newState) {
      // Show toast when turning the alarm on
      Toast.show({
        type: "success",
        text1: "Alarm Enabled",
        text2: "Alarm has been turned on.",
        position: "top",
      });

      // Schedule the alarm with the current alarmTime
      scheduleAlarm(alarmTime);
    } else {
      // Cancel scheduled notifications if the alarm is turned off
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem("alarmTime");

      // Show toast when turning the alarm off
      Toast.show({
        type: "info",
        text1: "Alarm Disabled",
        text2: "Alarm has been turned off.",
        position: "top",
      });
    }

    // Store the updated state in AsyncStorage
    await AsyncStorage.setItem("isEnabled", JSON.stringify(newState));
  };

  // Handle changes in the DateTimePicker
  const onChange = async (event, selectedTime) => {
    const currentTime = selectedTime || alarmTime;
    setShowPicker(false);
    setAlarmTime(currentTime);

    // Schedule the alarm if it's enabled
    if (isEnabled) {
      scheduleAlarm(currentTime);
    }

    // Store the alarm time in AsyncStorage
    await AsyncStorage.setItem("alarmTime", currentTime.toString());
  };

  // Calculate remaining time until the alarm
  const calculateRemainingTime = (time) => {
    const now = new Date();

    // Adjust for the next day if the alarm time is in the past
    if (time < now) {
      time.setDate(time.getDate() + 1); // Set alarm for the next day
    }

    const timeDifference = time - now; // Difference in milliseconds

    // Calculate remaining days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { days, hours, minutes };
  };

  // Schedule the alarm notification
  const scheduleAlarm = async (time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Wake up!",
        body: "It's time for your relaxation session!",
        sound: alarmSound,
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });

    const { days, hours, minutes } = calculateRemainingTime(time);

    // Format remaining time message
    let remainingTimeMessage = "";
    if (days > 0) {
      remainingTimeMessage += `${days} day${days > 1 ? "s" : ""}, `;
    }
    if (hours > 0 || days > 0) {
      remainingTimeMessage += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    remainingTimeMessage += `${minutes} minute${minutes > 1 ? "s" : ""}`;

    // Show toast with remaining time when the alarm is set
    Toast.show({
      type: "success",
      text1: "Alarm Set",
      text2: `Alarm is set for ${remainingTimeMessage} from now`,
      position: "top",
    });
  };

  // Load alarm settings from AsyncStorage
  const loadAlarmSettings = async () => {
    try {
      const savedEnabledState = await AsyncStorage.getItem("isEnabled");
      const savedAlarmTime = await AsyncStorage.getItem("alarmTime");

      if (savedEnabledState !== null) {
        setIsEnabled(JSON.parse(savedEnabledState));
      }

      if (savedAlarmTime !== null) {
        const alarmDate = new Date(savedAlarmTime);
        setAlarmTime(alarmDate);

        // Reschedule the alarm if it's enabled
        if (JSON.parse(savedEnabledState)) {
          scheduleAlarm(alarmDate);
        }
      }
    } catch (error) {
      console.log("Failed to load alarm settings:", error);
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
    };

    requestPermissions();
    loadAlarmSettings(); // Load saved alarm settings when component mounts
  }, []);

  // Helper function to format time in 12-hour format with AM/PM
  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <View className="my-2 bg-white rounded-lg shadow">
      <Text className="font-bold text-lg">Set Alarm</Text>
      <View className="flex flex-row justify-between bg-secondary p-4 m-2 rounded-lg">
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text className="mt-2 text-2xl font-bold text-white">
            {formatTime(alarmTime)}
          </Text>
        </TouchableOpacity>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {showPicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          is24Hour={false} // Set to false to show 12-hour format
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default AlarmToggle;
