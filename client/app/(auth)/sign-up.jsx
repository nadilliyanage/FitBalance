import { View, Image, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { Link, router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

const SignUp = () => {
  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill all fields",
        });

        setLoading(false);
        return;
      }

      // Use the API_BASE_URL for the axios request
      const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: data && data.message,
      });

      router.replace("/sign-in"); // Navigate to the sign-in page
      console.log("Register Data==>", { name, email, password });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "An error occurred",
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 ">
          <View className="items-center">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[250px] h-[250px]"
            />
          </View>
          <Text className="text-3xl text-black mt-1 font-psemibold">
            Sign up
          </Text>

          <FormField
            title="Username"
            value={name}
            handleChangeText={(e) => setName(e)}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={(e) => setPassword(e)}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={loading}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-500 font-pregular">
              Have an account?
            </Text>
            <Link href="/sign-in" className="font-semibold text-secondary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
