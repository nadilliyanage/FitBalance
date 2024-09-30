import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Button,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"; // For picking images
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

// Set the base URL for axios
axios.defaults.baseURL = API_BASE_URL;

const LazyHome = lazy(() => import("../(tabs)/home"));

const Profile = () => {
  const router = useRouter();
  const [state, setState] = useContext(AuthContext); // Get auth context
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [uploading, setUploading] = useState(false); // For tracking image upload
  const [back, setBack] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (state?.user) {
          const { name, email, profileImage } = state.user;
          setProfile({
            name,
            email,
            profileImage: profileImage || images.profile,
          });
        } else {
          const data = await AsyncStorage.getItem("@auth");
          if (data) {
            const user = JSON.parse(data).user;
            setProfile({
              name: user.name,
              email: user.email,
              profileImage: user.profileImage || images.profile,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    fetchProfileData();
  }, [state]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      await handleImageUpload(result.uri); // Upload the image
    }
  };

  const handleImageUpload = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${state.user._id}`);

      await uploadBytes(storageRef, blob); // Upload the image

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfilePicture(downloadURL);

      setProfile((prev) => ({ ...prev, profileImage: downloadURL }));
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, profileImage: downloadURL },
      }));

      await AsyncStorage.setItem(
        "@auth",
        JSON.stringify({
          ...state,
          user: { ...state.user, profileImage: downloadURL },
        })
      );

      Toast.show({
        type: "success",
        text1: "Profile updated",
        text2: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: "Failed to upload profile picture.",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfilePicture = async (downloadURL) => {
    try {
      await axios.put("/auth/update-profile-picture", {
        profileImage: downloadURL,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message || "Failed to update profile picture.",
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      await AsyncStorage.removeItem("@auth");
      setState({ user: null, token: null });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged out successfully",
      });

      router.replace("/sign-in");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Logout failed",
      });

      console.error("Logout Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/home"); // Redirect to the home page
        return true; // Prevent default behavior (navigation)
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove(); // Cleanup the event listener on unmount
    }, [])
  );

  if (back) {
    return (
      <Suspense fallback={<Text>Loading...</Text>}>
        <LazyHome />
      </Suspense>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 justify-center items-center bg-white px-5">
        <TouchableOpacity
          className="absolute top-10 left-4 z-10 p-2"
          onPress={() => setBack(true)}
        >
          <Text className="text-lg font-bold text-purple-500">
            Back to Home
          </Text>
        </TouchableOpacity>
        {/* Profile Image */}
        <Image
          source={
            profile.profileImage
              ? { uri: profile.profileImage }
              : images.profile
          }
          resizeMode="cover"
          className="w-32 h-32 rounded-full mb-5"
        />

        {/* Button to change profile picture */}
        <Button
          title="Change Profile Picture"
          onPress={pickImage}
          disabled={uploading}
        />

        {/* User's Name */}
        <Text className="text-xl font-semibold mb-2">{profile.name}</Text>

        {/* User's Email */}
        <Text className="text-lg text-gray-500 mb-5">{profile.email}</Text>

        {/* Logout Button */}
        <TouchableOpacity className="my-5" onPress={logout}>
          <Text className="text-lg text-red-500">
            Log Out{"  "}
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-6 h-6 tint-red-500"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
