import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import TipsScreen from './TipsScreen';

const TipsForm = ({ onBackPress }) => {
  const [disease, setDisease] = useState('');
  const [loading, setLoading] = useState(false);
  const [diseaseData, setDiseaseData] = useState(null);
  const [tipsScreen, setTipsScreen] = useState(false);
  const [error, setError] = useState(false);
  const [diseases, setDiseases] = useState([]);

  // Display toast notifications for error or info messages
  const showToast = (message, type = 'error') => {
    Toast.show({
      type: type,
      text1: type === 'error' ? 'Error' : 'Information',
      text2: message,
      position: 'bottom',
    });
  };

  useEffect(() => {
    const fetchDiseases = async () => {
      setLoading(true);
      try {
        const diseaseCollection = collection(db, 'diseases');
        const diseaseSnapshot = await getDocs(diseaseCollection);
        const diseaseList = diseaseSnapshot.docs.map(doc => doc.data().disease);
        setDiseases(diseaseList);
      } catch (error) {
        showToast('Failed to fetch diseases: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  // Form validation and Firebase query function
  const validateForm = async () => {
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
        <Picker
          selectedValue={disease}
          onValueChange={(itemValue) => setDisease(itemValue)}
          style={{ height: 50, width: '100%', backgroundColor: 'white' }}
        >
          <Picker.Item label="Select a disease" value="" />
          {diseases.map((diseaseName, index) => (
            <Picker.Item key={index} label={diseaseName} value={diseaseName} />
          ))}
        </Picker>
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
          <TouchableOpacity onPress={onBackPress}>
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
                image={diseaseData?.image}
                onBackPress={() => {
                  setDisease(''); // Reset disease state
                  setTipsScreen(false); // Go back to the TipsForm
                }}
              />
            </ScrollView>}
        </>
      )}
    </View>
  );
};

export default TipsForm;
