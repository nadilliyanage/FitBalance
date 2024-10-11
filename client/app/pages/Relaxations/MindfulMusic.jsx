import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

const MindfulMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showRelaxations, setShowRelaxations] = useState(false); // State to control displaying LazyRelaxations

  // Helper function to format time (mm:ss)
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Fetch music data from Firestore
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const musicCollection = await getDocs(collection(db, "music"));
        const musicData = musicCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMusicList(musicData);
      } catch (error) {
        console.error("Error fetching music data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();

    // Cleanup function to unload sound when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Stop sound when the screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.pauseAsync(); // Pause the sound
          sound.unloadAsync(); // Unload the sound
          setSound(null);
          setIsPlaying(false);
          setCurrentMusic(null);
        }
      };
    }, [sound])
  );

  // Function to handle play/pause music
  const handlePlayPause = async (music) => {
    try {
      if (currentMusic && currentMusic !== music.id) {
        await sound.unloadAsync();
        setIsPlaying(false);
        setPosition(0);
      }

      if (!isPlaying || currentMusic !== music.id) {
        if (currentMusic !== music.id) {
          const { sound: newSound, status } = await Audio.Sound.createAsync(
            { uri: music.url },
            { shouldPlay: true }
          );
          setSound(newSound);
          setCurrentMusic(music.id);
          setDuration(status.durationMillis);
          setIsPlaying(true);

          newSound.setOnPlaybackStatusUpdate((playbackStatus) => {
            if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
              setPosition(playbackStatus.positionMillis);
            }
          });
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error handling play/pause: ", error);
    }
  };

  // Function to handle dragging the slider
  const handleSliderChange = async (value) => {
    if (sound) {
      const newPosition = value * duration;
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  // Function to go back and show LazyRelaxations
  const handleBack = async () => {
    if (sound) {
      await sound.pauseAsync(); // Pause the music before navigating
      await sound.unloadAsync(); // Unload the sound
      setSound(null);
      setIsPlaying(false);
      setCurrentMusic(null);
    }
    setShowRelaxations(true); // Set the state to show LazyRelaxations
  };

  // If showRelaxations is true, render the LazyRelaxations component
  if (showRelaxations) {
    return (
      <Suspense fallback={<ActivityIndicator size="large" color="#6200ee" />}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="flex bg-white">
      <ScrollView>
        <View className="flex absolute w-full h-16 bg-secondary-100 rounded-b-2xl"></View>
        <View className="p-4">
          <View className="flex flex-row items-center justify-center mb-4">
            <TouchableOpacity
              className="absolute left-2"
              onPress={handleBack} // Use handleBack to show LazyRelaxations
            >
              <Ionicons
                name="arrow-back-circle-outline"
                size={34}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white">Mindful Music</Text>
          </View>
          <View className="flex flex-col">
            <Text className="text-xl font-bold mt-4">
              What is Mindful music?
            </Text>
            <Text className="text-sm font-pregular mx-2 mb-2">
              Mindful music promotes relaxation and present-moment awareness
              with soothing melodies and gentle rhythms, helping to reduce
              stress and enhance mindfulness.
            </Text>
          </View>
          {loading ? (
            <View className="flex justify-center items-center ">
              <ActivityIndicator size="large" color="#6200ee" />
              <Text className="mt-2">Loading music...</Text>
            </View>
          ) : (
            <View className="flex flex-col flex-wrap justify-between">
              {musicList.map((music) => (
                <View
                  key={music.id}
                  className="p-4 m-2  bg-gray-100 rounded-lg shadow-lg w-[100%] ml-0"
                >
                  <Image
                    source={{ uri: music.imageUrl }}
                    style={{
                      width: "100%",
                      height: 150,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                  <Text className="text-xl font-semibold">{music.name}</Text>
                  <Text className="text-sm ">{music.description}</Text>
                  <View className="flex flex-row-reverse ">
                    <TouchableOpacity
                      onPress={() => handlePlayPause(music)}
                      className="bg-purple-600 p-2 rounded-full w-10 mb-1 -mt-10"
                    >
                      {isPlaying && currentMusic === music.id ? (
                        <Ionicons name="pause" size={24} color="white" />
                      ) : (
                        <Ionicons name="play" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {currentMusic === music.id && (
                    <View className="-mt-2">
                      <Text className="text-sm text-gray-700">
                        {formatTime(position)} / {formatTime(duration)}
                      </Text>
                      <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={position / duration}
                        minimumTrackTintColor="#6200ee"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#6200ee"
                        onSlidingComplete={handleSliderChange}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MindfulMusic;
