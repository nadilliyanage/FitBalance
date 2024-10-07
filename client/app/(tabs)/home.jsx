import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { AuthContext } from "../../context/authContext";
import Profile from "../pages/profile";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const Home = () => {
  // Global state
  const [state] = useContext(AuthContext);
  const [userName, setUserName] = useState("Guest"); // State to store the user's name
  const [showProfile, setShowProfile] = useState(false);
  const auth = getAuth(); // Get the Auth instance
  const db = getFirestore(); // Get the Firestore instance

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Get the current user
        if (user) {
          const userDocRef = doc(db, "users", user.uid); // Reference to the user's document
          const userDoc = await getDoc(userDocRef); // Get the document

          if (userDoc.exists()) {
            const userData = userDoc.data(); // Fetch user data
            setUserName(userData.username || "No Name"); // Set the username, assuming it's stored under 'username' key
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData(); // Fetch user data on component mount
  }, [auth]);

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
              {userName} {/* Display the user's username */}
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
