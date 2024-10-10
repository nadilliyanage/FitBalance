import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import TipsScreen from './TipsScreen';
import SideEffectsScreen from './SideEffects';

const TipsForm = () => {
  const [disease, setDisease] = useState('');
  const [onsetTime, setOnsetTime] = useState('');
  const [treatment, setTreatment] = useState('');
  const [loading, setLoading] = useState(false);
  const [diseaseData, setDiseaseData] = useState(null);
  const [tipsScreen, setTipsScreen] = useState(false);
  const [error, setError] = useState(false);

  // Display toast notifications for error or info messages
  const showToast = (message, type = 'error') => {
    Toast.show({
      type: type,
      text1: type === 'error' ? 'Error' : 'Information',
      text2: message,
      position: 'bottom',
    });
  };

  // Form validation and Firebase query function
  const validateForm = async () => {
    // if (disease.trim() === "" || onsetTime.trim() === "" || treatment === "") 
    if (disease.trim() === "" )
      {
      showToast("Please fill all fields!!");
      return false; // Return false if validation fails
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, 'diseases'), where('disease', '==', disease.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const diseaseData = querySnapshot.docs[0].data();
        console.log('Disease data:', diseaseData);
        setDiseaseData(diseaseData); // Set the disease data from Firestore
        setTipsScreen(true); // Navigate to the TipsScreen
      } else {
        Alert.alert('Error', 'No details found for this disease. Please check the spelling and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-4">
      <View className="bg-purple-300 p-6 rounded-xl mt-8">
        <Text className="text-lg mb-2 font-pregular">Select Disease:</Text>
        <TextInput
          className="bg-white p-3 mb-4 rounded-2xl text-black font-pregular"
          placeholder="Enter Disease"
          value={disease}
          onChangeText={setDisease}
        />

        <View className="mt-4">
          <TouchableOpacity
            className="bg-violet-500 p-4 rounded-lg"
            onPress={validateForm}
          >
            <Text className="text-center text-white font-psemibold">
              Show Tips
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Main return block of the component
  return (
    <View className="p-4 bg-white flex-1">
      {!tipsScreen && (
        <View className="flex-row items-center mt-16">
          <TouchableOpacity onPress={() => setTipsScreen(false)}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-pbold text-center flex-1 text-black">
            Health Info
          </Text>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!tipsScreen && renderForm()}
          {tipsScreen && <ScrollView className="flex-1">
              <TipsScreen 
                tips={diseaseData?.articles} 
                disease={disease} 
                videoURL={diseaseData?.videoURL} 
              />
            </ScrollView>}
        </>
      )}
    </View>
  );
};

export default TipsForm;
