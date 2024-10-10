import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
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
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider"; // Import the slider component

const LazyRelaxations = lazy(() => import("../../(tabs)/Relaxations"));

const MindfulVideo = () => {
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showRelaxations, setShowRelaxations] = useState(false);

  // Create a ref for the video player
  const videoRef = useRef(null);

  // Fetch video data from Firestore
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = await getDocs(collection(db, "videos"));
        const videoData = videoCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideoList(videoData);
      } catch (error) {
        console.error("Error fetching video data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to handle play/pause video
  const handlePlayPause = async (video) => {
    if (currentVideo && currentVideo.id === video.id) {
      // If the same video is clicked, toggle play/pause
      setIsPlaying((prev) => !prev);
      if (videoRef.current) {
        if (!isPlaying) {
          await videoRef.current.playAsync(); // Resume playback
        } else {
          await videoRef.current.pauseAsync(); // Pause playback
        }
      }
    } else {
      // Play the new video
      setCurrentVideo(video);
      setIsPlaying(true);
      if (videoRef.current) {
        await videoRef.current.playAsync(); // Start playing the new video
      }
    }
  };

  // Function to go back and show LazyRelaxations
  const handleBack = () => {
    if (currentVideo) {
      setCurrentVideo(null);
      setIsPlaying(false);
      setPlaybackPosition(0);
      setVideoDuration(0);
    }
    setShowRelaxations(true);
  };

  // Update playback position and duration
  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setVideoDuration(status.durationMillis);
    }
  };

  if (showRelaxations) {
    return (
      <Suspense fallback={<ActivityIndicator size="large" color="#6200ee" />}>
        <LazyRelaxations />
      </Suspense>
    );
  }

  // If a video is selected, show the video player
  return (
    <SafeAreaView className="flex bg-white">
      <ScrollView>
        <View className="flex absolute w-full h-16 bg-secondary-100 rounded-b-2xl"></View>
        <View className="p-4">
          <View className="flex flex-row items-center justify-center mb-4">
            <TouchableOpacity className="absolute left-2" onPress={handleBack}>
              <Ionicons
                name="arrow-back-circle-outline"
                size={34}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white">
              Mindful Videos
            </Text>
          </View>
          {loading ? (
            <View className="flex justify-center items-center">
              <ActivityIndicator size="large" color="#6200ee" />
              <Text className="mt-2">Loading videos...</Text>
            </View>
          ) : (
            <View className="flex flex-col flex-wrap justify-between">
              {videoList.map((video) => (
                <View
                  key={video.id}
                  className="p-4 m-2 bg-gray-100 rounded-lg shadow-lg w-[100%] ml-0"
                >
                  {isPlaying && currentVideo?.id === video.id ? (
                    <>
                      <Video
                        ref={videoRef}
                        source={{ uri: video.url }}
                        style={{ width: "100%", height: 150 }}
                        resizeMode="cover"
                        shouldPlay={isPlaying}
                        isLooping
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                      />
                      <View className="mt-2">
                        <Slider
                          style={{ width: "100%", height: 40 }}
                          minimumValue={0}
                          maximumValue={videoDuration}
                          value={playbackPosition}
                          thumbTintColor="#6200ee"
                          onSlidingComplete={(value) => {
                            // Seek to new position
                            videoRef.current?.setPositionAsync(value);
                          }}
                          minimumTrackTintColor="#6200ee"
                          maximumTrackTintColor="#ddd"
                        />
                      </View>
                    </>
                  ) : (
                    <Image
                      source={{ uri: video.imageUrl }}
                      style={{
                        width: "100%",
                        height: 150,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                      resizeMode="cover"
                    />
                  )}
                  <Text className="text-xl font-semibold">{video.name}</Text>
                  <Text className="text-sm">{video.description}</Text>
                  <View className="flex flex-row-reverse">
                    <TouchableOpacity
                      onPress={() => handlePlayPause(video)}
                      className="bg-purple-600 p-2 rounded-full w-10 mb-1 -mt-10"
                    >
                      {isPlaying && currentVideo?.id === video.id ? (
                        <Ionicons name="pause" size={24} color="white" />
                      ) : (
                        <Ionicons name="play" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MindfulVideo;
