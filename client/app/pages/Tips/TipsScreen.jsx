import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from 'expo-av';
import SideEffectsScreen from './SideEffects';

const TipsScreen = ({ tips, disease, videoURL, onBackPress }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);
  const [sideEffects, setSideEffects] = useState(false);

  const openArticleDetails = (article) => {
    setSelectedArticle(article);
  };

  const closeArticleDetails = () => {
    setSelectedArticle(null);
  };

  const handleVideoError = (error) => {
    console.error("Video playback error:", error);
    setVideoError("Failed to load video. Please try again later.");
    setIsVideoLoading(false);
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    setVideoError(null);
  };

  // if (!tips) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  if(sideEffects){
    return <SideEffectsScreen disease={disease}/>
  }

  

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center mt-16 px-4">
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-pbold text-center flex-1 text-black">
          Tips for {disease}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4 bg-purple-100 p-4 rounded-xl">
          {tips.map((article, index) => (
            <Text
              key={index}
              numberOfLines={3}
              ellipsizeMode="tail"
              className="text-base mb-2 font-pregular"
            >
              • {article}
            </Text>
          ))}
          {tips.join(" ").length > 100 && (
            <TouchableOpacity
              onPress={() => openArticleDetails(tips.join("\n• "))}
              className="mt-2"
            >
              <Text className="text-blue-600 underline font-pregular">See More</Text>
            </TouchableOpacity>
          )}
        </View>

        {videoURL ? (
          <View className="mb-4 p-2 border-2 border-gray-300 rounded-xl bg-white">
            {isVideoLoading && (
              <View className="absolute z-10 w-full h-[200px] justify-center items-center bg-gray-200">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            {videoError && (
              <View className="absolute z-10 w-full h-[200px] justify-center items-center bg-gray-200">
                <Text className="text-red-500 text-center">{videoError}</Text>
              </View>
            )}
            {console.log("Video URL:", videoURL)}
            <Video
              ref={videoRef}
              source={{ uri: videoURL }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              useNativeControls
              style={{ width: "100%", height: 200 }}
              onError={handleVideoError}
              onLoad={handleVideoLoad}
              onLoadStart={() => setIsVideoLoading(true)}
            />
          </View>
        ) : (
          <View className="mb-4 p-4 bg-yellow-100 rounded-xl">
            <Text className="text-yellow-700 font-pregular">
              No video available for this disease.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedArticle !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={closeArticleDetails}
      >
        <BlurView
          intensity={210} // Adjust the intensity of the blur
          style={{ flex: 1 }} // Make sure it covers the entire modal
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-purple-100 p-6 rounded-2xl w-11/12 max-h-4/5">
              <TouchableOpacity
                onPress={closeArticleDetails}
                className="absolute top-4 right-4"
              >
                <Ionicons name="close-circle-outline" size={32} color="black" />
              </TouchableOpacity>
              <ScrollView className="mt-8">
                <Text className="text-lg  font-pregular">{selectedArticle}</Text>
              </ScrollView>
            </View>
          </View>
        </BlurView>
      </Modal>

      <View className="mt-4">
        <TouchableOpacity
          className="bg-violet-500 p-4 rounded-lg"
          onPress={() => setSideEffects(true)}
        >
          <Text className="text-center text-white font-psemibold">
            Side Effects
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TipsScreen;



