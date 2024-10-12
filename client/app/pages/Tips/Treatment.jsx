import React, { Suspense, useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function TreatmentsScreen({ disease, onBackPress}) {
  const [progressTracker,setProgressTracker] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'diseases'), where('disease', '==', disease.trim()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const diseaseData = querySnapshot.docs[0].data();
          setTreatments(diseaseData.treatments || []);
        } else {
          console.log('No details found for this disease.');
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [disease]);

  const ProgressTrackerScreen = React.lazy(() => import('./ProgressTracker'));

  if (progressTracker) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <ProgressTrackerScreen onBackPress={() => setProgressTracker(false)} />
      </Suspense>
    );
  }

  // if(progressTracker){
  //   return <ProgressTrackerScreen />
  // }

  const openTreatments = (treatments) =>{
    setSelectedTreatment(treatments)
  }

  const closeTreatments = () =>{
    setSelectedTreatment(null)
  }

  return (
    <View className="p-4 bg-white flex-1">
      <View className="flex-row items-center mt-16">
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-pbold text-center flex-1 text-black">
          Treatments
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4 bg-purple-100 p-4 rounded-xl">
          {treatments.length > 0 ? (
            treatments.map((treatment, index) => (
              <Text key={index} className="text-base mb-2 font-pregular">
                • {treatment}
              </Text>
            ))
          ) : (
            <Text>No treatments found</Text>
          )}
          {treatments.join(" ").length > 100 && (
            <TouchableOpacity
              onPress={() => openTreatments(treatments.join("\n• "))}
              className="mt-2"
            >
              <Text className="text-blue-600 underline font-pregular">See More</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {selectedTreatment && (
        <Modal
          visible={selectedTreatment !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={closeTreatments}
        >
          <BlurView intensity={210} style={{ flex: 1 }}>
            <View className="flex-1 justify-center items-center">
              <View className="bg-purple-100 p-6 rounded-2xl w-11/12 max-h-4/5">
                <TouchableOpacity
                  onPress={closeTreatments}
                  className="absolute top-4 right-4"
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={32}
                    color="black"
                  />
                </TouchableOpacity>
                <ScrollView className="mt-8">
                  <Text className="text-lg font-pregular">{selectedTreatment }</Text>
                </ScrollView>
              </View>
            </View>
          </BlurView>
        </Modal>
      )}

      <View className="mt-4">
        <TouchableOpacity
          className="bg-violet-500 p-4 rounded-lg"
          onPress={() => setProgressTracker(true)}
        >
          <Text className="text-center text-white font-semibold">
            Progress Tracker
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
