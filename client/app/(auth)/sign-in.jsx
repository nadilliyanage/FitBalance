import { View, Image, Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

const SignIn = () => {
  //global state
  const [state, setState] = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch and log AsyncStorage data on component mount
  useEffect(() => {
    const getLocalStorageData = async () => {
      try {
        const data = await AsyncStorage.getItem("@auth");
        console.log("Local Storage Data =>", data);
      } catch (error) {
        console.error("Error fetching local storage data:", error);
      }
    };

    getLocalStorageData();
  }, []); // Empty dependency array means it will run once when the component is mounted

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all the fields",
      });
      return;
    }

    // Log the email and password values
    console.log("Email:", form.email);
    console.log("Password:", form.password);

    setIsSubmitting(true);

    try {
      // Make a POST request to your backend to authenticate the user
      const { data } = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // If successful, save the user data locally or in a global state
      if (data.success) {
        const user = data.user;
        const token = data.token;

        setState(data);

        // Save the token and user data to AsyncStorage
        await AsyncStorage.setItem("@auth", JSON.stringify({ user, token }));

        // Navigate to the home screen
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Signed in successfully",
        });
        router.replace("/home");
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Signed in successfully",
        });
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <View className="items-center">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[250px] h-[250px]"
            />
          </View>
          <Text className="text-3xl text-black mt-5 font-psemibold">
            Log in
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-500 font-pregular">
              {" "}
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="font-semibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
