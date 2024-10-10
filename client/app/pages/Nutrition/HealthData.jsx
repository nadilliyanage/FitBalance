import { View, Text, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';

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
  const getHealthComment = () => {
    let comment = "Health Assessment: ";
  
    // Example criteria for comments
    if (submittedData.hemoglobinRange === "below-12") {
      comment += "Hemoglobin level is low. Consider consulting a doctor.";
    } else if (submittedData.hemoglobinRange === "above-16") {
      comment += "Hemoglobin level is high. Monitor your diet.";
    } else {
      comment += "Hemoglobin level is normal.";
    }
  
    if (submittedData.bloodSugarRange === "above-125") {
      comment += " Blood sugar level is high. Consider dietary adjustments.";
    } else if (submittedData.bloodSugarRange === "100-125") {
      comment += " Blood sugar level is borderline. Monitor closely.";
    } else {
      comment += " Blood sugar level is normal.";
    }
  
    if (submittedData.totalCholesterolRange === "240+") {
      comment += " Total cholesterol is high. Consult a healthcare professional.";
    } else if (submittedData.totalCholesterolRange === "200-239") {
      comment += " Total cholesterol is borderline high.";
    } else {
      comment += " Total cholesterol is normal.";
    }
  
    if (submittedData.hdlRange === "below-40") {
      comment += " HDL cholesterol is low. Consider lifestyle changes.";
    } else if (submittedData.hdlRange === "above-60") {
      comment += " HDL cholesterol is good.";
    }
  
    if (submittedData.ldlRange === "above-129") {
      comment += " LDL cholesterol is high. Consider consulting a doctor.";
    } else if (submittedData.ldlRange === "100-129") {
      comment += " LDL cholesterol is borderline high.";
    }
  
    if (submittedData.triglyceridesRange === "200+") {
      comment += " Triglycerides level is high. Monitor your diet.";
    } else if (submittedData.triglyceridesRange === "150-199") {
      comment += " Triglycerides level is borderline high.";
    }
  
    return comment;
  };

  return (
    <SafeAreaView className="bg-gray-50 flex-1 pt-4 px-4">
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
        <View className="mb-5 p-4 border border-gray-300 rounded-lg bg-white h-min">
         
          <Text className="text-3xl font-semibold mb-10 text-center">Submitted Health Data</Text> 
          <View className="bg-white shadow-xl shadow-black rounded-lg p-4">
          <Text className="mb-2 text-xl ml-4 font-bold">Hemoglobin:  {submittedData.hemoglobinRange} sfgs</Text>
          <Text className="mb-2 text-xl ml-4 font-bold">Blood Sugar:  {submittedData.bloodSugarRange}</Text>
          <Text className="mb-2 text-xl ml-4 font-bold">Total Cholesterol:  {submittedData.totalCholesterolRange}</Text>
          <Text className="mb-2 text-xl ml-4 font-bold">HDL Cholesterol:  {submittedData.hdlRange}</Text>
          <Text className="mb-2 text-xl ml-4 font-bold">LDL Cholesterol:  {submittedData.ldlRange}</Text>
          <Text className="mb-2 text-xl ml-4 font-bold">Triglycerides:  {submittedData.triglyceridesRange}</Text>
          </View>
        <ScrollView className="h-[40%] bg-secondary-100/40 w-[75%] rounded-lg my-10">
          <View className="inset-x-0 bottom-0 mx-4 py-6">
            <Text className="text-lg font-bold mb-2  text-black">{getHealthComment()}</Text>
          </View>
          </ScrollView>
        
        <View className=" absolute bottom-0 mx-14 my-16  ">
          <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-yellow-500 p-4 rounded-xl mb-8 w-16 ml-64">
            <Text className="text-white text-center text-lg"><Feather name="edit-3" size={28} color="white" /></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deleteHealthData} className="bg-red-500 p-4 rounded-xl mb-8 w-16  ml-64">
            <Text className="text-white text-center text-lg"><MaterialIcons name="delete-outline" size={28} color="white" /></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRecordsModalVisible(true)} className="bg-blue-500 p-4 rounded-xl mb-4 w-16  ml-64">
            <Text className="text-white text-center text-lg"><MaterialIcons name="history" size={28} color="white" /></Text>
          </TouchableOpacity>
        </View>
        </View>
      ) : (
        <View className="flex mx-6 mb-6">
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
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRecordsModalVisible(false)}
      ><BlurView
      intensity={180} // Adjust the intensity of the blur
      style={{ flex: 1 }} // Make sure it covers the entire modal
    >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white  shadow-2xl shadow-black w-11/12 rounded-lg p-4 h-[75%]">
          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold my-2 ">Past Records</Text>
            <TouchableOpacity onPress={() => setRecordsModalVisible(false)} >
              <Text><FontAwesome name="close" size={34} color="black" /></Text>
            </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pastRecords.map((record, index) => (
                <View key={index} className="bg-secondary border border-gray-300 rounded-lg p-4 mr-4 mt-2 w-fit ">
                  <Text className="mt-2 mb-6 text-xl font-pmedium text-white">Hemoglobin: {record.hemoglobinRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white ">Blood Sugar: {record.bloodSugarRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white">Total Cholesterol: {record.totalCholesterolRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white">HDL: {record.hdlRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white">LDL: {record.ldlRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white">Triglycerides: {record.triglyceridesRange}</Text>
                  <Text className="mb-6 text-xl font-pmedium text-white">Date: {record.date}</Text> 
                  <TouchableOpacity onPress={() => deletePastRecord(index)} className="bg-white p-2 m-4 rounded-lg flex absolute bottom-0 right-0 w-14 ">
                    <Text className="text-white text-center"><MaterialIcons name="delete-outline" size={28} color="red" /></Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          
          </View>
        </View>
        </BlurView>
      </Modal>

      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
    <View className="bg-purple-200 w-11/12 rounded-lg p-6 ">
      <Text className="text-2xl font-bold text-center mb-4">Health Data</Text>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">Hemoglobin Level (g/dL)</Text>
        <Picker selectedValue={hemoglobinRange} style={{ height: 50 }} onValueChange={setHemoglobinRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="12-16 g/dL" value="12-16" />
          <Picker.Item label="Below 12 g/dL" value="below-12" />
          <Picker.Item label="Above 16 g/dL" value="above-16" />
        </Picker>
      </View>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">Fasting Blood Sugar Level (mg/dL)</Text>
        <Picker selectedValue={bloodSugarRange} style={{ height: 50 }} onValueChange={setBloodSugarRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="70-99 mg/dL" value="70-99" />
          <Picker.Item label="100-125 mg/dL" value="100-125" />
          <Picker.Item label="Above 125 mg/dL" value="above-125" />
        </Picker>
      </View>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">Total Cholesterol (mg/dL)</Text>
        <Picker selectedValue={totalCholesterolRange} style={{ height: 50 }} onValueChange={setTotalCholesterolRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 200 mg/dL" value="less-200" />
          <Picker.Item label="200-239 mg/dL" value="200-239" />
          <Picker.Item label="240 mg/dL and above" value="240+" />
        </Picker>
      </View>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">HDL (Good) Cholesterol (mg/dL)</Text>
        <Picker selectedValue={hdlRange} style={{ height: 50 }} onValueChange={setHdlRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="40-60 mg/dL" value="40-60" />
          <Picker.Item label="Above 60 mg/dL" value="above-60" />
          <Picker.Item label="Below 40 mg/dL" value="below-40" />
        </Picker>
      </View>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">LDL (Bad) Cholesterol (mg/dL)</Text>
        <Picker selectedValue={ldlRange} style={{ height: 50 }} onValueChange={setLdlRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 100 mg/dL" value="less-100" />
          <Picker.Item label="100-129 mg/dL" value="100-129" />
          <Picker.Item label="Above 129 mg/dL" value="above-129" />
        </Picker>
      </View>

      <View className="mb-4 bg-white p-2 rounded-lg">
        <Text className=" font-bold text-lg">Triglycerides Level (mg/dL)</Text>
        <Picker selectedValue={triglyceridesRange} style={{ height: 50 }} onValueChange={setTriglyceridesRange}>
          <Picker.Item label="Select range" value="" />
          <Picker.Item label="Less than 150 mg/dL" value="less-150" />
          <Picker.Item label="150-199 mg/dL" value="150-199" />
          <Picker.Item label="200 mg/dL and above" value="200+" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSubmit} className="bg-purple-500 p-3 rounded-xl mb-2 flex-row items-center justify-center">
        <Text className="text-white font-bold text-lg">Submit  </Text>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-red-500 p-3 rounded-xl">
        <Text className="text-white text-center text-lg">Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default HealthData;
