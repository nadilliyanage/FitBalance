import { View, Text, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from "@expo/vector-icons";

const LazyNutrition = lazy(() => import("../../(tabs)/Nutrition"));

const HealthData = () => {
  const [hemoglobinRange, setHemoglobinRange] = useState('');
  const [bloodSugarRange, setBloodSugarRange] = useState('');
  const [totalCholesterolRange, setTotalCholesterolRange] = useState('');
  const [hdlRange, setHdlRange] = useState('');
  const [ldlRange, setLdlRange] = useState('');
  const [triglyceridesRange, setTriglyceridesRange] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [pastRecords, setPastRecords] = useState([]);
  const [recordsModalVisible, setRecordsModalVisible] = useState(false); // State for records modal

  const [back, setBack] = useState(false);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('healthData');
        const storedRecords = await AsyncStorage.getItem('healthRecords');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSubmittedData(parsedData);
          setHemoglobinRange(parsedData.hemoglobinRange);
          setBloodSugarRange(parsedData.bloodSugarRange);
          setTotalCholesterolRange(parsedData.totalCholesterolRange);
          setHdlRange(parsedData.hdlRange);
          setLdlRange(parsedData.ldlRange);
          setTriglyceridesRange(parsedData.triglyceridesRange);
        }
        if (storedRecords) {
          setPastRecords(JSON.parse(storedRecords));
        }
      } catch (error) {
        console.error('Failed to load health data', error);
      }
    };

    loadHealthData();
  }, []);

  const handleSubmit = async () => {
    const data = {
      hemoglobinRange,
      bloodSugarRange,
      totalCholesterolRange,
      hdlRange,
      ldlRange,
      triglyceridesRange,
      date: new Date().toLocaleString(),
    };

    setSubmittedData(data);
    setModalVisible(false);

    try {
      await AsyncStorage.setItem('healthData', JSON.stringify(data));

      const updatedRecords = [data, ...pastRecords];
      await AsyncStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
      setPastRecords(updatedRecords);
    } catch (error) {
      console.error('Failed to save health data', error);
    }
  };

  const deleteHealthData = async () => {
    Alert.alert(
      "Delete Health Data",
      "Are you sure you want to delete the health data?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('healthData');
              setSubmittedData(null);
              setHemoglobinRange('');
              setBloodSugarRange('');
              setTotalCholesterolRange('');
              setHdlRange('');
              setLdlRange('');
              setTriglyceridesRange('');
              console.log("Health data deleted successfully");
            } catch (error) {
              console.error('Failed to delete health data', error);
            }
          }
        }
      ]
    );
  };

  const deletePastRecord = async (index) => {
    Alert.alert(
      "Delete Past Record",
      "Are you sure you want to delete this past record?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete", 
          onPress: async () => {
            try {
              const updatedRecords = pastRecords.filter((_, recordIndex) => recordIndex !== index);
              await AsyncStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
              setPastRecords(updatedRecords);
              console.log("Past record deleted successfully");
            } catch (error) {
              console.error('Failed to delete past record', error);
            }
          }
        }
      ]
    );
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyNutrition />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1 px-2">
      <View className="flex-row items-center justify-center mb-5">
        {/* Back Button */}
        <TouchableOpacity
          style={{ position: "absolute", left: 10 }}
          onPress={() => setBack(true)}
        >
          <FontAwesome5 name="arrow-left" size={20} color="purple" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Health Data</Text>
      </View>

      {submittedData ? (
        <View className="mb-5 p-4 border border-gray-300 rounded-lg bg-white h-[85%]">
          <Text className="text-3xl font-semibold mb-10 text-center">Submitted Health Data</Text> 
          <Text className="mb-6 text-xl ml-4 font-bold">Hemoglobin:  {submittedData.hemoglobinRange} sfgs</Text>
          <Text className="mb-6 text-xl ml-4 font-bold">Blood Sugar:  {submittedData.bloodSugarRange}</Text>
          <Text className="mb-6 text-xl ml-4 font-bold">Total Cholesterol:  {submittedData.totalCholesterolRange}</Text>
          <Text className="mb-6 text-xl ml-4 font-bold">HDL Cholesterol:  {submittedData.hdlRange}</Text>
          <Text className="mb-6 text-xl ml-4 font-bold">LDL Cholesterol:  {submittedData.ldlRange}</Text>
          <Text className="mb-6 text-xl ml-4 font-bold">Triglycerides:  {submittedData.triglyceridesRange}</Text>

        <View className="absolute inset-x-0 bottom-0 mx-4 ">
          <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-yellow-500 p-4 rounded-xl mb-2">
            <Text className="text-white text-center text-lg">Edit Health Data</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deleteHealthData} className="bg-red-500 p-4 rounded-xl mb-2">
            <Text className="text-white text-center text-lg">Delete Health Data</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRecordsModalVisible(true)} className="bg-blue-500 p-4 rounded-xl mb-4">
            <Text className="text-white text-center text-lg">Past Records</Text>
          </TouchableOpacity>
        </View>
        </View>
      ) : (
        <View className="flex absolute inset-x-0 bottom-0 mx-6 mb-6">
        <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-secondary-300 p-10  mb-4 rounded-xl">
          <Text className="text-white text-center text-xl">Enter Health Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecordsModalVisible(true)} className="bg-secondary p-4 rounded-xl mb-4">
            <Text className="text-white text-center text-lg">Past Records</Text>
          </TouchableOpacity>
        </View>
      )}
      

      {/* Past Records Modal */}
      <Modal
        visible={recordsModalVisible}
        animationType="slide"
        onRequestClose={() => setRecordsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white w-11/12 rounded-lg p-4">
            <Text className="text-lg font-semibold mb-2">Past Records:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pastRecords.map((record, index) => (
                <View key={index} className="bg-gray-100 border border-gray-300 rounded-lg p-4 mr-4">
                  <Text className="mb-2">Hemoglobin: {record.hemoglobinRange}</Text>
                  <Text className="mb-2">Blood Sugar: {record.bloodSugarRange}</Text>
                  <Text className="mb-2">Total Cholesterol: {record.totalCholesterolRange}</Text>
                  <Text className="mb-2">HDL: {record.hdlRange}</Text>
                  <Text className="mb-2">LDL: {record.ldlRange}</Text>
                  <Text className="mb-2">Triglycerides: {record.triglyceridesRange}</Text>
                  <Text className="mb-2">Date: {record.date}</Text> 
                  <TouchableOpacity onPress={() => deletePastRecord(index)} className="bg-red-500 p-2 rounded">
                    <Text className="text-white text-center">Delete Record</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setRecordsModalVisible(false)} className="bg-gray-500 p-2 rounded mt-4">
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white w-11/12 rounded-lg p-4">
            <Text className="text-lg font-semibold mb-2">Health Data Form</Text>

            <View className="mb-4">
              <Text className="mb-2">Hemoglobin Level (g/dL)</Text>
              <Picker selectedValue={hemoglobinRange} style={{ height: 50 }} onValueChange={setHemoglobinRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="12-16 g/dL" value="12-16" />
                <Picker.Item label="Below 12 g/dL" value="below-12" />
                <Picker.Item label="Above 16 g/dL" value="above-16" />
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="mb-2">Fasting Blood Sugar Level (mg/dL)</Text>
              <Picker selectedValue={bloodSugarRange} style={{ height: 50 }} onValueChange={setBloodSugarRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="70-99 mg/dL" value="70-99" />
                <Picker.Item label="100-125 mg/dL" value="100-125" />
                <Picker.Item label="Above 125 mg/dL" value="above-125" />
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="mb-2">Total Cholesterol (mg/dL)</Text>
              <Picker selectedValue={totalCholesterolRange} style={{ height: 50 }} onValueChange={setTotalCholesterolRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="Less than 200 mg/dL" value="less-200" />
                <Picker.Item label="200-239 mg/dL" value="200-239" />
                <Picker.Item label="240 mg/dL and above" value="240+" />
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="mb-2">HDL (Good) Cholesterol (mg/dL)</Text>
              <Picker selectedValue={hdlRange} style={{ height: 50 }} onValueChange={setHdlRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="40-60 mg/dL" value="40-60" />
                <Picker.Item label="Above 60 mg/dL" value="above-60" />
                <Picker.Item label="Below 40 mg/dL" value="below-40" />
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="mb-2">LDL (Bad) Cholesterol (mg/dL)</Text>
              <Picker selectedValue={ldlRange} style={{ height: 50 }} onValueChange={setLdlRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="Less than 100 mg/dL" value="less-100" />
                <Picker.Item label="100-129 mg/dL" value="100-129" />
                <Picker.Item label="Above 129 mg/dL" value="above-129" />
              </Picker>
            </View>

            <View className="mb-4">
              <Text className="mb-2">Triglycerides Level (mg/dL)</Text>
              <Picker selectedValue={triglyceridesRange} style={{ height: 50 }} onValueChange={setTriglyceridesRange}>
                <Picker.Item label="Select range" value="" />
                <Picker.Item label="Less than 150 mg/dL" value="less-150" />
                <Picker.Item label="150-199 mg/dL" value="150-199" />
                <Picker.Item label="200 mg/dL and above" value="200+" />
              </Picker>
            </View>

            <TouchableOpacity onPress={handleSubmit} className="bg-green-500 p-3 rounded mb-2 flex-row items-center justify-center">
              <Text className="text-white">Submit Health Data</Text>
              <Icon name="arrow-right" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-red-500 p-3 rounded">
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
    </SafeAreaView>
  );
};

export default HealthData;
