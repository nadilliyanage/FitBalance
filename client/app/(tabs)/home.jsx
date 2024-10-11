import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import { AuthContext } from "../../context/authContext";
import Profile from "../pages/profile";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import SavedStressRate from "../pages/Relaxations/SavedStressRate";
import WeeklySleepGraph from "../pages/Relaxations/WeeklySleepGraph";
import Last from "../pages/Nutrition/Last";
import BMIGraph from "../pages/Exercises/BMIGraph";

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
    <SafeAreaView className=" flex-1">
      <View className=" bg-secondary-100 rounded-b-3xl p-6 space-y-6">
        <View className="justify-between items-start flex-row ">
          <TouchableOpacity
            onPress={() => setShowProfile(true)} // Use onPress instead of handlePress
            className="bg-primary rounded-full p-1 absolute right-4"
          >
            <Image
              source={images.profile}
              resizeMode="cover"
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-bold text-white">
              {userName} {/* Display the user's username */}
            </Text>
          </View>
        </View>
        {/* <SearchInput /> */}
      </View>

      <FlatList
        data={[]} // Empty data since you want static components
        keyExtractor={(item, index) => index.toString()} // Unique key for items
        ListHeaderComponent={() => (
          <View>
            <Last />
            <View className="flex flex-row items-center justify-center mt-2 gap-2">
              <View className="flex-1">
                <SavedStressRate />
              </View>

              <View className="flex-1">
                <BMIGraph />
              </View>
            </View>

            <WeeklySleepGraph />
          </View>
        )}
        renderItem={null} // No dynamic items, only header components
        showsVerticalScrollIndicator={false} // Hides the vertical scroll indicator
      />
    </SafeAreaView>
  );
};

export default Home;
