import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Dimensions, ActivityIndicator} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressTrackerScreen({ onBackPress }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    bloodSugar: '',
    bloodPressure: '',
    cholesterol: '',
    triglycerides: ''
  });
  const [addData, setAddData] = useState({
    type: '',
    value: '',
    index: undefined
  });

  const [chartData, setChartData] = useState({
    bloodSugar: [],
    bloodPressure: [],
    cholesterol: [],
    triglycerides: []
  });

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncStorage.getItem('healthData');
      console.log('Loaded data from AsyncStorage:', data);
      if (data) {
        const parsedData = JSON.parse(data);
        setChartData({
          bloodSugar: Array.isArray(parsedData.bloodSugar) ? parsedData.bloodSugar : [],
          bloodPressure: Array.isArray(parsedData.bloodPressure) ? parsedData.bloodPressure : [],
          cholesterol: Array.isArray(parsedData.cholesterol) ? parsedData.cholesterol : [],
          triglycerides: Array.isArray(parsedData.triglycerides) ? parsedData.triglycerides : []
        });
      }
    } catch (error) {
      console.error('Error loading data', error);
      setChartData({
        bloodSugar: [],
        bloodPressure: [],
        cholesterol: [],
        triglycerides: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      console.log('Current form data:', formData);  // Log current form data
      const newChartData = {
        bloodSugar: [...chartData.bloodSugar, parseFloat(formData.bloodSugar) || 0],
        bloodPressure: [...chartData.bloodPressure, parseFloat(formData.bloodPressure) || 0],
        cholesterol: [...chartData.cholesterol, parseFloat(formData.cholesterol) || 0],
        triglycerides: [...chartData.triglycerides, parseFloat(formData.triglycerides) || 0]
      };
      
      console.log("Saving Data:", newChartData);
      setChartData(newChartData);
      await AsyncStorage.setItem('healthData', JSON.stringify(newChartData));
      console.log("Data saved successfully");
      
      // Verify the data was saved correctly
      const savedData = await AsyncStorage.getItem('healthData');
      console.log('Verified saved data:', savedData);
      
      setModalVisible(false);
      setFormData({
        bloodSugar: '',
        bloodPressure: '',
        cholesterol: '',
        triglycerides: ''
      });
      
      // Reload the data to ensure it's up to date
      await loadChartData();
    } catch (error) {
      console.error('Error saving data', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  const addNewDataPoint = async () => {
    try {
      const newChartData = { ...chartData };
      const data = [...(newChartData[addData.type] || [])];

      if (addData.index !== undefined && addData.index >= 0) {
        // Update existing data point
        data[addData.index] = parseInt(addData.value) || 0;
      } else {
        // Add new data point
        data.push(parseInt(addData.value) || 0);
      }

      newChartData[addData.type] = data;
      console.log("Updated Data:", newChartData); // Debug log
      setChartData(newChartData);
      await AsyncStorage.setItem('healthData', JSON.stringify(newChartData));
      setAddModalVisible(false);
      setAddData({ type: '', value: '', index: undefined });
    } catch (error) {
      console.error('Error adding/updating data point', error);
    }
  };

  const handleGraphPress = (type, index) => {
    const value = chartData[type]?.[index];
    setAddData({ type, value: value !== undefined ? value.toString() : '', index });
    setAddModalVisible(true);
  };

  const screenWidth = Dimensions.get('window').width;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="p-4 bg-white flex-1">
      <View className="flex-row items-center mt-16">
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-center flex-1 text-black">Progress Tracker</Text>
      </View>

      <ScrollView className="mt-4">
        {['Blood Sugar', 'Blood Pressure', 'Cholesterol', 'Triglycerides'].map((label, index) => {
          const dataKey = label.toLowerCase().replace(' ', '');
          const data = chartData[dataKey] || [];

          console.log(`${label} data:`, data); // Debug log

          if (data.length === 0) {
            return (
              <View key={index} className="mb-4">
                <Text className="text-xl font-bold text-black mb-2">{label}</Text>
                <Text className="text-gray-500">No data available yet.</Text>
              </View>
            );
          }

          return (
            <View key={index}>
              <Text className="text-xl font-bold text-black mb-2">{label}</Text>
              <LineChart
                data={{
                  labels: data.map((_, i) => `Day ${i + 1}`),
                  datasets: [{ data }]
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#f7f7f7",
                  backgroundGradientTo: "#ddd",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
                onDataPointClick={({ index }) => handleGraphPress(dataKey, index)}
              />
            </View>
          );
        })}

        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-4" onPress={() => setModalVisible(true)}>
          <Text className="text-center text-white font-semibold">Add New Data Set</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Adding New Data Set */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-xl font-bold mb-4">Add New Data Set</Text>
            {['Blood Sugar', 'Blood Pressure', 'Cholesterol', 'Triglycerides'].map((label, index) => (
              <TextInput
                key={index}
                placeholder={`${label} (mg/dL or mmHg)`}
                keyboardType="numeric"
                className="border-2 p-2 mb-4 rounded-md"
                value={formData[label.toLowerCase().replace(' ', '')]}
                onChangeText={(text) => {
                  console.log(`Updating ${label}:`, text);  // Log each input change
                  setFormData({ ...formData, [label.toLowerCase().replace(' ', '')]: text });
                }}
              />
            ))}
            <TouchableOpacity className="bg-green-500 p-4 rounded-lg" onPress={saveData}>
              <Text className="text-center text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Adding/Updating Data Points */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-xl font-bold mb-4">{addData.index !== undefined ? 'Edit Data Point' : 'Add New Data Point'}</Text>
            <TextInput
              placeholder="New Value"
              keyboardType="numeric"
              className="border-2 p-2 mb-4 rounded-md"
              value={addData.value}
              onChangeText={(text) => setAddData({ ...addData, value: text })}
            />
            <TouchableOpacity className="bg-green-500 p-4 rounded-lg mb-2" onPress={addNewDataPoint}>
              <Text className="text-center text-white font-semibold">Add / Update</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 p-4 rounded-lg" onPress={() => setAddModalVisible(false)}>
              <Text className="text-center text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}