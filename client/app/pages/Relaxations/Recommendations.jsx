import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../../firebaseConfig"; // Adjust the path as necessary
import { collection, query, where, getDocs } from "firebase/firestore";

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

const Recommendations = () => {
  const [back, setBack] = useState(false);
  const [asyncStressLevel, setAsyncStressLevel] = useState(null); // Stress level from AsyncStorage
  const [firestoreStressLevel, setFirestoreStressLevel] = useState(null); // Stress level from Firestore
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchStressLevel = async () => {
      try {
        // Fetch the stress level from AsyncStorage
        const savedStressLevel = await AsyncStorage.getItem("stressRate");
        if (savedStressLevel) {
          setAsyncStressLevel(savedStressLevel);
        }
      } catch (error) {
        console.error("Failed to load stress level from AsyncStorage", error);
      }
    };

    const fetchMediaData = async () => {
      if (
        !asyncStressLevel ||
        !firestoreStressLevel ||
        asyncStressLevel !== firestoreStressLevel
      )
        return;

      try {
        const musicCollection = collection(db, "music");
        const videosCollection = collection(db, "videos");

        // Create queries to fetch data where level matches the stress level
        const musicQuery = query(
          musicCollection,
          where("level", "==", asyncStressLevel)
        );
        const videosQuery = query(
          videosCollection,
          where("level", "==", asyncStressLevel)
        );

        const [musicSnapshot, videosSnapshot] = await Promise.all([
          getDocs(musicQuery),
          getDocs(videosQuery),
        ]);

        // Map the data from snapshots to an array
        const musicData = musicSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const videosData = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Combine the music and videos data
        setMediaData([...musicData, ...videosData]);
      } catch (error) {
        console.error("Failed to load media data", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchStressLevel().then(() => {
      fetchFirestoreStressLevel().then(() => {
        fetchMediaData(); // Call fetchMediaData after both stress levels are fetched
      });
    });
  }, [asyncStressLevel, firestoreStressLevel]); // Run effect when either stress level changes

  const getRecommendations = () => {
    switch (asyncStressLevel) {
      case "High Stress":
        return ["Meditation", "Deep Breathing Exercises", "Gentle Yoga"];
      case "Moderate Stress":
        return ["Short Walks", "Listening to Music", "Journaling"];
      case "Mid Stress":
        return ["Reading", "Creative Hobbies", "Relaxing Bath"];
      case "Low Stress":
      default:
        return [
          "Take a moment to appreciate your day!",
          "Enjoy a favorite hobby.",
        ];
    }
  };

  const recommendations = getRecommendations();

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="flex-1 p-4 justify-center items-center">
            <Text className="text-xl font-bold mb-4">
              Relaxation Recommendations
            </Text>
            {recommendations.map((rec, index) => (
              <Text key={index} className="text-lg mb-2">
                - {rec}
              </Text>
            ))}
            <Text className="text-lg font-bold mt-4">Recommended Media:</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : mediaData.length > 0 ? (
              <FlatList
                data={mediaData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-lg p-4 my-2">
                    <Text className="text-lg font-semibold">{item.title}</Text>
                    <Text className="text-sm">{item.description}</Text>
                  </View>
                )}
              />
            ) : (
              <Text className="text-lg">
                No media available for your stress level.
              </Text>
            )}
            <CustomButton
              title="Back to Relaxations"
              handlePress={() => setBack(true)}
              containerStyles="w-full mt-7"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Recommendations;
