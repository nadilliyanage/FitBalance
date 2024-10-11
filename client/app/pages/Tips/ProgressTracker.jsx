import React, { useState, useEffect, lazy } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressTrackerScreen({ onBackPress }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFirstDataButton, setShowAddFirstDataButton] = useState(true);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
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
      if (data) {
        const parsedData = JSON.parse(data);
        setChartData({
          bloodSugar: Array.isArray(parsedData.bloodSugar) ? parsedData.bloodSugar : [],
          bloodPressure: Array.isArray(parsedData.bloodPressure) ? parsedData.bloodPressure : [],
          cholesterol: Array.isArray(parsedData.cholesterol) ? parsedData.cholesterol : [],
          triglycerides: Array.isArray(parsedData.triglycerides) ? parsedData.triglycerides : []
        });
        setShowAddFirstDataButton(false);
      } else {
        setShowAddFirstDataButton(true);
      }
    } catch (error) {
      console.error('Error loading data', error);
      setChartData({
        bloodSugar: [],
        bloodPressure: [],
        cholesterol: [],
        triglycerides: []
      });
      setShowAddFirstDataButton(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      const newChartData = {
        bloodSugar: [...chartData.bloodSugar, parseFloat(formData.bloodSugar) || 0],
        bloodPressure: [...chartData.bloodPressure, parseFloat(formData.bloodPressure) || 0],
        cholesterol: [...chartData.cholesterol, parseFloat(formData.cholesterol) || 0],
        triglycerides: [...chartData.triglycerides, parseFloat(formData.triglycerides) || 0]
      };
      
      setChartData(newChartData);
      await AsyncStorage.setItem('healthData', JSON.stringify(newChartData));
      
      setModalVisible(false);
      setFormData({
        bloodSugar: '',
        bloodPressure: '',
        cholesterol: '',
        triglycerides: ''
      });
      setShowAddFirstDataButton(false);
      
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
        data[addData.index] = parseFloat(addData.value) || 0;
      } else {
        // Add new data point
        data.push(parseFloat(addData.value) || 0);
      }

      newChartData[addData.type] = data;
      setChartData(newChartData);
      await AsyncStorage.setItem('healthData', JSON.stringify(newChartData));
      setAddModalVisible(false);
      setAddData({ type: '', value: '', index: undefined });
    } catch (error) {
      console.error('Error adding/updating data point', error);
    }
  };

  const handleGraphPress = (type) => {
    setActionType(type);
    setActionModalVisible(true);
  };


  const renderChart = (label, dataKey) => {
    const data = chartData[dataKey] || [];
    const screenWidth = Dimensions.get('window').width;

    if (data.length === 0) {
      return (
        <View className="mb-4">
          <Text className="text-xl font-bold text-black mb-2">{label}</Text>
          <Text className="text-gray-500">No data available yet.</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => handleGraphPress(dataKey)}>
        <View className="mb-4">
          <Text className="text-xl font-bold text-black mb-2">{label}</Text>
          <LineChart
            data={{
              labels: data
                .slice(-6)
                .map((_, i) => `Month ${data.length - 5 + i}`),
              datasets: [{ data: data.slice(-6) }],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#f7f7f7",
              backgroundGradientTo: "#ddd",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text className="text-3xl font-bold text-center flex-1 text-black">
          Progress Tracker
        </Text>
      </View>

      {showAddFirstDataButton ? (
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mt-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-center text-white font-semibold">
            Add First Data Set
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView className="mt-4">
          {renderChart("Blood Sugar", "bloodSugar")}
          {renderChart("Blood Pressure", "bloodPressure")}
          {renderChart("Cholesterol", "cholesterol")}
          {renderChart("Triglycerides", "triglycerides")}

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg mt-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-center text-white font-semibold">
              Add New Data Set
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal for Adding New Data Set */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-xl font-bold mb-4">Add New Data Set</Text>
            {[
              "Blood Sugar",
              "Blood Pressure",
              "Cholesterol",
              "Triglycerides",
            ].map((label, index) => (
              <TextInput
                key={index}
                placeholder={`${label} (mg/dL or mmHg)`}
                keyboardType="numeric"
                className="border-2 p-2 mb-4 rounded-md"
                value={formData[label.toLowerCase().replace(" ", "")]}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    [label.toLowerCase().replace(" ", "")]: text,
                  })
                }
              />
            ))}
            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg"
              onPress={saveData}
            >
              <Text className="text-center text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Adding/Updating Data Points */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-xl font-bold mb-4">
              {addData.index !== undefined
                ? "Edit Data Point"
                : "Add New Data Point"}
            </Text>
            <TextInput
              placeholder="New Value"
              keyboardType="numeric"
              className="border-2 p-2 mb-4 rounded-md"
              value={addData.value}
              onChangeText={(text) => setAddData({ ...addData, value: text })}
            />
            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg mb-2"
              onPress={addNewDataPoint}
            >
              <Text className="text-center text-white font-semibold">
                {addData.index !== undefined ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-lg"
              onPress={() => setAddModalVisible(false)}
            >
              <Text className="text-center text-white font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={actionModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-xl font-bold mb-4">Choose Action</Text>

            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg mb-2"
              onPress={() => {
                setAddData({ type: actionType, value: "", index: undefined });
                setAddModalVisible(true);
                setActionModalVisible(false);
              }}
            >
              <Text className="text-center text-white font-semibold">
                Add New Data
              </Text>
            </TouchableOpacity>

            {/* Update Existing Data Button */}
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg mb-2"
              onPress={() => {
                // Automatically set the index to the last data point
                const lastIndex = chartData[actionType].length - 1;
                if (lastIndex >= 0) {
                  setAddData({
                    type: actionType,
                    value: chartData[actionType][lastIndex].toString(),
                    index: lastIndex,
                  });
                  setAddModalVisible(true);
                  setActionModalVisible(false);
                } else {
                  Alert.alert(
                    "No Data Available",
                    "There is no existing data to update."
                  );
                }
              }}
            >
              <Text className="text-center text-white font-semibold">
                Update Last Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 p-4 rounded-lg"
              onPress={() => setActionModalVisible(false)}
            >
              <Text className="text-center text-white font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}