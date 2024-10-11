import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Button,
  BackHandler,
  Modal,
  TextInput,
  ActivityIndicator,
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
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const [updating, setUpdating] = useState(false);
  const [back, setBack] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // Logout modal state
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
            setNewName(userData.username || "");
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
            setNewName(storedUser.name || "");
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

      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
      await updateDoc(doc(getFirestore(), "users", user.uid), {
        profileImage: downloadURL,
      });

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
        text2: error.message || "Failed to upload profile picture.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      await updateProfile(user, { displayName: newName });
      await updateDoc(doc(getFirestore(), "users", user.uid), {
        username: newName,
      });

      setProfile((prev) => ({ ...prev, name: newName }));
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, name: newName },
      }));

      await AsyncStorage.setItem(
        "@auth",
        JSON.stringify({
          ...state,
          user: { ...state.user, name: newName },
        })
      );

      Toast.show({
        type: "success",
        text1: "Profile updated",
        text2: "Your name has been updated.",
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: error.message || "Failed to update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const logout = async () => {
    setLogoutModalVisible(false); // Close the logout confirmation modal
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

  const confirmLogout = () => {
    setLogoutModalVisible(true); // Open logout confirmation modal
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
          <Text className="text-lg font-bold text-secondary-100 p-2">
            <Ionicons
              className="text-secondary-100"
              name="arrow-back-circle-outline"
              size={34}
            />
          </Text>
        </TouchableOpacity>

        {/* Make the Image component tappable */}
        <TouchableOpacity onPress={pickImage}>
          {uploading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Image
              source={
                typeof profile.profileImage === "string" &&
                profile.profileImage !== ""
                  ? { uri: profile.profileImage }
                  : images.profile // Fallback to a default profile image
              }
              className="w-36 h-36 rounded-full border-2 border-gray-200 mb-4"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-1">{profile.name}</Text>
        <Text className="text-sm font-medium text-gray-500 mb-5">
          {profile.email}
        </Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-secondary-300 px-4 py-3  rounded-lg mt-4 w-3/4"
        >
          <Text className="text-white font-semibold text-center">
            Edit your Name
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmLogout} // Show logout confirmation modal
          className="bg-red-500 px-4 py-3 rounded-lg mt-4  w-3/4"
        >
          <Text className="text-white font-semibold text-center">Logout</Text>
        </TouchableOpacity>

        {/* Edit Name Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 ">
            <View className="bg-white p-5 rounded-lg w-11/12">
              <Text className="text-xl font-semibold mb-2">Edit Your Name</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your new name"
                className="border-b-2 border-gray-300 mb-4 p-2 font-semibold"
              />
              {updating ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  className="bg-secondary-300 p-2 rounded-lg mb-2"
                >
                  <Text className="text-white font-semibold text-center">
                    Update
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 p-2 rounded-lg mb-2"
              >
                <Text className="text-white font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={logoutModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-5 rounded-lg w-11/12">
              <Text className="text-lg font-semibold mb-2">
                Are you sure you want to log out?
              </Text>
              <View className="flex-row-reverse">
                <TouchableOpacity
                  className="bg-red-600 px-6 py-2 rounded-lg m-2"
                  onPress={logout}
                >
                  <Text className="text-white font-semibold">Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-400 px-6 py-2 rounded-lg m-2"
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text className="text-white font-semibold">No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
