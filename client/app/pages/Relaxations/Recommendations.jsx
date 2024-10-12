import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../../firebaseConfig"; // Adjust the path as necessary
import { collection, query, where, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Video } from "expo-av";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

const Recommendations = () => {
  const [back, setBack] = useState(false);
  const [asyncStressLevel, setAsyncStressLevel] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPositions, setPlaybackPositions] = useState({});
  const [videoDurations, setVideoDurations] = useState({});
  const videoRefs = useRef({});
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchStressLevel = async () => {
      try {
        const savedStressLevel = await AsyncStorage.getItem("stressRate");
        if (savedStressLevel) {
          const parsedStressLevel = JSON.parse(savedStressLevel);
          setAsyncStressLevel(parsedStressLevel);
        } else {
          
        }
      } catch (error) {
        console.error("Failed to load stress level from AsyncStorage", error);
      } finally {
        setLoading(false); // Set loading to false regardless of the outcome
      }
    };

    fetchStressLevel();
  }, []);

  useEffect(() => {
    const fetchMediaData = async () => {
      if (!asyncStressLevel?.level) {
        return; // If no level is set, skip fetching media data
      }

      const level = asyncStressLevel.level;

      try {
        const musicCollection = collection(db, "music");
        const videosCollection = collection(db, "videos");
        const musicQuery = query(musicCollection, where("level", "==", level));
        const videosQuery = query(
          videosCollection,
          where("level", "==", level)
        );

        const [musicSnapshot, videosSnapshot] = await Promise.all([
          getDocs(musicQuery),
          getDocs(videosQuery),
        ]);

        const musicData = musicSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const videosData = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMediaData([...musicData, ...videosData]);
      } catch (error) {
        console.error("Failed to load media data", error);
      }
    };

    fetchMediaData();
  }, [asyncStressLevel]); // Only fetch media data if stress level is set

  const getRecommendations = () => {
    switch (asyncStressLevel?.level) {
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

  const handlePlayPause = async (video) => {
    try {
      const hasPremium = false; // Replace with actual logic to check premium status

      if (!hasPremium) {
        setIsModalVisible(true); // Show modal if no premium access
        return;
      }

      if (currentVideo && currentVideo.id !== video.id) {
        const ref = videoRefs.current[currentVideo.id];
        if (ref) {
          await ref.pauseAsync();
          setIsPlaying(false);
        }
      }

      if (currentVideo?.id === video.id && isPlaying) {
        const ref = videoRefs.current[video.id];
        if (ref) {
          await ref.pauseAsync();
          setIsPlaying(false);
        } else {
          const refToPlay = videoRefs.current[video.id];
          if (refToPlay) {
            await refToPlay.playAsync();
            setIsPlaying(true);
          }
        }
      } else {
        setCurrentVideo(video);
        const ref = videoRefs.current[video.id];
        if (ref) {
          await ref.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error playing/pausing video:", error);
      alert("Could not play or pause the video. Please try again.");
    }
  };

  const handlePlaybackStatusUpdate = (status, videoId) => {
    if (status.isLoaded) {
      setPlaybackPositions((prev) => ({
        ...prev,
        [videoId]: status.positionMillis,
      }));
      setVideoDurations((prev) => ({
        ...prev,
        [videoId]: status.durationMillis,
      }));
    }
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  const handleSliderChange = async (value, videoId) => {
    try {
      const newPosition = value * (videoDurations[videoId] || 0);
      await videoRefs.current[videoId].setPositionAsync(newPosition);
      setPlaybackPositions((prev) => ({ ...prev, [videoId]: newPosition }));
    } catch (error) {
      console.error("Error changing slider position:", error);
      alert("Could not change the playback position. Please try again.");
    }
  };

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="p-4">
        <View className="flex flex-row">
          <TouchableOpacity className="" onPress={() => setBack(true)}>
            <Text className="text-lg font-bold text-purple-500 p-2">
              <Ionicons name="arrow-back-circle-outline" size={34} />
            </Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center mb-4">
            Common Recommendations
          </Text>
        </View>

        {recommendations.map((item, index) => (
          <Text key={index} className="text-lg m-2">
            {item}
          </Text>
        ))}
        <Text className="text-2xl font-bold text-center mb-4">
          Premium Recommendations
        </Text>
        {mediaData.length > 0 ? (
          <FlatList
            className="w-full h-[70%]"
            data={mediaData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-4">
                <TouchableOpacity onPress={() => handlePlayPause(item)}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-48 w-full rounded-lg"
                  />
                  <Text className="text-lg font-semibold mt-2">
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <Video
                  ref={(ref) => {
                    videoRefs.current[item.id] = ref;
                  }}
                  source={{ uri: item.videoUrl }}
                  className="hidden"
                  onPlaybackStatusUpdate={(status) =>
                    handlePlaybackStatusUpdate(status, item.id)
                  }
                  onLoad={() => {
                    setPlaybackPositions((prev) => ({
                      ...prev,
                      [item.id]: 0,
                    }));
                  }}
                />
                <Slider
                  minimumValue={0}
                  maximumValue={1}
                  value={
                    playbackPositions[item.id]
                      ? playbackPositions[item.id] /
                        (videoDurations[item.id] || 1)
                      : 0
                  }
                  onValueChange={(value) => handleSliderChange(value, item.id)}
                />
              </View>
            )}
          />
        ) : (
          <Text className="text-lg text-center">Do the Daily Quiz to see Premium Recommendations</Text>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg shadow-lg">
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)} // Function to close the modal
              className="p-2 px-4 rounded absolute right-0 top-0"
            >
              <FontAwesome name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-bold mb-4">
              Premium Package Required
            </Text>
            <Text className="text-md mb-4">
              To access this content, please subscribe to our premium package.
            </Text>

            <TouchableOpacity className="bg-blue-500 text-white py-2 px-4 rounded">
              <Text className="text-center text-white">Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Recommendations;
