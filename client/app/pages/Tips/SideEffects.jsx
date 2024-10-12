import React, { Suspense, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SideEffectsScreen({ disease, onBackPress }) {
  const [loading, setLoading] = useState(true);
  const [majorSideEffects, setMajorSideEffects] = useState([]);
  const [minorSideEffects, setMinorSideEffects] = useState([]);
  const [showTreatment, setShowTreatment] = useState(false);

  useEffect(() => {
    const fetchSideEffects = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'diseases'), where('disease', '==', disease.trim()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const diseaseData = querySnapshot.docs[0].data();
          setMajorSideEffects(diseaseData.majorSideEffects || []);
          setMinorSideEffects(diseaseData.minorSideEffects || []);
        } else {
          console.log('No details found for this disease.');
        }
      } catch (error) {
        console.error('Error fetching side effects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSideEffects();
  }, [disease]);

  const TreatmentScreen = React.lazy(() => import('./Treatment'));

  if (showTreatment) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <TreatmentScreen disease={disease} onBackPress={() => setShowTreatment(false)} />
      </Suspense>
    );
  }

  return (
    <View className="bg-white flex-1">
      <View className="flex-row items-center mt-16 px-4">
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-pbold text-center flex-1 text-black">
          Side Effects
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView className="mt-4">
          <View className="mb-4 bg-purple-100 p-4 rounded-xl">
            {majorSideEffects.length > 0 && (
              <>
                <Text className="text-xl font-psemibold mb-2">
                  Major Side Effects
                </Text>
                {majorSideEffects.map((effect, index) => (
                  <Text key={index} className="text-base mb-2 font-pregular">
                    • {effect}
                  </Text>
                ))}
              </>
            )}
          </View>
          <View className="mb-4 bg-purple-100 p-4 rounded-xl">
            {minorSideEffects.length > 0 && (
              <>
                <Text className="text-xl font-psemibold mb-2">
                  Minor Side Effects
                </Text>
                {minorSideEffects.map((effect, index) => (
                  <Text key={index} className="text-base mb-2 font-pregular">
                    • {effect}
                  </Text>
                ))}
              </>
            )}
          </View>

          {majorSideEffects.length === 0 && minorSideEffects.length === 0 && (
            <Text className="text-base mb-2 font-pregular">No side effects found.</Text>
          )}
        </ScrollView>
      )}

      <View className="mt-4">
        <TouchableOpacity
          className="bg-violet-500 p-4 rounded-lg"
          onPress={() => setShowTreatment(true)}
        >
          <Text className="text-center text-white font-psemibold">
            Treatments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}