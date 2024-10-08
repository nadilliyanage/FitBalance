// components/AlarmToggle.js

import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";

const AlarmToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [alarmTime, setAlarmTime] = useState(new Date());

  const alarmSound =
    "https://firebasestorage.googleapis.com/v0/b/fitbalace360.appspot.com/o/alarm%2Fgermany-eas-alarm-1945-242750.mp3?alt=media&token=1a92b062-9e68-47a9-8832-76df9c4d990f";

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || alarmTime;
    setShowPicker(false);
    setAlarmTime(currentTime);
    if (isEnabled) {
      scheduleAlarm(currentTime);
    }
  };

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

    Alert.alert(
      "Alarm Set",
      `Alarm is set for ${time.getHours()}:${
        time.getMinutes() < 10 ? "0" : ""
      }${time.getMinutes()}`
    );
  };

  useEffect(() => {
    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
    };
    requestPermissions();

    if (isEnabled) {
      scheduleAlarm(alarmTime);
    }
  }, [isEnabled]);

  return (
    <View className="my-2 bg-white rounded-lg shadow">
      <Text className="font-bold text-lg">Set Alarm</Text>
      <View className="flex flex-row justify-between bg-secondary p-4 m-2 rounded-lg">
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text className="mt-2 text-2xl font-bold text-white">
            {alarmTime.getHours()}:{alarmTime.getMinutes() < 10 ? "0" : ""}
            {alarmTime.getMinutes()}
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
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default AlarmToggle;
