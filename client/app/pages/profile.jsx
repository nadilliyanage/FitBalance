import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Button,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { useRouter } from "expo-router";
import { icons, images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore
import { useFocusEffect } from "@react-navigation/native";

const LazyHome = lazy(() => import("../(tabs)/home"));

const Profile = () => {
  const router = useRouter();
  const [state, setState] = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const [back, setBack] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              name: userData.username || "No Name",
              email: userData.email || "No Email",
              profileImage: userData.profileImage || images.profile,
            });
          } else {
            console.log("No such user in Firestore");
          }
        } else {
          const data = await AsyncStorage.getItem("@auth");
          if (data) {
            const storedUser = JSON.parse(data).user;
            setProfile({
              name: storedUser.name || "No Name",
              email: storedUser.email || "No Email",
              profileImage: storedUser.profileImage || images.profile,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    fetchProfileData();
  }, [user]);

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
      await handleImageUpload(result.uri);
    }
  };

  const handleImageUpload = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Failed to fetch image for upload.");
      }
      const blob = await response.blob();

      console.log("Blob created:", blob); // Log blob for debugging

      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

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
      console.error("Error uploading image:", error); // Log full error object
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: error.message || "Failed to upload profile picture.",
      });
    } finally {
      setUploading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
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
        text2: error.message || "Logout failed",
      });

      console.error("Logout Error:", {
        message: error.message,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/home");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
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
        <Image
          source={
            profile.profileImage
              ? { uri: profile.profileImage }
              : images.profile
          }
          className="w-36 h-36 rounded-full border-2 border-gray-200 mb-4"
          resizeMode="cover"
        />
        <Text className="text-2xl font-semibold mb-1">{profile.name}</Text>
        <Text className="text-sm font-medium text-gray-500 mb-5">
          {profile.email}
        </Text>
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <View className="bg-purple-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold">
              {uploading ? "Uploading..." : "Edit Profile Picture"}
            </Text>
          </View>
        </TouchableOpacity>
        <Button title="Logout" onPress={logout} color="#841584" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
