import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useContext, useState } from "react";
import { icons, images } from "../../constants";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { AuthContext } from "../../context/authContext";
import Profile from "../pages/profile";

const Home = () => {
  //global state
  const [state] = useContext(AuthContext);

  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return <Profile />; // Display the Profile directly
  }

  return (
    <SafeAreaView className="bg-secondary-100 rounded-b-3xl">
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6">
          <TouchableOpacity
            onPress={() => setShowProfile(true)} // Use onPress instead of handlePress
            className="bg-primary rounded-full p-1 absolute right-4"
          >
            <Image
              source={images.profile}
              resizeMode="cover"
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {state?.user?.name || "Guest"}
            </Text>
          </View>
        </View>
        <SearchInput />
      </View>

      <FlatList
        className="bg-black-200"
        data={[{ id: 1 }]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text className="text-3xl">{item.id}</Text>}
        ListHeaderComponent={() => <View></View>}
      />
    </SafeAreaView>
  );
};

export default Home;
