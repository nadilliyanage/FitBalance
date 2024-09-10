import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image } from "react-native";
import { useContext, useEffect } from "react";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../context/authContext";

export default function Index() {
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    if (authState.user && authState.token) {
      router.push("/home"); // Redirect to home if user is logged in
    }
  }, [authState]);

  const handlePress = () => {
    if (authState.user && authState.token) {
      router.push("/home"); // Redirect to home if user is logged in
    } else {
      router.push("/sign-in"); // Redirect to sign-in if user is not logged in
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <View className="relative mt-6">
            <Text className="text-5xl text-black font-bold text-center">
              FitBalance<Text className="text-secondary-200">360</Text>
            </Text>
          </View>

          <Image
            source={images.logo}
            className="max-w-[380] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              {" "}
              Unlock Your Full Potential with{" "}
              <Text className="text-secondary-200">FitBalance360</Text>
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mt-7 font-pregular text-center">
            Elevate your fitness journey with FitBalance360 – Your all-in-one
            guide to a healthier, stronger you!
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={handlePress}
            containerStyles="w-full mt-7 "
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
